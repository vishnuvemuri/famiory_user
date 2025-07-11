import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  Edit,
  MoreHorizontal,
  Plus,
  User,
  Settings,
  LogOut,
  Eye,
  Share2,
  Trash2,
  Camera,
  Shield,
  ChevronDown,
  X
} from 'lucide-react';
import styles from './FamioryEventPage.module.css';

// API Service - Easy integration point for backend
class ApiService {
  static async fetchEvents() {
    // TODO: Replace with actual API call
    // return await fetch('/api/events').then(res => res.json());
    return sampleEvents;
  }

  static async createEvent(eventData: Partial<Event>) {
    // TODO: Replace with actual API call
    // return await fetch('/api/events', { method: 'POST', body: JSON.stringify(eventData) });
    console.log('Creating event:', eventData);
  }

  static async updateEvent(id: string, eventData: Partial<Event>) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) });
    console.log('Updating event:', id, eventData);
  }

  static async deleteEvent(id: string) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/events/${id}`, { method: 'DELETE' });
    console.log('Deleting event:', id);
  }

  static async fetchUserProfile() {
    // TODO: Replace with actual API call
    // return await fetch('/api/user/profile').then(res => res.json());
    return sampleUser;
  }

  static async updateUserProfile(profileData: any) {
    // TODO: Replace with actual API call
    // return await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(profileData) });
    console.log('Updating profile:', profileData);
  }
}

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  tag: string;
  tagColor: string;
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

// Sample data - Replace with API calls
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Wedding',
    description: 'Khushi & Dhruv\'s Wedding Celebration',
    date: 'May 1, 2025',
    time: '4:00 PM',
    location: 'Grand Hyatt, Mumbai',
    image: '/uploads/wed.jpeg',
    tag: 'Wedding',
    tagColor: '#8B5CF6'
  },
  {
    id: '2',
    title: 'Family Tour',
    description: 'Eiffel Tower, Paris Family Vacation',
    date: 'June 15, 2025',
    time: 'All Day',
    location: 'Paris, France',
    image: '/uploads/Tour1.jpeg',
    tag: 'Tour',
    tagColor: '#3B82F6'
  },
  {
    id: '3',
    title: 'Baby Birth',
    description: 'Welcome little Reyansh to our family',
    date: 'July 20, 2025',
    time: '12:30 PM',
    location: 'City Hospital, Mumbai',
    image: '/uploads/baby.jpeg',
    tag: 'Birth',
    tagColor: '#10B981'
  }
];

const sampleUser: User = {
  name: 'User Name',
  email: 'user@example.com',
  avatar: 'U'
};

// Profile Modal Component
const ProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    nickName: '',
    surname: '',
    dob: '',
    birthCity: '',
    bio: ''
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    await ApiService.updateUserProfile(profileData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>My Profile</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.profilePictureContainer}>
            <div className={styles.profilePicturePreview}>
              <User size={48} />
            </div>
            <div className={styles.profilePictureActions}>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <Camera size={16} /> Change Photo
              </button>
              <button className={`${styles.btn} ${styles.btnText}`}>
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
          
          <form className={styles.profileForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input 
                  type="text" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nick Name</label>
                <input 
                  type="text" 
                  value={profileData.nickName}
                  onChange={(e) => setProfileData({...profileData, nickName: e.target.value})}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Surname</label>
              <input 
                type="text" 
                value={profileData.surname}
                onChange={(e) => setProfileData({...profileData, surname: e.target.value})}
                required 
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  value={profileData.dob}
                  onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Birth City</label>
                <input 
                  type="text" 
                  value={profileData.birthCity}
                  onChange={(e) => setProfileData({...profileData, birthCity: e.target.value})}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea 
                rows={4} 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              />
            </div>
          </form>
        </div>
        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnText}`} onClick={onClose}>Cancel</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'read' | 'requests'>('admin');
  const [adminForm, setAdminForm] = useState({ firstName: '', email: '' });
  const [readForm, setReadForm] = useState({ firstName: '', email: '', password: '' });
  
  // Sample read requests data - Replace with API calls
  const [pendingRequests] = useState([
    {
      id: '1',
      name: 'Ram Kumar',
      email: 'ram@example.com',
      requestedOn: '7/9/2025',
      avatar: 'R'
    }
  ]);
  
  const [approvedRequests] = useState([
    // Empty for now - will be populated when requests are approved
  ]);

  if (!isOpen) return null;

  const handleAdminInvite = () => {
    // TODO: Replace with API call
    console.log('Sending admin invite:', adminForm);
    setAdminForm({ firstName: '', email: '' });
  };

  const handleReadInvite = () => {
    // TODO: Replace with API call
    console.log('Sending read invite:', readForm);
    setReadForm({ firstName: '', email: '', password: '' });
  };

  const handleApproveRequest = (requestId: string) => {
    // TODO: Replace with API call to approve request
    console.log('Approving request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // TODO: Replace with API call to reject request
    console.log('Rejecting request:', requestId);
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.settingsModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Account Settings</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.settingsTabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'admin' ? styles.active : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Access
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'read' ? styles.active : ''}`}
              onClick={() => setActiveTab('read')}
            >
              Read Access
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'requests' ? styles.active : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Read Requests
            </button>
          </div>
          
          {activeTab === 'admin' && (
            <div className={styles.settingsTabContent}>
              <div className={styles.accessForm}>
                <h4>Grant Admin Access</h4>
                <p>Admin users can manage events, upload photos, and edit family memories.</p>
                
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter first name"
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm({...adminForm, firstName: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter email address"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  />
                </div>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdminInvite}>
                  <Shield size={16} /> Grant Admin Access
                </button>
              </div>
              
              <div className={styles.accessList}>
                <h4>Current Admins</h4>
                <div className={`${styles.emptyState} ${styles.small}`}>
                  <Shield size={32} />
                  <p>No admin users added yet</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'read' && (
            <div className={styles.settingsTabContent}>
              <div className={styles.accessForm}>
                <h4>Grant Read Access</h4>
                <p>Read-only users can view your family memories but cannot make changes.</p>
                
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter first name"
                    value={readForm.firstName}
                    onChange={(e) => setReadForm({...readForm, firstName: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter email address"
                    value={readForm.email}
                    onChange={(e) => setReadForm({...readForm, email: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Access Password</label>
                  <input 
                    type="password" 
                    placeholder="Create a password"
                    value={readForm.password}
                    onChange={(e) => setReadForm({...readForm, password: e.target.value})}
                  />
                </div>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleReadInvite}>
                  <Eye size={16} /> Grant Read Access
                </button>
              </div>
              
              <div className={styles.accessList}>
                <h4>Current Readers</h4>
                <div className={`${styles.emptyState} ${styles.small}`}>
                  <Eye size={32} />
                  <p>No read-only users added yet</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'requests' && (
            <div className={styles.settingsTabContent}>
              <div className={styles.requestsSection}>
                <h4>Pending Requests</h4>
                {pendingRequests.length > 0 ? (
                  <div className={styles.requestsList}>
                    {pendingRequests.map((request) => (
                      <div key={request.id} className={styles.requestItem}>
                        <div className={styles.requestUser}>
                          <div className={styles.requestAvatar}>
                            {request.avatar}
                          </div>
                          <div className={styles.requestInfo}>
                            <div className={styles.requestName}>{request.name}</div>
                            <div className={styles.requestEmail}>{request.email}</div>
                            <div className={styles.requestDate}>Requested on {request.requestedOn}</div>
                          </div>
                        </div>
                        <div className={styles.requestActions}>
                          <button 
                            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <User size={14} /> Approve
                          </button>
                          <button 
                            className={`${styles.btn} ${styles.btnText} ${styles.btnSmall}`}
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${styles.emptyState} ${styles.small}`}>
                    <User size={32} className={styles.emptyIcon} />
                    <p>No pending read access requests</p>
                  </div>
                )}
              </div>
              
              <div className={styles.requestsSection}>
                <h4>Approved Requests</h4>
                {approvedRequests.length > 0 ? (
                  <div className={styles.requestsList}>
                    {approvedRequests.map((request: any) => (
                      <div key={request.id} className={styles.requestItem}>
                        <div className={styles.requestUser}>
                          <div className={styles.requestAvatar}>
                            {request.avatar}
                          </div>
                          <div className={styles.requestInfo}>
                            <div className={styles.requestName}>{request.name}</div>
                            <div className={styles.requestEmail}>{request.email}</div>
                          </div>
                        </div>
                        <div className={styles.requestActions}>
                          <span className={styles.approvedBadge}>Approved</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${styles.emptyState} ${styles.small}`}>
                    <div className={styles.emptyIcon}>
                      <User size={32} />
                    </div>
                    <p>No approved read access requests</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Event Card Component
const EventCard: React.FC<{ event: Event; onEdit: (id: string) => void; onMore: (id: string, event: React.MouseEvent) => void }> = ({ 
  event, 
  onEdit, 
  onMore 
}) => {
  return (
    <div className={styles.eventCard}>
      <div className={styles.eventImage}>
        <img src={event.image} alt={event.title} />
        <div className={styles.eventTag} style={{ backgroundColor: event.tagColor }}>
          {event.tag}
        </div>
      </div>
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventDescription}>{event.description}</p>
        <div className={styles.eventDetails}>
          <div className={styles.eventDetail}>
            <Calendar size={16} className={styles.detailIcon} />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className={styles.eventDetail}>
            <MapPin size={16} className={styles.detailIcon} />
            <span>{event.location}</span>
          </div>
        </div>
        <div className={styles.eventActions}>
          <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => onEdit(event.id)}>
            <Edit size={16} className={styles.actionIcon} />
            Edit
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.moreBtn}`} 
            onClick={(e) => onMore(event.id, e)}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// User Dropdown Component
const UserDropdown: React.FC<{ 
  user: User; 
  isOpen: boolean; 
  onToggle: () => void; 
  onClose: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}> = ({ 
  user, 
  isOpen, 
  onToggle, 
  onClose,
  onProfileClick,
  onSettingsClick
}) => {
  return (
    <div className={styles.userDropdown}>
      <button className={styles.userAvatar} onClick={onToggle}>
        <span className={styles.avatarText}>{user.avatar}</span>
        <ChevronDown size={16} className={styles.dropdownArrow} />
      </button>
      {isOpen && (
        <>
          <div className={styles.dropdownOverlay} onClick={onClose}></div>
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatarLarge}>{user.avatar}</div>
                <div>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
              </div>
            </div>
            <div className={styles.dropdownDivider}></div>
            <button className={styles.dropdownItem} onClick={onProfileClick}>
              <User size={16} className={styles.dropdownIcon} />
              My Profile
            </button>
            <button className={styles.dropdownItem} onClick={onSettingsClick}>
              <Settings size={16} className={styles.dropdownIcon} />
              Settings
            </button>
            <div className={styles.dropdownDivider}></div>
            <button className={`${styles.dropdownItem} ${styles.signOut}`} onClick={() => {/* TODO: Handle sign out */}}>
              <LogOut size={16} className={styles.dropdownIcon} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Context Menu Component
const ContextMenu: React.FC<{ 
  isOpen: boolean; 
  position: { x: number; y: number }; 
  onClose: () => void;
  eventId: string;
}> = ({ isOpen, position, onClose, eventId }) => {
  if (!isOpen) return null;

  const handleAction = async (action: string) => {
    switch (action) {
      case 'edit':
        // TODO: Navigate to edit or open edit modal
        break;
      case 'delete':
        await ApiService.deleteEvent(eventId);
        break;
      case 'preview':
        // TODO: Open preview modal
        break;
      case 'share':
        // TODO: Open share modal
        break;
    }
    onClose();
  };

  return (
    <>
      <div className={styles.contextOverlay} onClick={onClose}></div>
      <div 
        className={styles.contextMenu} 
        style={{ 
          left: position.x, 
          top: position.y,
          display: 'block'
        }}
      >
        <div className={styles.contextHeader}>
          <h4>Event Actions</h4>
          <button className={styles.contextClose} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className={styles.contextItems}>
          <button className={styles.contextItem} onClick={() => handleAction('edit')}>
            <Edit size={16} className={styles.contextIcon} />
            Edit Event
          </button>
          <button className={styles.contextItem} onClick={() => handleAction('preview')}>
            <Eye size={16} className={styles.contextIcon} />
            Preview
          </button>
          <button className={styles.contextItem} onClick={() => handleAction('share')}>
            <Share2 size={16} className={styles.contextIcon} />
            Share
          </button>
          <button className={`${styles.contextItem} ${styles.delete}`} onClick={() => handleAction('delete')}>
            <Trash2 size={16} className={styles.contextIcon} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

// Main Component
const FamioryEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User>(sampleUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    eventId: string;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    eventId: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, userData] = await Promise.all([
          ApiService.fetchEvents(),
          ApiService.fetchUserProfile()
        ]);
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to sample data
        setEvents(sampleEvents);
        setFilteredEvents(sampleEvents);
      }
    };

    loadData();
  }, []);

  // Filter events based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  // const handleCreateEvent = () => {
  //   // TODO: Navigate to create event page or open modal
  //   navigate('/create-event');
  //   console.log('Create event clicked');
  // };
  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: Navigate to edit event page or open modal
    console.log('Edit event:', eventId);
  };

  const handleMoreOptions = (eventId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      position: { x: rect.right - 200, y: rect.bottom + 5 },
      eventId
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleProfileClick = () => {
    setIsUserDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleSettingsClick = () => {
    setIsUserDropdownOpen(false);
    setIsSettingsModalOpen(true);
  };

  return (
    <div className={styles.famioryApp}>
      {/* Header */}
      <header className={styles.appHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>Famiory</div>
            <div className={styles.logoSubtitle}>Family Memories & Events</div>
          </div>
          
          <div className={styles.headerActions}>
            <button 
              className={styles.createBtn}
              onClick={handleCreateEvent}
            >
              <Plus className={styles.btnIcon} />
              Create Event
            </button>
            
            <UserDropdown
              user={user}
              isOpen={isUserDropdownOpen}
              onToggle={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              onClose={() => setIsUserDropdownOpen(false)}
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Upcoming Events</h1>
            <div className={styles.pageActions}>
              <div className={styles.searchContainer}>
                <button className={styles.searchToggle} onClick={toggleSearch}>
                  <Search size={18} />
                </button>
                {isSearchOpen && (
                  <div className={styles.searchBox}>
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button className={styles.searchClose} onClick={toggleSearch}>
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.viewOptions}>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className={`${styles.eventsContainer} ${styles[viewMode]}`}>
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onMore={handleMoreOptions}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Calendar size={64} />
                <Plus size={24} style={{ position: 'absolute', bottom: 0, right: 0 }} />
              </div>
              <h3>No Events Found</h3>
              <p>
                {searchQuery ? 
                  'No events match your search criteria.' : 
                  "You don't have any upcoming events. Create your first event to get started!"
                }
              </p>
              <button className={styles.createBtn} onClick={handleCreateEvent}>
                <Plus size={18} className={styles.btnIcon} />
                Create Event
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        eventId={contextMenu.eventId}
      />

      {/* Modals */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />
    </div>
  );
};

export default FamioryEventPage;