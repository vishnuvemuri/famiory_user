import React from 'react';
import { 
  Building, 
  Utensils, 
  Camera, 
  Video, 
  Flower, 
  Music, 
  Car, 
  Cake, 
  Users, 
  Sparkles,
  Sofa,
  Calendar
} from 'lucide-react';
import { ServiceData } from 'src/Planning/finalized-service/types';

interface ServiceCardProps {
  service: ServiceData;
  onEdit: () => void;
  onDelete: () => void;
}

const getServiceIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    venue: <Building size={20} />,
    catering: <Utensils size={20} />,
    photography: <Camera size={20} />,
    videography: <Video size={20} />,
    florist: <Flower size={20} />,
    music: <Music size={20} />,
    entertainment: <Music size={20} />,
    transportation: <Car size={20} />,
    cake: <Cake size={20} />,
    officiant: <Users size={20} />,
    'hair-makeup': <Sparkles size={20} />,
    decor: <Sofa size={20} />,
    rentals: <Sofa size={20} />
  };
  
  return iconMap[type.toLowerCase()] || <Calendar size={20} />;
};

const getStatusConfig = (status: ServiceData['status']) => {
  const statusMap = {
    booked: { class: 'status-booked', text: 'Booked' },
    pending: { class: 'status-pending', text: 'Pending' },
    needed: { class: 'status-needed', text: 'Needed' },
    researching: { class: 'status-researching', text: 'Researching' }
  };
  
  return statusMap[status] || statusMap.pending;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete
}) => {
  const statusConfig = getStatusConfig(service.status);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="service-card">
      <div className="service-header">
        <div className="service-icon">
          {getServiceIcon(service.type)}
        </div>
        <div className="service-title">
          <div className="service-name">{service.name}</div>
          <div className={`service-status ${statusConfig.class}`}>
            {statusConfig.text}
          </div>
        </div>
      </div>

      <div className="service-details">
        <div className="detail-row">
          <div className="detail-label">Vendor:</div>
          <div className="detail-value">{service.vendor}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Contact:</div>
          <div className="detail-value">
            {service.contact.name} {service.contact.phone && `(${service.contact.phone})`}
          </div>
        </div>

        {service.contractSigned && (
          <div className="detail-row">
            <div className="detail-label">Contract Signed:</div>
            <div className="detail-value">{formatDate(service.contractSigned)}</div>
          </div>
        )}

        {service.depositPaid && (
          <div className="detail-row">
            <div className="detail-label">Deposit Paid:</div>
            <div className="detail-value">{service.depositPaid}</div>
          </div>
        )}

        {service.customFields && Object.entries(service.customFields).map(([key, value]) => (
          <div key={key} className="detail-row">
            <div className="detail-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</div>
            <div className="detail-value">{value}</div>
          </div>
        ))}

        {service.notes && (
          <div className="detail-row">
            <div className="detail-label">Notes:</div>
            <div className="detail-value">{service.notes}</div>
          </div>
        )}
      </div>

      <div className="service-actions">
        <button className="service-btn btn-primary" onClick={onEdit}>
          Edit Details
        </button>
        <button className="service-btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};