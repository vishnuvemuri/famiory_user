// API integration utilities for Wedding Planning Dashboard
// Currently using mock data - replace with actual API endpoints when backend is ready

export interface EventAPI {
  createEvent: (event: {
    name: string;
    date: string;
    location?: string;
  }) => Promise<{ id: string }>;
  
  deleteEvent: (eventId: string) => Promise<void>;
  
  getEvents: () => Promise<Array<{
    id: string;
    name: string;
    date: string;
    location?: string;
  }>>;
}

export interface TaskAPI {
  createTask: (task: {
    title: string;
    description?: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    section: string;
    status: 'pending' | 'working' | 'completed';
  }) => Promise<{ id: string }>;
  
  updateTask: (taskId: string, updates: {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'high' | 'medium' | 'low';
    status?: 'pending' | 'working' | 'completed';
    completedDate?: string;
  }) => Promise<void>;
  
  deleteTask: (taskId: string) => Promise<void>;
  
  getTasks: () => Promise<Array<{
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    completedDate?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'working' | 'completed';
    section: string;
  }>>;
}

// Mock data for development
const mockEvents = [
  {
    id: '1',
    name: 'Venue Booking',
    date: '2024-03-15',
    location: 'Grand Ballroom'
  },
  {
    id: '2',
    name: 'Catering Tasting',
    date: '2024-04-02',
    location: 'Culinary Studio'
  },
  {
    id: '3',
    name: 'Dress Fitting',
    date: '2024-04-20',
    location: 'Bridal Boutique'
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Book Ceremony Venue',
    description: 'Deposit paid and contract signed',
    dueDate: '2023-06-15',
    completedDate: '2023-06-15',
    priority: 'high' as const,
    status: 'completed' as const,
    section: 'venue'
  },
  {
    id: '2',
    title: 'Book Reception Venue',
    description: 'Confirmed for 150 guests',
    dueDate: '2023-06-22',
    completedDate: '2023-06-22',
    priority: 'high' as const,
    status: 'completed' as const,
    section: 'venue'
  },
  {
    id: '3',
    title: 'Finalize Floor Plan',
    description: 'Need to confirm table arrangements with venue',
    dueDate: '2024-01-15',
    priority: 'high' as const,
    status: 'pending' as const,
    section: 'venue'
  },
  {
    id: '4',
    title: 'Purchase Wedding Dress',
    description: 'Ordered, first fitting scheduled',
    dueDate: '2023-07-05',
    completedDate: '2023-07-05',
    priority: 'high' as const,
    status: 'completed' as const,
    section: 'attire'
  },
  {
    id: '5',
    title: 'Groom\'s Suit Fitting',
    description: 'Need to schedule appointment',
    dueDate: '2023-12-10',
    priority: 'high' as const,
    status: 'working' as const,
    section: 'attire'
  },
  {
    id: '6',
    title: 'Hire Photographer',
    description: '8-hour package booked',
    dueDate: '2023-05-10',
    completedDate: '2023-05-10',
    priority: 'high' as const,
    status: 'completed' as const,
    section: 'vendors'
  },
  {
    id: '7',
    title: 'Finalize Guest List',
    description: 'Need to confirm with both families',
    dueDate: '2023-11-01',
    priority: 'high' as const,
    status: 'pending' as const,
    section: 'guests'
  }
];

// Mock API implementation - replace with your actual backend calls
export const weddingPlanningAPI: EventAPI = {
  async createEvent(event) {
    // Replace with: return await fetch('/api/wedding/events', { method: 'POST', body: JSON.stringify(event) }).then(r => r.json());
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEvent = {
      id: Date.now().toString(),
      ...event
    };
    
    mockEvents.push(newEvent);
    return { id: newEvent.id };
  },

  async deleteEvent(eventId) {
    // Replace with: await fetch(`/api/wedding/events/${eventId}`, { method: 'DELETE' });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockEvents.findIndex(event => event.id === eventId);
    if (index > -1) {
      mockEvents.splice(index, 1);
    }
  },

  async getEvents() {
    // Replace with: return await fetch('/api/wedding/events').then(r => r.json());
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [...mockEvents];
  }
};

export const progressTrackerAPI: TaskAPI = {
  async createTask(task) {
    // Replace with: return await fetch('/api/wedding/tasks', { method: 'POST', body: JSON.stringify(task) }).then(r => r.json());
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTask = {
      id: Date.now().toString(),
      ...task
    };
    
    mockTasks.push(newTask);
    return { id: newTask.id };
  },

  async updateTask(taskId, updates) {
    // Replace with: await fetch(`/api/wedding/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(updates) });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTasks.findIndex(task => task.id === taskId);
    if (index > -1) {
      mockTasks[index] = { ...mockTasks[index], ...updates };
    }
  },

  async deleteTask(taskId) {
    // Replace with: await fetch(`/api/wedding/tasks/${taskId}`, { method: 'DELETE' });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTasks.findIndex(task => task.id === taskId);
    if (index > -1) {
      mockTasks.splice(index, 1);
    }
  },

  async getTasks() {
    // Replace with: return await fetch('/api/wedding/tasks').then(r => r.json());
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [...mockTasks];
  }
};

// Section navigation handler
export const handleSectionNavigation = (sectionId: string) => {
  // Replace with your navigation logic
  switch (sectionId) {
    case 'progress':
      // Already on progress page
      break;
    case 'dates':
      window.location.href = '/wedding/dates';
      break;
    case 'attire':
      window.location.href = '/wedding/attire';
      break;
    case 'services':
      window.location.href = '/wedding/services';
      break;
    case 'responsibilities':
      window.location.href = '/wedding/responsibilities';
      break;
    case 'budget':
      window.location.href = '/wedding/budget';
      break;
    default:
      console.log(`Navigate to ${sectionId}`);
  }
};