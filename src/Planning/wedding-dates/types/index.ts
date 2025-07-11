export interface WeddingDate {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  location?: string;
  category: 'wedding' | 'preparation' | 'celebration' | 'vendor' | 'other';
  isSample?: boolean;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: WeddingDate[];
}