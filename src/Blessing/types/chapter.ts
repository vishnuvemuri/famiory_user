export interface Chapter {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  route?: string;
}

export interface PreMarriagePageProps {
  onNavigateToChapter?: (chapterId: string) => void;
  apiEndpoint?: string;
  chapters?: Chapter[];
}