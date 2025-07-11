import { WeddingDate } from '../types';

// API service functions - replace these with actual API calls
export class WeddingDateAPI {
  // Get wedding date
  static async getWeddingDate(): Promise<{ date: Date; time?: string } | null> {
    // TODO: Replace with actual API call
    // return fetch('/api/wedding-date').then(res => res.json());
    
    const savedDate = localStorage.getItem('weddingDate');
    const savedTime = localStorage.getItem('weddingTime');
    
    if (savedDate) {
      return {
        date: new Date(savedDate),
        time: savedTime || undefined
      };
    }
    return null;
  }

  // Save wedding date
  static async saveWeddingDate(date: Date, time?: string): Promise<void> {
    // TODO: Replace with actual API call
    // return fetch('/api/wedding-date', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ date, time })
    // });
    
    localStorage.setItem('weddingDate', date.toISOString());
    localStorage.setItem('weddingTime', time || '');
  }

  // Get all wedding dates
  static async getWeddingDates(): Promise<WeddingDate[]> {
    // TODO: Replace with actual API call
    // return fetch('/api/wedding-dates').then(res => res.json());
    
    const savedDates = localStorage.getItem('dates');
    if (savedDates) {
      return JSON.parse(savedDates).map((date: any) => ({
        ...date,
        date: new Date(date.date)
      }));
    }
    return [];
  }

  // Save wedding dates
  static async saveWeddingDates(dates: WeddingDate[]): Promise<void> {
    // TODO: Replace with actual API call
    // return fetch('/api/wedding-dates', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dates)
    // });
    
    const datesToSave = dates.map(date => ({
      ...date,
      date: date.date.toISOString()
    }));
    localStorage.setItem('dates', JSON.stringify(datesToSave));
  }

  // Create a new wedding date
  static async createWeddingDate(date: Omit<WeddingDate, 'id'>): Promise<WeddingDate> {
    // TODO: Replace with actual API call
    // return fetch('/api/wedding-dates', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(date)
    // }).then(res => res.json());
    
    const newDate: WeddingDate = {
      ...date,
      id: Date.now().toString()
    };
    
    const existingDates = await this.getWeddingDates();
    await this.saveWeddingDates([...existingDates, newDate]);
    
    return newDate;
  }

  // Update a wedding date
  static async updateWeddingDate(id: string, updates: Partial<WeddingDate>): Promise<WeddingDate> {
    // TODO: Replace with actual API call
    // return fetch(`/api/wedding-dates/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // }).then(res => res.json());
    
    const existingDates = await this.getWeddingDates();
    const updatedDates = existingDates.map(date => 
      date.id === id ? { ...date, ...updates } : date
    );
    await this.saveWeddingDates(updatedDates);
    
    return updatedDates.find(d => d.id === id)!;
  }

  // Delete a wedding date
  static async deleteWeddingDate(id: string): Promise<void> {
    // TODO: Replace with actual API call
    // return fetch(`/api/wedding-dates/${id}`, { method: 'DELETE' });
    
    const existingDates = await this.getWeddingDates();
    const filteredDates = existingDates.filter(date => date.id !== id);
    await this.saveWeddingDates(filteredDates);
  }
}