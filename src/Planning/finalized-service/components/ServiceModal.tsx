import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ServiceData, ServiceFormData } from 'src/Planning/finalized-service/types';

interface ServiceModalProps {
  service?: ServiceData | null;
  onClose: () => void;
  onSubmit: (data: Partial<ServiceData>) => void;
  loading?: boolean;
}

const serviceTypes = [
  { value: 'venue', label: 'Venue' },
  { value: 'catering', label: 'Catering' },
  { value: 'photography', label: 'Photography' },
  { value: 'videography', label: 'Videography' },
  { value: 'florist', label: 'Florist' },
  { value: 'music', label: 'Music/Entertainment' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'cake', label: 'Cake' },
  { value: 'officiant', label: 'Officiant' },
  { value: 'hair-makeup', label: 'Hair & Makeup' },
  { value: 'decor', label: 'Decor/Rentals' },
  { value: 'other', label: 'Other' }
];

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    type: '',
    customType: '',
    vendor: '',
    contactName: '',
    contactPhone: '',
    status: 'booked',
    contractDate: '',
    depositPaid: '',
    notes: ''
  });

  const [showCustomType, setShowCustomType] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        type: service.type,
        vendor: service.vendor,
        contactName: service.contact.name,
        contactPhone: service.contact.phone,
        status: service.status,
        contractDate: service.contractSigned || '',
        depositPaid: service.depositPaid || '',
        notes: service.notes || ''
      });
    }
  }, [service]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      setShowCustomType(value === 'other');
      if (value !== 'other') {
        setFormData(prev => ({ ...prev, customType: '', [name]: value }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vendor.trim()) {
      alert('Please enter a vendor name');
      return;
    }

    const serviceType = formData.type === 'other' ? formData.customType : formData.type;
    if (!serviceType?.trim()) {
      alert('Please select or enter a service type');
      return;
    }

    const submitData: Partial<ServiceData> = {
      type: serviceType.toLowerCase(),
      name: serviceType,
      vendor: formData.vendor.trim(),
      contact: {
        name: formData.contactName.trim(),
        phone: formData.contactPhone.trim()
      },
      status: formData.status,
      contractSigned: formData.contractDate || undefined,
      depositPaid: formData.depositPaid.trim() || undefined,
      notes: formData.notes.trim() || undefined
    };

    onSubmit(submitData);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="service-modal" onClick={handleOverlayClick}>
      <div className="service-modal-content">
        <div className="modal-header">
          <h3>{service ? 'Edit Service' : 'Add New Service'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="service-type">Service Type</label>
            <select
              id="service-type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a service type</option>
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {showCustomType && (
            <div className="form-group">
              <label htmlFor="custom-type">Custom Service Type</label>
              <input
                type="text"
                id="custom-type"
                name="customType"
                value={formData.customType}
                onChange={handleInputChange}
                placeholder="Enter custom service type"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="vendor">Vendor Name</label>
            <input
              type="text"
              id="vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleInputChange}
              placeholder="Enter vendor or company name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactName">Contact Name</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Contact person"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone">Phone</label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="booked">Booked</option>
              <option value="pending">Pending</option>
              <option value="needed">Needed</option>
              <option value="researching">Researching</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contractDate">Contract Signed</label>
              <input
                type="date"
                id="contractDate"
                name="contractDate"
                value={formData.contractDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="depositPaid">Deposit Paid</label>
              <input
                type="text"
                id="depositPaid"
                name="depositPaid"
                value={formData.depositPaid}
                onChange={handleInputChange}
                placeholder="₹0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any important details about this service"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (service ? 'Update Service' : 'Save Service')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};