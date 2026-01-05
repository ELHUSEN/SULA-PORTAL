export interface SheetRow {
  section: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  extra: string;
}

export interface SectionData {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'testimonials' | 'cta' | 'footer' | 'header' | 'unknown';
  content: SheetRow;
}

export interface Dataset {
  pic: string;
  name: string;
  code: string;
  producer: string;
  nature: string;
  frequency: string;
  inputDate: string;
  updateDate: string;
  activity: string;
  concept: string;
  classification: string;
  size: string;
  unit: string;
  definition: string;
  description: string;
  sector: string;
  image: string;
  refCode: string;
  accessStatus: string;
  badge: string;
  link: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface AppState {
  loading: boolean;
  error: string | null;
  sections: SectionData[];
  datasets: Dataset[];
  rawTextContext: string; // Used for Gemini context
}