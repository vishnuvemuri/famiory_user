import { WeddingDate, CountdownTime } from '../types';

export const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
  return `${hours}:${minutesStr} ${ampm}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const calculateCountdown = (targetDate: Date, targetTime?: string): CountdownTime => {
  const weddingDateTime = new Date(targetDate);
  
  if (targetTime) {
    const [time, period] = targetTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    weddingDateTime.setHours(hour, parseInt(minutes), 0, 0);
  }

  const now = new Date();
  const distance = weddingDateTime.getTime() - now.getTime();

  if (distance < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export const createSampleDates = (weddingDate: Date, weddingTime?: string): WeddingDate[] => {
  const samples: WeddingDate[] = [];

  // Wedding Day (main event)
  samples.push({
    id: 'wedding-day-' + Date.now(),
    title: "Wedding Day",
    description: "The big day! Ceremony and reception",
    date: new Date(weddingDate),
    time: weddingTime || "3:00 PM",
    location: "Wedding Venue",
    category: "wedding",
    isSample: true
  });

  // Engagement Party (2 months before wedding)
  const engagementDate = new Date(weddingDate);
  engagementDate.setMonth(engagementDate.getMonth() - 2);
  samples.push({
    id: 'engagement-party-' + Date.now(),
    title: "Engagement Party",
    description: "Celebration with close friends and family",
    date: engagementDate,
    time: "7:00 PM",
    location: "To be determined",
    category: "celebration",
    isSample: true
  });

  // Final Dress Fitting (3 weeks before wedding)
  const dressFittingDate = new Date(weddingDate);
  dressFittingDate.setDate(dressFittingDate.getDate() - 21);
  samples.push({
    id: 'dress-fitting-' + Date.now(),
    title: "Final Dress Fitting",
    description: "Bring shoes and accessories for final adjustments",
    date: dressFittingDate,
    time: "11:00 AM",
    location: "Bridal Shop",
    category: "preparation",
    isSample: true
  });

  // Venue Booking (5 months before wedding)
  const venueBookingDate = new Date(weddingDate);
  venueBookingDate.setMonth(venueBookingDate.getMonth() - 5);
  samples.push({
    id: 'venue-booking-' + Date.now(),
    title: "Venue Booking",
    description: "Finalize and book the wedding venue",
    date: venueBookingDate,
    time: "2:00 PM",
    location: "Venue Location",
    category: "vendor",
    isSample: true
  });

  // Catering Tasting (2 months before wedding)
  const cateringTastingDate = new Date(weddingDate);
  cateringTastingDate.setMonth(cateringTastingDate.getMonth() - 2);
  samples.push({
    id: 'catering-tasting-' + Date.now(),
    title: "Catering Tasting",
    description: "Sample menu options with caterer",
    date: cateringTastingDate,
    time: "6:30 PM",
    location: "Caterer's Kitchen",
    category: "vendor",
    isSample: true
  });

  // Wedding Rehearsal (1 day before wedding)
  const rehearsalDate = new Date(weddingDate);
  rehearsalDate.setDate(rehearsalDate.getDate() - 1);
  samples.push({
    id: 'wedding-rehearsal-' + Date.now(),
    title: "Wedding Rehearsal",
    description: "Practice ceremony with wedding party",
    date: rehearsalDate,
    time: "4:00 PM",
    location: "Ceremony Venue",
    category: "preparation",
    isSample: true
  });

  return samples;
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case "wedding":
      return "heart";
    case "preparation":
      return "shirt";
    case "celebration":
      return "glass-water";
    case "vendor":
      return "handshake";
    default:
      return "calendar-days";
  }
};

export const getMonthName = (month: number): string => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month];
};

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month: number, year: number): number => {
  return new Date(year, month, 1).getDay();
};