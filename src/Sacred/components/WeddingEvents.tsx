import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import './WeddingEvents.css';

interface EventData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  buttonText: string;
  buttonAction: string;
}

interface WeddingEventsProps {
  headerTitle?: string;
  headerSubtitle?: string;
  events?: EventData[];
  onEventClick?: (eventId: string, action: string) => void;
  onImageUpload?: (eventId: string, file: File) => void;
  apiEndpoint?: string;
}

const WeddingEvents: React.FC<WeddingEventsProps> = ({
  headerTitle = "The Beginning of a Lifetime Together",
  headerSubtitle = "Hold onto the love, laughter, and warmth of your first steps together",
  events = [
    {
      id: "griha-pravesh",
      title: "Griha",
      subtitle: "Pravesh",
      description: "Marking the bride's first steps into her new home, Griha Pravesh is a sacred and joyous occasion symbolizing love and prosperity.",
      image: "https://images.pexels.com/photos/6266298/pexels-photo-6266298.jpeg?auto=compress&cs=tinysrgb&w=600",
      buttonText: "Step Inside",
      buttonAction: "gruh-pravesh.html"
    },
    {
      id: "whispers-giggles",
      title: "Whispers &",
      subtitle: "Giggles",
      description: "Evokes the playful, teasing, and intimate nature of post-wedding moments like the ring game and first night.",
      image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=600",
      buttonText: "Step Inside",
      buttonAction: "sacred-rings.html"
    },
    {
      id: "cherished-exhaustion",
      title: "Cherished",
      subtitle: "Exhaustion",
      description: "The day after the wedding is a mix of joy & fatigue—capturing the hilarious, heartwarming moments of post-wedding tiredness.",
      image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600",
      buttonText: "Step Inside",
      buttonAction: "cherished-exhaustion.html"
    }
  ],
  onEventClick,
  onImageUpload,
  apiEndpoint
}) => {
  const [eventData, setEventData] = useState<EventData[]>(events);
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});

  // API Integration - Easy single line integration
  const fetchEventsData = async () => {
    if (!apiEndpoint) return;
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  };

  React.useEffect(() => {
    fetchEventsData();
  }, [apiEndpoint]);

  const handleImageUpload = (eventId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImages(prev => ({ ...prev, [eventId]: imageUrl }));
      };
      reader.readAsDataURL(file);
      
      if (onImageUpload) {
        onImageUpload(eventId, file);
      }
    }
  };

  const handleEventClick = (eventId: string, action: string) => {
    if (onEventClick) {
      onEventClick(eventId, action);
    } else {
      // Default navigation behavior
      window.location.href = action;
    }
  };

  return (
    <div className="wedding-events-container">
      <header className="wedding-events-header">
        <h1 className="wedding-events-title">{headerTitle}</h1>
        <h2 className="wedding-events-subtitle">{headerSubtitle}</h2>
      </header>

      <section className="wedding-events-grid">
        {eventData.map((event) => (
          <div key={event.id} className="wedding-event-card">
            <div className="wedding-event-image-container">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(event.id, e)}
                className="wedding-event-file-input"
                id={`image-${event.id}`}
              />
              <label htmlFor={`image-${event.id}`} className="wedding-event-image-label">
                <img
                  src={uploadedImages[event.id] || event.image}
                  alt={event.title}
                  className="wedding-event-image"
                />
                <div className="wedding-event-upload-overlay">
                  <Upload size={24} color="#D4AF37" />
                </div>
              </label>
            </div>
            
            <div className="wedding-event-content">
              <h3 className="wedding-event-heading">
                {event.title}
                {event.subtitle && <><br />{event.subtitle}</>}
              </h3>
              <p className="wedding-event-description">{event.description}</p>
              <button
                className="wedding-event-button"
                onClick={() => handleEventClick(event.id, event.buttonAction)}
              >
                {event.buttonText}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default WeddingEvents;