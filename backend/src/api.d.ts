export interface Response {
  hits: Hit[];
  totalHits: number;
  pageSize: number;
  queryExceedsMaxResultWindow: boolean;
}

export interface Hit {
  cmsIntroductionTitle?: LocalizedString;
  cmsFieldSummary: LocalizedString;
  cmsBody?: LocalizedString;
  cmsExamInfo?: LocalizedString;
  cuId: string;
  cuName: LocalizedString;
  curId: string;
  aId: string;
  aiGroupId: string;
  aiSnapshotDateTime: string | null;
  credits: Credits;
  type: string;
  typeName: LocalizedString;
  code: string;
  lc_code: string;
  studyLevel: string;
  studyLevelSort: number;
  activityPeriod: Period;
  curriculumPeriodIds: string[];
  enrolmentPeriod: EnrolmentPeriod | null;
  lateEnrolmentEnd: string | null;
  name: LocalizedString;
  nameSpecifier: LocalizedString;
  degreeProgrammeIds: string[];
  degreeProgrammeGroupIds: string[];
  studyTrackGroupIds: string[];
  ancestorModuleIds: string[];
  teachingLanguageUrn: null | string;
  teachingLanguages: LocalizedString[];
  id: string;
  organisationIds: Array<null | string>;
  studyEventIds: string[];
  teacherIds: string[];
  teacherNames: string[];
  customCodeUrns: string[];
  tweetText: LocalizedString | null;
  curType: string;
  publishDate: string;
  sortableNameFi: string;
  sortableNameSv: string;
  sortableNameEn: string;
  studyGroupSets: StudyGroupSet[];
  timestamp: string;
  plainName: LocalizedString;
  useOldCoursePage: boolean;
  isOpenUniversityCourse: boolean;
  coursePageUrl: string;
  cmsMoodleLink?: string;
}

export interface Period {
  startDate: string | null;
  endDate: string | null;
}

export interface LocalizedString {
  fi?: null | string;
  en?: null | string;
  sv?: null | string;
}

export interface Credits {
  min: number;
  max: number | null;
}

export interface EnrolmentPeriod {
  startDateTime: string;
  endDateTime: string;
}

export interface StudyGroupSet {
  localId: string;
  name: LocalizedString;
  studySubGroups: StudySubGroup[];
  subGroupRange: Credits;
}

export interface StudySubGroup {
  fromDate: string | null;
  toDate: string | null;
  id: string;
  cancelled: boolean;
  name: LocalizedString;
  teacherNames: string[];
}

export interface CourseDetails {
  id: string;
  flowState: string;
  courseUnitRealisationType: CourseUnitRealisationType;
  name: LocalizedString;
  nameSpecifier: LocalizedString;
  courseUnits: CourseUnit[];
  tweetText: LocalizedString | null;
  organisations: OpenUniversityPartnerCoordinator[];
  activityPeriod: Period;
  publishDate: string;
  enrolmentPeriod: EnrolmentPeriod | null;
  lateEnrolmentEnd: string | null;
  externalEnrolmentLink: ExternalEnrolmentLink | null;
  teachingLanguage: TeachingLanguage | null;
  learningMaterial: LocalizedString | null;
  literature: Literature[] | null;
  studyFormat: LocalizedString | null;
  additionalInfo: LocalizedString | null;
  learningEnvironmentsDescription: null;
  learningEnvironments: LearningEnvironment[];
  studyGroupSets: StudyGroupSet[];
  assessmentItems: AssessmentItem[];
  responsibilityInfos: ResponsibilityInfo[];
  affiliation: string;
  canEditCourse: boolean;
  openUniversity: boolean;
  enrolmentMode: string;
  coTeachingRealisation: boolean;
  organisationBackgroundImages: OrganisationBackgroundImages | null;
  tags?: string[];
  teachingLanguages: LocalizedString[];
  displayCourseFee: boolean;
  displayFreeOfCharge: boolean;
  cmsData: CmsData;
  useSisuEnrolment: boolean;
  showRequestParticipantList: boolean;
  sisuUrl: string;
  openUniversityPartnerCoordinator?: OpenUniversityPartnerCoordinator;
}

export interface AssessmentItem {
  id: string;
  assessmentItemType: string;
  name: LocalizedString;
  contentDescription: LocalizedString | null;
  credits: Credits;
  grading: LocalizedString | null;
  studyFormat: LocalizedString | null;
  subject: null;
  courseUnitRealisations: CourseUnitRealisation[];
}

export interface CourseUnitRealisation {
  id: string;
}

export interface Credits {
  min: number;
  max: number | null;
}

export interface CmsData {
  noContent?: NoContent;
  scheduleInstructions?: null | string;
  links?: Link[];
  optionalInfo?: OptionalInfo[];
  introductionTitle?: null | string;
  summary?: null | string;
  hideEnrolmentButton?: boolean;
  partnerLocation?: null | string;
  registrationInfo?: string;
  body?: string;
  courseCompletion?: string;
  courseMaterials?: CourseMaterials;
  moodleLink?: MoodleLink;
  imagePath?: string;
  imageAltText?: string;
  imageCopyright?: null | string;
  attentionMessage?: AttentionMessage;
}

export interface AttentionMessage {
  message: string;
  lastDate: string | null;
}

export interface CourseMaterials {
  info: null | string;
  materials: Material[];
}

export interface Material {
  id: string;
  type: string;
  title?: string;
  instructions?: null | string;
  restricted?: boolean;
  name?: string;
  description?: string;
  mime?: string;
  size?: number;
  path?: string;
  url?: string;
}

export interface Link {
  uri: string;
  title: string;
  options: any[];
}

export interface MoodleLink {
  url: string;
  key?: string;
}

export interface NoContent {
  reason: string;
}

export interface OptionalInfo {
  title: null | string;
  content: string;
}

export interface CourseUnitRealisationType {
  urn: string;
  name: LocalizedString;
}

export interface CourseUnit {
  id: string;
  code: string;
  name: LocalizedString;
  credits: Credits;
}

export interface ExternalEnrolmentLink {
  label: LocalizedString;
  url: LocalizedString;
}

export interface LearningEnvironment {
  name: string;
}

export interface Literature {
  url: null;
  name: string;
}

export interface OpenUniversityPartnerCoordinator {
  share: number | number;
  roleUrn: string;
  validityPeriod: Period;
  organisation: Organisation | null;
  educationalInstitution: CourseUnitRealisationType | null;
}

export interface Organisation {
  id: string;
  code: string;
  name: LocalizedString;
}

export interface OrganisationBackgroundImages {
  desktop: ImageVariant;
  tablet: ImageVariant;
  mobile: ImageVariant;
}

export interface ImageVariant {
  url: string;
  width: number;
  height: number;
}

export interface ResponsibilityInfo {
  roleUrn: string;
  person: Person | null;
  text: LocalizedString | null;
}

export interface Person {
  firstName: null | string;
  lastName: string;
}

export interface StudyGroupSet {
  localId: string;
  name: LocalizedString;
  subGroupRange: Credits;
  studySubGroups: StudySubGroup[];
}

export interface StudySubGroup {
  id: string;
  cancelled: boolean;
  size: number | null;
  name: LocalizedString;
  teachers: Person[];
  studyEvents: StudyEvent[];
}

export interface StudyEvent {
  id: string;
  startTime: string;
  duration: string;
  cancellations: string[];
  exceptions: string[];
  events: Event[];
  locations: Location[];
  overrides: Override[];
}

export interface Event {
  start: string;
  end: string;
  cancelled: boolean;
  excluded: boolean;
  notice?: string;
}

export interface Location {
  id: string;
  name: LocalizedString;
  building: LocationBuilding;
}

export interface LocationBuilding {
  name: LocalizedString;
  address: PurpleAddress;
}

export interface PurpleAddress {
  streetAddress: null | string;
  postalCode: null | string;
  city: null | string;
}

export interface Override {
  eventDate: string;
  notice: LocalizedString | null;
  irregularLocations: IrregularLocation[] | null;
}

export interface IrregularLocation {
  id: string;
  name: LocalizedString;
  building: IrregularLocationBuilding;
}

export interface IrregularLocationBuilding {
  name: LocalizedString;
  address: FluffyAddress;
}

export interface FluffyAddress {
  city: null | string;
}

export interface TeachingLanguage {
  shortName: LocalizedString;
  name: LocalizedString;
}
