import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for the back button
import { ArrowLeft, Plus } from 'lucide-react';

// Use the new path aliases for robust imports
import { ServiceData, ServiceApiInterface } from 'src/Planning/finalized-service/types';
import { useServices } from 'src/Planning/finalized-service/hooks/useServices';
import { ServiceCard } from 'src/Planning/finalized-service/components/ServiceCard';
import { ServiceModal } from 'src/Planning/finalized-service/components/ServiceModal';
import { ProgressBar } from 'src/Planning/finalized-service/components/ProgressBar';
import './ServiceDashboard.css';

// Props are simplified as this now acts as a page
interface ServiceDashboardProps {
  title?: string;
  subtitle?: string;
}

export const ServiceDashboard: React.FC<ServiceDashboardProps> = ({
  title = "Finalized Service Details",
  subtitle = "Manage all your wedding vendors and service providers in one place. Track contracts, payments, and important details."
}) => {
  // Initialize navigate to handle the back button
  const navigate = useNavigate();

  // The apiClient prop is removed, assuming the hook handles its own API setup
  const {
    services,
    loading,
    error,
    progress,
    createService,
    updateService,
    deleteService
  } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);

  const handleAddService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: ServiceData) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await deleteService(serviceId);
    }
  };

  const handleModalSubmit = async (formData: any) => {
    if (editingService) {
      await updateService(editingService.id, formData);
    } else {
      await createService(formData);
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  if (loading && services.length === 0) {
    return (
      <div className="service-dashboard">
        <div className="loading-spinner">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="service-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">Famiory</div>
      </header>

      {/* Main Content */}
      <div className="main-container">
        {/* Page Header with a working back button */}
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Progress Overview */}
        <ProgressBar progress={progress} />

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => handleEditService(service)}
              onDelete={() => handleDeleteService(service.id)}
            />
          ))}
        </div>

        {/* Add Service Button */}
        <button 
          className="add-service-btn"
          onClick={handleAddService}
          disabled={loading}
        >
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}
          onSubmit={handleModalSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};