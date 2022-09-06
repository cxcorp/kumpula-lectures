import Axios from "axios";

const STUDIES_API_BASE = "https://studies.helsinki.fi";

const axios = Axios.create({
  baseURL: STUDIES_API_BASE,
});

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
  const allResults = [];

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
    const { hits, totalHits } = result.data;

    if (allResults.length + hits.length >= totalHits) {
      break;
    }

    // https://studies.helsinki.fi/api/courses/cur/hy-opt-cur-2223-9ed7d99e-6065-4f1d-94c2-27a052565879?languageCode=fi

    console.log(params.toString());
    console.log(result.data);
  }
}

await fetchCourseList();
