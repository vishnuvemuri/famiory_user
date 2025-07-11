export interface ServiceData {
  id: string;
  type: string;
  name: string;
  vendor: string;
  contact: {
    name: string;
    phone: string;
  };
  status: 'booked' | 'pending' | 'needed' | 'researching';
  contractSigned?: string;
  depositPaid?: string;
  notes?: string;
  customFields?: Record<string, string>;
}

export interface ServiceFormData {
  type: string;
  customType?: string;
  vendor: string;
  contactName: string;
  contactPhone: string;
  status: 'booked' | 'pending' | 'needed' | 'researching';
  contractDate?: string;
  depositPaid?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ServiceApiInterface {
  getServices: () => Promise<ApiResponse<ServiceData[]>>;
  createService: (service: Omit<ServiceData, 'id'>) => Promise<ApiResponse<ServiceData>>;
  updateService: (id: string, service: Partial<ServiceData>) => Promise<ApiResponse<ServiceData>>;
  deleteService: (id: string) => Promise<ApiResponse<void>>;
}