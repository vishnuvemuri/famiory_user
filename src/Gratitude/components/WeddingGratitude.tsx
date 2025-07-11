import React, { useState, useRef } from 'react';
import { ArrowLeft, Edit, Save, List, CheckCircle, Video, Eye, Upload } from 'lucide-react';
import './WeddingGratitude.css';

// Types for better type safety
interface Guest {
  id: number;
  name: string;
  phone: string;
  attended: boolean;
}

interface GuestList {
  [key: string]: Guest[];
}

interface SavedList {
  id: number;
  name: string;
  description: string;
  guests: Guest[];
  date: string;
}

interface WeddingGratitudeProps {
  // API integration props - your backend developer can easily connect these
  guestLists?: GuestList;
  onSaveGuestList?: (listData: SavedList) => void;
  onSendMessage?: (guests: Guest[], videoFile: File | null) => void;
  onBackToDashboard?: () => void;
}

const WeddingGratitude: React.FC<WeddingGratitudeProps> = ({
  guestLists = {
    friends: [
      { id: 1, name: "Rahul Sharma", phone: "9876543210", attended: true },
      { id: 2, name: "Priya Patel", phone: "8765432109", attended: true },
      { id: 3, name: "Amit Singh", phone: "7654321098", attended: false }
    ],
    family: [
      { id: 4, name: "Neha Gupta", phone: "6543210987", attended: true },
      { id: 5, name: "Vikram Joshi", phone: "9432109876", attended: false },
      { id: 6, name: "Ananya Reddy", phone: "8321098765", attended: true }
    ],
    relatives: [
      { id: 7, name: "Sanjay Verma", phone: "7210987654", attended: true },
      { id: 8, name: "Meera Kapoor", phone: "6109876543", attended: false },
      { id: 9, name: "Rajesh Iyer", phone: "5987654321", attended: true }
    ]
  },
  onSaveGuestList = (listData: SavedList) => console.log('Save guest list:', listData),
  onSendMessage = (guests: Guest[], videoFile: File | null) => console.log('Send message:', guests, videoFile),
  onBackToDashboard = () => console.log('Back to dashboard')
}) => {
  // State management
  const [currentList, setCurrentList] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<number[]>([]);
  const [finalizedListData, setFinalizedListData] = useState<Guest[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoConfirmed, setVideoConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFinalizedList, setShowFinalizedList] = useState(false);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper functions
  const formatIndianPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    return phone;
  };

  const handleGuestListChange = (listType: string) => {
    setCurrentList(listType);
    setIsEditMode(false);
    setSelectedGuests([]);
  };

  const toggleEditMode = () => {
    if (!currentList) {
      alert('Please select a guest list first');
      return;
    }
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setSelectedGuests([]);
    }
  };

  const handleCheckboxChange = (guestId: number) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setVideoConfirmed(false);
    }
  };

  const handleVideoReview = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleVideoConfirm = () => {
    if (videoFile) {
      setVideoConfirmed(true);
      alert('Video confirmed and ready for delivery!');
    }
  };

  const handleSaveList = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const listName = formData.get('listName') as string;
    const listDescription = formData.get('listDescription') as string;

    const selectedGuestDetails = guestLists[currentList]?.filter(guest =>
      selectedGuests.includes(guest.id)
    ) || [];

    const newList: SavedList = {
      id: Date.now(),
      name: listName,
      description: listDescription,
      guests: selectedGuestDetails,
      date: new Date().toLocaleDateString()
    };

    setSavedLists(prev => [...prev, newList]);
    setFinalizedListData(newList.guests);
    setShowModal(false);
    setIsEditMode(false);
    setSelectedGuests([]);
    
    // Call API integration function
    onSaveGuestList(newList);
    
    alert(`"${listName}" saved successfully with ${selectedGuestDetails.length} guests!`);
  };

  const handleFinalizeList = () => {
    if (finalizedListData.length === 0) {
      alert('Please create and save a guest list first.');
      return;
    }
    alert(`Your guest list is finalized with ${finalizedListData.length} guests.`);
  };

  const handleSendViaWhatsApp = () => {
    if (finalizedListData.length === 0) {
      alert('Please finalize your guest list first.');
      return;
    }
    if (!videoConfirmed) {
      alert('Please confirm your video before sending.');
      return;
    }

    // Call API integration function
    onSendMessage(finalizedListData, videoFile);

    // Create WhatsApp links for demo
    const message = encodeURIComponent("Thank you for being part of our special day! Here's a personal message from us:");
    const phoneNumber = finalizedListData[0].phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    if (finalizedListData.length > 1) {
      alert(`Your message will be sent to ${finalizedListData.length} contacts. WhatsApp will open for the first contact.`);
    }
  };

  const removeFromFinalizedList = (guestId: number) => {
    setFinalizedListData(prev => prev.filter(guest => guest.id !== guestId));
  };

  const currentGuestList = currentList ? guestLists[currentList] : [];

  return (
    <div className="wedding-gratitude">
      {/* Header */}
      <header className="wg-header">
        <div className="wg-container">
          <div className="wg-header-content">
            <div className="wg-logo">Gratitude & Love</div>
            <button className="wg-back-btn" onClick={onBackToDashboard}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="wg-hero">
        <div className="wg-container">
          <h1>Share Your Gratitude</h1>
          <p>Send a heartfelt thank you message to your wedding guests who made your special day unforgettable</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="wg-container">
        <div className="wg-main-content">
          {/* Left Sidebar - Guest Management */}
          <div className="wg-sidebar">
            <h2>Guest List</h2>
            
            <select 
              className="wg-guest-list-selector" 
              value={currentList}
              onChange={(e) => handleGuestListChange(e.target.value)}
            >
              <option value="" disabled>Select a guest list</option>
              <option value="friends">Friends</option>
              <option value="family">Family</option>
              <option value="relatives">Relatives</option>
            </select>
            
            <div className="wg-guest-list-actions">
              <button 
                className={`wg-btn ${isEditMode ? 'wg-btn-primary' : 'wg-btn-outline'} wg-btn-small`}
                onClick={toggleEditMode}
              >
                <Edit size={16} />
                {isEditMode ? 'Cancel Editing' : 'Edit List'}
              </button>
              <button 
                className="wg-btn wg-btn-primary wg-btn-small"
                disabled={selectedGuests.length === 0}
                onClick={() => setShowModal(true)}
              >
                <Save size={16} /> Save List
              </button>
              <button 
                className="wg-btn wg-btn-outline wg-btn-small"
                onClick={() => setShowFinalizedList(!showFinalizedList)}
              >
                <List size={16} />
                {showFinalizedList ? 'Hide Final List' : 'View Final List'}
              </button>
            </div>
            
            <div className="wg-guest-list-container">
              <div className={`wg-guest-list ${isEditMode ? 'wg-edit-mode' : ''}`}>
                {currentGuestList.length > 0 ? (
                  currentGuestList.map(guest => (
                    <div key={guest.id} className="wg-guest-item">
                      {isEditMode && (
                        <input
                          type="checkbox"
                          className="wg-guest-checkbox"
                          checked={selectedGuests.includes(guest.id)}
                          onChange={() => handleCheckboxChange(guest.id)}
                        />
                      )}
                      <div className="wg-guest-info">
                        <div className="wg-guest-name">{guest.name}</div>
                        <div className="wg-guest-phone">{formatIndianPhone(guest.phone)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="wg-empty-state">
                    <p>Please select a guest list from the dropdown</p>
                  </div>
                )}
              </div>
              
              {showFinalizedList && (
                <div className="wg-finalized-list">
                  <h3>Finalized Guest List</h3>
                  <div className="wg-finalized-guests">
                    {finalizedListData.length > 0 ? (
                      finalizedListData.map(guest => (
                        <div key={guest.id} className="wg-guest-item">
                          <div className="wg-guest-info">
                            <div className="wg-guest-name">{guest.name}</div>
                            <div className="wg-guest-phone">{formatIndianPhone(guest.phone)}</div>
                          </div>
                          <button 
                            className="wg-remove-guest"
                            onClick={() => removeFromFinalizedList(guest.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No guests in your finalized list yet</p>
                    )}
                  </div>
                </div>
              )}
              
              <button 
                className="wg-btn wg-btn-primary"
                style={{ width: '100%', marginTop: '15px' }}
                disabled={finalizedListData.length === 0}
                onClick={handleFinalizeList}
              >
                <CheckCircle size={16} /> Finalize Guest List
              </button>
            </div>
          </div>
          
          {/* Right Content - Message Creation */}
          <div className="wg-content-right">
            <div className="wg-message-section">
              <h2>Create Your Thank You Message</h2>
              
              {!videoPreviewUrl ? (
                <div 
                  className="wg-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="wg-upload-icon">
                    <Video size={48} />
                  </div>
                  <div className="wg-upload-text">Upload Your Thank You Video</div>
                  <div className="wg-upload-subtext">Click to browse or drag and drop your video file</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="wg-video-preview"
                  src={videoPreviewUrl}
                  controls
                />
              )}
              
              <div className="wg-message-actions">
                <button 
                  className="wg-btn wg-btn-outline"
                  onClick={handleVideoReview}
                  disabled={!videoPreviewUrl}
                >
                  <Eye size={16} /> Review Video
                </button>
                <button 
                  className="wg-btn wg-btn-primary"
                  onClick={handleVideoConfirm}
                  disabled={!videoPreviewUrl}
                >
                  <CheckCircle size={16} /> Confirm Video
                </button>
              </div>
            </div>
            
            <div className="wg-delivery-section">
              <h3>Ready to Send Your Gratitude?</h3>
              <p>Your heartfelt thank you message will be delivered to all selected guests via WhatsApp. Please ensure your video is confirmed before sending.</p>
              <button 
                className="wg-btn wg-btn-whatsapp wg-btn-large"
                onClick={handleSendViaWhatsApp}
              >
                <Upload size={20} /> Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save List Modal */}
      {showModal && (
        <div className="wg-modal">
          <div className="wg-modal-content">
            <div className="wg-modal-header">
              <h3>Save Your Guest List</h3>
              <button 
                className="wg-close-modal"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveList}>
              <div className="wg-form-group">
                <label htmlFor="listName">List Name</label>
                <input
                  type="text"
                  id="listName"
                  name="listName"
                  className="wg-form-control"
                  placeholder="e.g. Close Family & Friends"
                  required
                />
              </div>
              <div className="wg-form-group">
                <label htmlFor="listDescription">Description (Optional)</label>
                <input
                  type="text"
                  id="listDescription"
                  name="listDescription"
                  className="wg-form-control"
                  placeholder="e.g. Guests who attended the wedding"
                />
              </div>
              <div className="wg-modal-actions">
                <button 
                  type="button" 
                  className="wg-btn wg-btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="wg-btn wg-btn-primary">
                  Save List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingGratitude;