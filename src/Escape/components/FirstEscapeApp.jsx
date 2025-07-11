import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Upload, Plus, Eye, Edit, Trash2, X, Heart, Plane, Hotel, Utensils, Mountain, Umbrella as UmbrellaBeach, Camera, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import './FirstEscapeApp.css';

const FirstEscapeApp = () => {
  // State management
  const [currentPage, setCurrentPage] = useState('main');
  const [memories, setMemories] = useState([]);
  const [journeyDetails, setJourneyDetails] = useState({
    destination: 'Maldives',
    startDate: '2023-06-12',
    endDate: '2023-06-18'
  });
  const [currentView, setCurrentView] = useState('grid');
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);

  // Image states for main page
  const [mainImages, setMainImages] = useState({
    slider: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    snapshot: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
    memory1: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=800',
    memory2: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800'
  });

  // Sample memories data
  useEffect(() => {
    if (memories.length === 0) {
      loadSampleMemories();
    }
  }, []);

  // API Integration Points - Replace these with your actual API calls
  const apiService = {
    // GET /api/memories
    getMemories: async () => {
      return memories;
    },
    
    // POST /api/memories
    createMemory: async (memoryData) => {
      const newMemory = { ...memoryData, id: Date.now() };
      setMemories(prev => [...prev, newMemory]);
      return newMemory;
    },
    
    // PUT /api/memories/:id
    updateMemory: async (id, memoryData) => {
      setMemories(prev => prev.map(m => m.id === id ? { ...m, ...memoryData } : m));
      return { id, ...memoryData };
    },
    
    // DELETE /api/memories/:id
    deleteMemory: async (id) => {
      setMemories(prev => prev.filter(m => m.id !== id));
      return true;
    },
    
    // GET /api/journey-details
    getJourneyDetails: async () => {
      return journeyDetails;
    },
    
    // PUT /api/journey-details
    updateJourneyDetails: async (details) => {
      setJourneyDetails(details);
      return details;
    }
  };

  const loadSampleMemories = () => {
    const sampleMemories = [
      {
        id: 1,
        title: "Arrival in Paradise",
        description: "Our first glimpse of the Maldives was breathtaking. The crystal-clear waters and pristine beaches welcomed us to paradise.",
        date: "2023-06-12",
        category: "Arrival",
        coverImage: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
        media: [
          { type: "image", url: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800" },
          { type: "image", url: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800" }
        ]
      },
      {
        id: 2,
        title: "Sunset Dinner",
        description: "A private candlelit dinner on the beach under the stars. The perfect romantic evening.",
        date: "2023-06-13",
        category: "Romantic Dinner",
        coverImage: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800",
        media: [
          { type: "image", url: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800" }
        ]
      }
    ];
    setMemories(sampleMemories);
  };

  // Image upload handlers
  const handleImageUpload = (file, imageType, index = null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      
      setMainImages(prev => {
        const newImages = { ...prev };
        
        if (imageType === 'slider') {
          // Add new image to slider array
          newImages.slider.push(imageUrl);
          // Update current index to show the new image
          setCurrentSliderIndex(newImages.slider.length - 1);
        } else {
          newImages[imageType] = imageUrl;
        }
        
        return newImages;
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle multiple slider uploads
  const handleSliderMultipleUpload = (files) => {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setMainImages(prev => ({
          ...prev,
          slider: [...prev.slider, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openMemoryModal = (category = null) => {
    setEditingMemory(null);
    setShowMemoryModal(true);
  };

  const openGalleryModal = (memory) => {
    setSelectedMemory(memory);
    setShowGalleryModal(true);
  };

  const closeModals = () => {
    setShowMemoryModal(false);
    setShowGalleryModal(false);
    setSelectedMemory(null);
    setEditingMemory(null);
  };

  const handleMemorySubmit = async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('memory-title').value;
    const description = document.getElementById('memory-desc').value;
    const date = document.getElementById('memory-date').value;
    const category = document.getElementById('memory-category').value;
    
    // Get uploaded files
    const coverInput = document.getElementById('cover-upload');
    const mediaInput = document.getElementById('media-upload');
    
    if (!title || !description || !date) {
      alert('Please fill in all required fields');
      return;
    }
    
    let coverImageUrl = "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800";
    let mediaUrls = [];
    
    // Handle cover image
    if (coverInput.files && coverInput.files[0]) {
      coverImageUrl = URL.createObjectURL(coverInput.files[0]);
    }
    
    // Handle media files
    if (mediaInput.files && mediaInput.files.length > 0) {
      mediaUrls = Array.from(mediaInput.files).map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file)
      }));
    } else {
      // If no media files, use cover image as media
      mediaUrls = [{ type: "image", url: coverImageUrl }];
    }
    
    const memoryData = {
      title,
      description,
      date,
      category: category || 'General',
      coverImage: coverImageUrl,
      media: mediaUrls
    };

    try {
      if (editingMemory) {
        await apiService.updateMemory(editingMemory.id, memoryData);
      } else {
        await apiService.createMemory(memoryData);
      }
      closeModals();
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  };

  const handleDeleteMemory = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await apiService.deleteMemory(id);
        closeModals();
      } catch (error) {
        console.error('Error deleting memory:', error);
      }
    }
  };

  const nextSlide = () => {
    setCurrentSliderIndex((prev) => (prev + 1) % mainImages.slider.length);
  };

  const prevSlide = () => {
    setCurrentSliderIndex((prev) => (prev - 1 + mainImages.slider.length) % mainImages.slider.length);
  };

  const MainPage = () => (
    <div className="fe-main-page">
      {/* Hero Section */}
      <div className="fe-hero-section">
        <div className="fe-hero-left">
          <h1 className="fe-hero-title">Your Journey<br />Begins Here</h1>
          <p className="fe-hero-subtitle">Discover, Connect, Embrace, Love</p>
          
          <div className="fe-button-group">
            <button className="fe-btn fe-btn-primary">Explore Destination</button>
            <button className="fe-btn fe-btn-secondary">Confirm Location</button>
          </div>
          
          <div className="fe-memories-container">
            <button 
              className="fe-btn fe-btn-secondary"
              onClick={() => setCurrentPage('memories')}
            >
              Memories
            </button>
          </div>

          <div className="fe-memory-upload">
            <div className="fe-rotated-text">Moments to Remember</div>
            <div className="fe-rotated-text fe-rotated-text-2">Captured Love Stories</div>
            <div className="fe-image-container">
              <div className="fe-upload-wrapper">
                <img 
                  src={mainImages.memory1}
                  alt="Memory 1" 
                  className="fe-upload-image"
                  onClick={() => document.getElementById('memory1Upload').click()}
                />
                <input 
                  type="file" 
                  id="memory1Upload" 
                  accept="image/*" 
                  style={{display: 'none'}}
                  onChange={(e) => handleImageUpload(e.target.files[0], 'memory1')}
                />
              </div>
              <div className="fe-upload-wrapper">
                <img 
                  src={mainImages.memory2}
                  alt="Memory 2" 
                  className="fe-upload-image"
                  onClick={() => document.getElementById('memory2Upload').click()}
                />
                <input 
                  type="file" 
                  id="memory2Upload" 
                  accept="image/*" 
                  style={{display: 'none'}}
                  onChange={(e) => handleImageUpload(e.target.files[0], 'memory2')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="fe-hero-center">
          <div className="fe-image-slider">
            <div className="fe-slider-image-wrapper">
              <img 
                src={mainImages.slider[currentSliderIndex]} 
                alt="Slider" 
                className="fe-slider-image"
                onClick={() => document.getElementById('sliderUpload').click()}
              />
              <input 
                type="file" 
                id="sliderUpload" 
                  accept="image/*"
                  multiple
                style={{display: 'none'}}
                  onChange={(e) => handleSliderMultipleUpload(e.target.files)}
              />
            </div>
            <div className="fe-slider-buttons">
              <button className="fe-slider-btn fe-slider-prev" onClick={prevSlide}>Previous</button>
              <button className="fe-slider-btn fe-slider-next" onClick={nextSlide}>Next</button>
            </div>
          </div>
        </div>

        <div className="fe-hero-right">
          <div className="fe-top-right">
            <div className="fe-snapshot-container">
              <img 
                src={mainImages.snapshot}
                alt="Snapshot" 
                className="fe-snapshot-image"
                onClick={() => document.getElementById('snapshotUpload').click()}
              />
              <input 
                type="file" 
                id="snapshotUpload" 
                accept="image/*" 
                style={{display: 'none'}}
                onChange={(e) => handleImageUpload(e.target.files[0], 'snapshot')}
              />
            </div>
            <p className="fe-snapshot-title">Snapshot of Happiness</p>
          </div>

          <div className="fe-bottom-right">
            <h3 className="fe-destination-title">Destination Guide</h3>
            <div className="fe-destination-cards">
              <div className="fe-destination-card">
                <img 
                  src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Switzerland" 
                  className="fe-destination-image"
                />
                <h4>Lake Brienz,<br />Switzerland</h4>
                <a href="#" className="fe-read-more">Read More</a>
              </div>
              <div className="fe-destination-card">
                <img 
                  src="https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Maldives" 
                  className="fe-destination-image"
                />
                <h4>Overwater bungalow,<br />Maldives</h4>
                <a href="#" className="fe-read-more">Read More</a>
              </div>
              <div className="fe-destination-card">
                <img 
                  src="https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Positano" 
                  className="fe-destination-image"
                />
                <h4>Villa Treville,<br />Positano!</h4>
                <a href="#" className="fe-read-more">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MemoriesPage = () => (
    <div className="fe-memories-page">
      <div className="fe-container">
        {/* Header */}
        <div className="fe-memory-header">
          <h2 className="fe-memory-title">Our Honeymoon Memories</h2>
          <p className="fe-memory-subtitle">Preserve every magical moment of your first journey together as a married couple</p>
        </div>

        {/* Journey Summary */}
        <div className="fe-journey-summary">
          <h3>Our Honeymoon Journey</h3>
          <div className="fe-journey-details">
            <div className="fe-journey-detail">
              <MapPin className="fe-icon" />
              <p>{journeyDetails.destination}</p>
            </div>
            <div className="fe-journey-detail">
              <Calendar className="fe-icon" />
              <p>{formatDateShort(journeyDetails.startDate)}</p>
            </div>
            <div className="fe-journey-detail">
              <Calendar className="fe-icon" />
              <p>{formatDateShort(journeyDetails.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Memory Categories */}
        <div className="fe-upload-section">
          <div className="fe-section-header">
            <h3>Share Your Moments</h3>
            <p>Create memory folders for different parts of your honeymoon</p>
          </div>

          <div className="fe-upload-options">
            <div className="fe-upload-option" onClick={() => openMemoryModal('Departure')}>
              <Plane className="fe-icon" />
              <h4>Departure</h4>
              <p>Airport/train moments, journey photos</p>
            </div>
            <div className="fe-upload-option" onClick={() => openMemoryModal('Arrival')}>
              <Hotel className="fe-icon" />
              <h4>Arrival</h4>
              <p>First impressions, hotel/resort</p>
            </div>
            <div className="fe-upload-option" onClick={() => openMemoryModal('Romantic Dinner')}>
              <Utensils className="fe-icon" />
              <h4>Romantic Dinner</h4>
              <p>Candlelit meals, special dates</p>
            </div>
            <div className="fe-upload-option" onClick={() => openMemoryModal('Adventures')}>
              <Mountain className="fe-icon" />
              <h4>Adventures</h4>
              <p>Excursions, activities together</p>
            </div>
            <div className="fe-upload-option" onClick={() => openMemoryModal('Relaxation')}>
              <UmbrellaBeach className="fe-icon" />
              <h4>Relaxation</h4>
              <p>Beach moments, spa days</p>
            </div>
            <div className="fe-upload-option" onClick={() => openMemoryModal('Last Day')}>
              <Heart className="fe-icon" />
              <h4>Last Day</h4>
              <p>Final moments, souvenirs</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="fe-view-toggle">
          <button 
            className={`fe-toggle-btn ${currentView === 'grid' ? 'active' : ''}`}
            onClick={() => setCurrentView('grid')}
          >
            <Grid className="fe-icon" /> Grid View
          </button>
          <button 
            className={`fe-toggle-btn ${currentView === 'timeline' ? 'active' : ''}`}
            onClick={() => setCurrentView('timeline')}
          >
            <List className="fe-icon" /> Timeline
          </button>
        </div>

        {/* Memory Grid */}
        {currentView === 'grid' ? (
          <div className="fe-memories-grid">
            {memories.map((memory) => (
              <div key={memory.id} className="fe-memory-card" onClick={() => openGalleryModal(memory)}>
                <img src={memory.coverImage} alt={memory.title} className="fe-memory-cover" />
                <div className="fe-memory-info">
                  <div className="fe-memory-date">{formatDateShort(memory.date)}</div>
                  <h3 className="fe-memory-card-title">{memory.title}</h3>
                  <p className="fe-memory-desc">{memory.description}</p>
                  <div className="fe-memory-stats">
                    <span><Camera className="fe-icon" /> {memory.media.length} media</span>
                    <span><Calendar className="fe-icon" /> {formatDateShort(memory.date)}</span>
                  </div>
                </div>
                <div className="fe-memory-actions">
                  <button 
                    className="fe-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingMemory(memory);
                      setShowMemoryModal(true);
                    }}
                  >
                    <Edit className="fe-icon" />
                  </button>
                  <button 
                    className="fe-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMemory(memory.id);
                    }}
                  >
                    <Trash2 className="fe-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="fe-timeline-view">
            {memories.map((memory, index) => (
              <div key={memory.id} className={`fe-timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="fe-timeline-content">
                  <div className="fe-memory-date">{formatDate(memory.date)}</div>
                  <h3 className="fe-memory-card-title">{memory.title}</h3>
                  <p className="fe-memory-desc">{memory.description}</p>
                  <img src={memory.coverImage} alt={memory.title} className="fe-timeline-image" />
                  <div className="fe-memory-actions">
                    <button className="fe-btn fe-btn-outline" onClick={() => openGalleryModal(memory)}>
                      <Eye className="fe-icon" /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Memory Button */}
        <button className="fe-add-memory-btn" onClick={() => openMemoryModal()}>
          <Plus className="fe-icon" /> Add Another Memory
        </button>
      </div>
    </div>
  );

  return (
    <div className="fe-app">
      {/* Navigation */}
      <div className="fe-navigation">
        <div className="fe-nav-left">
          <h1>The First Escape</h1>
        </div>
        <div className="fe-nav-center">
          <button 
            className={`fe-nav-button ${currentPage === 'main' ? 'active' : ''}`}
            onClick={() => setCurrentPage('main')}
          >
            Home
          </button>
          <button 
            className={`fe-nav-button ${currentPage === 'memories' ? 'active' : ''}`}
            onClick={() => setCurrentPage('memories')}
          >
            Memories
          </button>
          <button className="fe-nav-button">Destination</button>
          <button className="fe-nav-button">Book Now</button>
        </div>
        <div className="fe-nav-right">
          <div className="fe-user-avatar">JS</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="fe-main-content">
        {currentPage === 'main' ? <MainPage /> : <MemoriesPage />}
      </div>

      {/* Memory Modal */}
      {showMemoryModal && (
        <div className="fe-modal" onClick={closeModals}>
          <div className="fe-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="fe-modal-close" onClick={closeModals}>
              <X className="fe-icon" />
            </button>
            <h3 className="fe-modal-title">
              {editingMemory ? 'Edit Memory' : 'Create New Memory'}
            </h3>
            <form onSubmit={handleMemorySubmit} className="fe-modal-form">
              <div className="fe-form-group">
                <label>Memory Title</label>
                <input 
                  type="text" 
                  name="title"
                  id="memory-title"
                  defaultValue={editingMemory?.title || ''}
                  className="fe-form-control" 
                  placeholder="Give this memory a title"
                  required 
                />
              </div>
              <div className="fe-form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  id="memory-desc"
                  defaultValue={editingMemory?.description || ''}
                  className="fe-form-control" 
                  placeholder="Describe this special moment..."
                  required
                />
              </div>
              <div className="fe-form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date"
                  id="memory-date"
                  defaultValue={editingMemory?.date || new Date().toISOString().split('T')[0]}
                  className="fe-form-control" 
                  required 
                />
              </div>
              <div className="fe-form-group">
                <label>Category</label>
                <select name="category" id="memory-category" className="fe-form-control">
                  <option value="General">General</option>
                  <option value="Departure">Departure</option>
                  <option value="Arrival">Arrival</option>
                  <option value="Romantic Dinner">Romantic Dinner</option>
                  <option value="Adventures">Adventures</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Last Day">Last Day</option>
                </select>
              </div>
              <div className="fe-form-group">
                <label>Cover Image</label>
                <div className="fe-upload-area" onClick={() => document.getElementById('cover-upload').click()}>
                  <Upload className="fe-icon" />
                  <p>Click to upload cover image</p>
                  <input 
                    type="file" 
                    id="cover-upload"
                    name="coverImage" 
                    accept="image/*" 
                    style={{display: 'none'}}
                  />
                </div>
              </div>
              <div className="fe-form-group">
                <label>Upload Media (Photos & Videos)</label>
                <div className="fe-upload-area" onClick={() => document.getElementById('media-upload').click()}>
                  <Upload className="fe-icon" />
                  <p>Click to upload photos & videos</p>
                  <input 
                    type="file" 
                    id="media-upload"
                    name="media" 
                    accept="image/*,video/*" 
                    multiple 
                    style={{display: 'none'}}
                  />
                </div>
              </div>
              <button type="submit" className="fe-submit-btn">
                {editingMemory ? 'Update Memory' : 'Save Memory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && selectedMemory && (
        <div className="fe-modal" onClick={closeModals}>
          <div className="fe-gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="fe-modal-close" onClick={closeModals}>
              <X className="fe-icon" />
            </button>
            <div className="fe-gallery-header">
              <h3 className="fe-gallery-title">{selectedMemory.title}</h3>
              <p className="fe-gallery-date">{formatDate(selectedMemory.date)}</p>
            </div>
            <div className="fe-gallery-body">
              <p className="fe-gallery-desc">{selectedMemory.description}</p>
              <div className="fe-gallery-grid">
                {selectedMemory.media.map((media, index) => (
                  <div key={index} className="fe-gallery-item">
                    {media.type === 'image' ? (
                      <img src={media.url} alt={`Memory ${index + 1}`} className="fe-gallery-media" />
                    ) : (
                      <video src={media.url} controls className="fe-gallery-media" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstEscapeApp;