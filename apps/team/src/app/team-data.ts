export const engines = ['Service Engine', 'Asset Engine', 'Media Engine'] as const;

export const passions = [
  'AI Affiliate / UGC',
  'Accounting / Marketing',
  'Vibe Coding',
  'Lead Generation',
  'AI Music',
  'Digital Product',
  'Software Developer',
  'Cinema',
  'Other',
] as const;

export type Engine = (typeof engines)[number];
export type Passion = (typeof passions)[number];
export type ApplicationStatus = 'Pending review' | 'Approved' | 'Waitlist' | 'Declined';

export type TeamApplication = {
  id: string;
  email: string;
  name: string;
  engine: Engine | 'Not sure yet';
  passions: Passion[];
  otherPassion: string;
  bio: string;
  portfolio: string;
  status: ApplicationStatus;
  assignedEngine: Engine | '';
  adminNote: string;
  submittedAt: string;
};
