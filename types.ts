export type NavLink = {
  id: number;
  name: string;
  path?: string;
  children?: NavLink[];
};

export interface Presenter {
  name: string;
  department?: string;
}

export interface Presentation {
  time: string;
  activity: string;
  presenter?: Presenter[];
}

export interface ParallelSession {
  title: string;
  location: string;
  timeRange: string;
  preside: string;
  presentations: Presentation[];
}

export interface SubSession {
  time?: string;
  activity: string;
  presenter?: Presenter[];
}

export interface ScheduleEvent {
  time?: string;
  activity: string;
  preside?: string;
  subSessions?: SubSession[];
  parallelSessions?: ParallelSession[];
}

export interface SchedulePart {
  title: string;
  events: ScheduleEvent[];
}

export interface ScheduleDay {
  day: string;
  date: string;
  parts: SchedulePart[];
}

export type Sponsor = {
  id: number;
  name: string;
  logoUrl: string;
};

export type KeynoteSpeaker = {
  id: number;
  name: string;
  affiliation: string;
  imageUrl: string;
  bio: string;
  keynoteTopic: string;
};

export type ConferenceTopic = {
  id: number;
  title: string;
  icon: string;
  description: string;
  color: string;
};

export type ContactInfo = {
  name: string;
  role: string;
  phone?: string;
  email: string;
};

export type ReportItem = {
  stt: number;
  topic: string;
  requirement: string;
};

export type SpecializedSession = {
  id: number;
  title: string;
  reports: ReportItem[];
};

export type PlenarySession = {
  title: string;
  theme: string;
  reports: ReportItem[];
};

export type Announcement = {
  id: number;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
  contentImages?: string[];
};

export type User = {
  id: number;
  username: string;
  role: 'user' | 'admin';
  email: string;
};

export type ReviewStatus = 'Duyệt' | 'Không duyệt' | 'Đang chờ duyệt';
export type PresentationStatus = 'Trình bày' | 'Không trình bày';

export type DetailedPaperSubmission = {
  id: number;
  authorName: string;
  organization: string;
  paperTitle: string;
  topic: 1 | 2 | 3;
  abstractStatus: ReviewStatus;
  fullTextStatus: ReviewStatus;
  reviewStatus: ReviewStatus;
  presentationStatus: PresentationStatus;
  fullTextFileName?: string;
  fullTextUrl?: string;
};

export type PaperSubmissionFormData = {
  authorName: string;
  organization: string;
  email: string;
  phone: string;
  paperTitle: string;
  topic: '1' | '2' | '3';
  fullPaperFile: File | null;
};

export type Registration = {
  id: number;
  name: string;
  organization: string;
  email: string;
  phone: string;
  withPaper: string;
};

export type SiteContent = {
  conferenceLogo: string;
  universityLogo: string;
  heroBackground: string;
  callForPapersImage: string;
  keynoteSpeakers: KeynoteSpeaker[];
  conferenceTopics: ConferenceTopic[];
  sponsors: Sponsor[];
  coOrganizers: Sponsor[];
  navLinks: NavLink[];
  heroTitle: string;
  heroSubtitle: string;
  conferenceDate: string;
  conferenceLocation: string;
};
