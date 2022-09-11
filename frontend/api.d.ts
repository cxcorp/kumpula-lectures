export interface Welcome {
  status: string;
  data: Data;
}

export interface Data {
  "organisations-by-id": { [key: string]: OrganisationsByID };
  events: { [key: string]: Event[] };
}

export interface Event {
  start: string;
  end: string;
  lectureName: string;
  exactumClass: string;
  studyGroupType: string;
  location: string;
  organisation: string;
  courseDetailsId: string;
}

export interface OrganisationsByID {
  id: string;
  code: string;
  name: Name;
}

export interface Name {
  fi: string;
  sv: string;
  en: string;
}
