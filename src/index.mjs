import Axios from "axios";
import fs, { accessSync } from "fs";
import async from "async";
import ics from "ics";

const STUDIES_API_BASE = "https://studies.helsinki.fi";

const axios = Axios.create({
  baseURL: STUDIES_API_BASE,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @returns {Promise<import("./api").Hit[]>}
 */
async function fetchCourseList() {
  const CS_BSC = "hy-org-116738259";
  const CS_MSC = "hy-org-116716376";
  const LANG = "fi";

  /**
   /api/search/courses
    lang=fi
    organisation=hy-org-116738259
    organisation=hy-org-116716376
    page=0
    period=hy-university-root-id%2F2022%2F0%2F1
    studyYear=2022
    type=urn%3Acode%3Aassessment-item-type%3Ateaching-participation
   */
  const allHits = [];

  for (let page = 0; ; page++) {
    const params = new URLSearchParams([
      ["lang", LANG],
      ["organisation", CS_BSC],
      ["organisation", CS_MSC],
      ["period", "hy-university-root-id/2022/0/1"],
      ["studyYear", "2022"],
      ["type", "urn:code:assessment-item-type:teaching-participation"],
      ["searchText", ""],
      ["page", page],
    ]);

    const result = await axios.get("/api/search/courses", {
      params: params,
    });

    allHits.push(...result.data.hits);

    if (
      allHits.length >= result.data.totalHits ||
      !result.data.hits ||
      result.data.hits.length === 0
    ) {
      break;
    }

    // https://studies.helsinki.fi/api/courses/cur/hy-opt-cur-2223-9ed7d99e-6065-4f1d-94c2-27a052565879?languageCode=fi
    await delay(200);
    console.log(`${allHits.length}/${result.data.totalHits}`);
  }

  return allHits;
}

async function fetchCourseDetails(courseId) {
  const url = `/api/courses/cur/${encodeURI(courseId)}?languageCode=fi`;
  const response = await axios.get(url);
  return response.data;
}

// const courses = await fetchCourseList();
/**
 * @type {import("./api").Hit[]}
 */
const courses = JSON.parse(
  await fs.promises.readFile("./dump.json", "utf-8")
).flatMap((c) => c.hits);
// await fs.promises.writeFile("./dump2.json", JSON.stringify(courses));

/**
 * @returns {Promise<Map<string, import("./api").CourseDetails>>}
 */
const getDetailsMap = async () => {
  /**F
   * @type {import("./api").CourseDetails[]}
   */
  const allDetails = JSON.parse(
    await fs.promises.readFile("./details.json", "utf-8")
  );

  return allDetails.reduce((acc, val) => {
    acc.set(val.id, val);
    return acc;
  }, new Map());
};
const allCourseDetails = await getDetailsMap();

/**
 *
 * @param {import("./api").LocalizedString} l
 * @param {string|undefined} lang
 * @returns {string|undefined|null}
 */
const localized = (l, lang) => {
  if (lang) return l[lang];
  return l.fi || l.en || l.sv;
};

const allLocalized = (names) => [names.fi, names.en, names.sv].filter(Boolean);

const detailedCourses = courses.map((c) => ({
  ...c,
  details: allCourseDetails.get(c.curId),
}));

/**
 * @param {import("./api").StudyGroupSet} studyGroupSet
 */
const isLectureStudyGroupSet = (studyGroupSet) => {
  return allLocalized(studyGroupSet.name)
    .map((n) => n.toLowerCase())
    .some(
      (name) =>
        name.includes("luento") ||
        name.includes("luennot") ||
        name.includes("lecture")
    );
};

const lectures = detailedCourses
  .filter((course) =>
    course.details.studyGroupSets.some(isLectureStudyGroupSet)
  )
  .map((course) => {
    const name = localized(course.cuName);
    const code = course.code;
    const lectureGroups = course.details.studyGroupSets.filter(
      isLectureStudyGroupSet
    );

    const studyGroupInstances = lectureGroups
      .flatMap((lg) =>
        lg.studySubGroups.map((sg) => ({
          name: localized(sg.name),
          events: sg.studyEvents
            .flatMap((ev) =>
              ev.events.map((e) => ({ ...e, locations: ev.locations }))
            )
            .sort((a, b) => Date.parse(a.start) - Date.parse(b.start)),
        }))
      )
      .filter((sp) => sp.events.length > 0);

    return {
      name,
      code,
      organisations: course.details.organisations,
      hit: course,
      lectures: studyGroupInstances
        .flatMap((studyGroupInstance) =>
          studyGroupInstance.events.map((e) => ({
            ...e,
            studyGroupType: studyGroupInstance.name,
          }))
        )
        .filter((l) => l.locations.length === 1)
        .filter((l) =>
          localized(l.locations[0].building.name)
            .toLowerCase()
            .includes("exactum")
        ),
    };
  })
  .filter((l) => l.lectures.length > 0);

/**
 *
 * @param {Date} date
 */
const toIcsDate = (date) => {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

/**
 *
 * @param {import("./api").Location} location
 */
const extractExactumClass = (location) => {
  const match = localized(location.name).match(/Exactum, (\w+\d+)/i);
  return match?.[1];
};

const events = lectures.flatMap((lecture) =>
  lecture.lectures.map(
    /**
     * @returns {import("ics").EventAttributes}
     */
    (l) => {
      const classId = extractExactumClass(l.locations[0]);

      return {
        start: toIcsDate(new Date(l.start)),
        end: l.end ? toIcsDate(new Date(l.end)) : undefined,
        title: `${lecture.name} (${classId})`,
        description: `${lecture.code} ${lecture.name}: ${
          l.studyGroupType
        }\n\n${localized(l.locations[0].name)}`,
        location: localized(l.locations[0].name),
      };
    }
  )
);

ics.createEvents(events, (e, ics) => {
  if (e) throw e;

  console.log(ics);
  fs.writeFileSync("./events.ics", ics, "utf-8");
});

/**
 * const event = {
  start: [2018, 5, 30, 6, 30],
  duration: { hours: 6, minutes: 30 },
  title: 'Bolder Boulder',
  description: 'Annual 10-kilometer run in Boulder, Colorado',
  location: 'Folsom Field, University of Colorado (finish line)',
  url: 'http://www.bolderboulder.com/',
  geo: { lat: 40.0095, lon: 105.2669 },
  categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
  status: 'CONFIRMED',
  busyStatus: 'BUSY',
  organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
  attendees: [
    { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
    { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
  ]
}

ics.createEvent(event, (error, value) => {
  if (error) {
    console.log(error)
    return
  }

  console.log(value)
})


const { error, value } = ics.createEvents([
  {
    title: 'Lunch',
    start: [2018, 1, 15, 12, 15],
    duration: { minutes: 45 }
  },
  {
    title: 'Dinner',
    start: [2018, 1, 15, 12, 15],
    duration: { hours: 1, minutes: 30 }
  }
])
 */

// fs.writeFileSync("./dump.json", JSON.stringify(courses));
// console.log(`${courses.length} courses fetched`);
// const courses = JSON.parse(fs.readFileSync("./dump.json", "utf-8"))
//   .map((res) => res.hits)
//   .flat();

// const allDetails = [];

// process.on("SIGINT", () => {
//   fs.writeFileSync("./details.json", JSON.stringify(allDetails));
//   process.exit(255);
// });

// try {
//   const retDetails = await async.mapLimit(
//     courses.map((c) => c.curId),
//     8,
//     async (curId) => {
//       const details = await fetchCourseDetails(curId);
//       allDetails.push(details);
//       console.log(`${allDetails.length}/${courses.length}`);
//       return details;
//     }
//   );
// } finally {
//   fs.writeFileSync("./details.json", JSON.stringify(allDetails));
// }
