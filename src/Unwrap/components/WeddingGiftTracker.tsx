import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, Gift, PhoneIcon as PhotoIcon, ArrowLeft, Plus, Edit, Trash2, Save, Star, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './WeddingGiftTracker.module.css';

// API Configuration - Replace these with your actual API endpoints
const API_CONFIG = {
  // Gift tracker API endpoints
  giftTracker: {
    get: '/api/gift-tracker',
    save: '/api/gift-tracker',
    delete: '/api/gift-tracker'
  },
  // Categories API endpoints
  categories: {
    get: '/api/categories',
    create: '/api/categories',
    delete: '/api/categories'
  },
  // Memories API endpoints
  memories: {
    get: '/api/memories',
    upload: '/api/memories/upload',
    delete: '/api/memories'
  }
};

interface Memory {
  id: number;
  type: 'image' | 'video';
  src: string;
  folder: string;
  date: string;
}

interface Category {
  name: string;
  description: string;
  image: string;
}

interface GiftItem {
  name: string;
  gift: string;
}

const WeddingGiftTracker: React.FC = () => {
  // State management
  const [memories, setMemories] = useState<Record<string, Memory[]>>({
    luxury: [],
    surprise: [],
    friends: [],
    family: []
  });
  const [customCategories, setCustomCategories] = useState<Record<string, Category>>({});
  const [giftTableData, setGiftTableData] = useState<GiftItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState('');
  const [selectedMemoryId, setSelectedMemoryId] = useState<number | null>(null);
  
  // Modal states
  const [showGiftTracker, setShowGiftTracker] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  // Form states
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [selectedFolder, setSelectedFolder] = useState('luxury');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  
  // Gallery states
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMediaItems, setCurrentMediaItems] = useState<Memory[]>([]);
  
  // Selection states
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMemories, setSelectedMemories] = useState<Set<number>>(new Set());
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Confirm modal states
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  // Default categories
  const defaultCategories: Record<string, Category> = {
    luxury: { name: "Luxury Gifts", description: "Timeless treasures that shine the brightest", image: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    surprise: { name: "Surprise Gifts", description: "When unexpected gifts become unforgettable", image: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    friends: { name: "Friends' Gifts", description: "Heartfelt tokens from those who know us best", image: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    family: { name: "Family Gifts", description: "Family love, packed into thoughtful presents", image: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
  };

  // API Integration functions - Replace with actual API calls
  const fetchGiftTracker = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch(API_CONFIG.giftTracker.get);
      // const data = await response.json();
      // setGiftTableData(data);
      
      // For now, load from localStorage
      const saved = localStorage.getItem('giftTableData');
      if (saved) {
        setGiftTableData(JSON.parse(saved));
      } else {
        setGiftTableData(Array(5).fill(null).map(() => ({ name: '', gift: '' })));
      }
    } catch (error) {
      console.error('Error fetching gift tracker:', error);
    }
  };

  const saveGiftTracker = async () => {
    try {
      // Replace with actual API call
      // await fetch(API_CONFIG.giftTracker.save, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(giftTableData)
      // });
      
      // For now, save to localStorage
      localStorage.setItem('giftTableData', JSON.stringify(giftTableData));
    } catch (error) {
      console.error('Error saving gift tracker:', error);
    }
  };

  const uploadMemory = async (file: File, folder: string) => {
    try {
      // Replace with actual API call
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('folder', folder);
      // const response = await fetch(API_CONFIG.memories.upload, {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // return data;
      
      // For now, create local URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const memory: Memory = {
            id: Date.now() + Math.random(),
            type: file.type.includes('image') ? 'image' : 'video',
            src: e.target?.result as string,
            folder,
            date: new Date().toLocaleDateString()
          };
          resolve(memory);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error uploading memory:', error);
      throw error;
    }
  };

  // Initialize component
  useEffect(() => {
    fetchGiftTracker();
  }, []);

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(file => uploadMemory(file, selectedFolder));
    
    try {
      const uploadedMemories = await Promise.all(uploadPromises);
      setMemories(prev => ({
        ...prev,
        [selectedFolder]: [...(prev[selectedFolder] || []), ...uploadedMemories as Memory[]]
      }));
      setShowUploadModal(false);
      alert(`${files.length} files uploaded successfully!`);
    } catch (error) {
      alert('Error uploading files');
    }
  };

  // Add new category
  const addCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const id = 'custom-' + categoryName.toLowerCase().replace(/\s+/g, '-');
    
    try {
      let imageUrl = "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
      
      if (categoryImage) {
        // Replace with actual API call for image upload
        // const formData = new FormData();
        // formData.append('image', categoryImage);
        // const response = await fetch('/api/upload-image', { method: 'POST', body: formData });
        // const data = await response.json();
        // imageUrl = data.url;
        
        // For now, create local URL
        imageUrl = URL.createObjectURL(categoryImage);
      }

      const newCategory: Category = {
        name: categoryName,
        description: categoryDescription,
        image: imageUrl
      };

      setCustomCategories(prev => ({ ...prev, [id]: newCategory }));
      setMemories(prev => ({ ...prev, [id]: [] }));
      
      // Reset form
      setCategoryName('');
      setCategoryDescription('');
      setCategoryImage(null);
      
      alert(`Category "${categoryName}" added successfully!`);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    }
  };

  // Show confirmation modal
  const showConfirmation = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, memoryId: number) => {
    e.preventDefault();
    setSelectedMemoryId(memoryId);
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setShowContextMenu(true);
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  // Gallery navigation
  const openGallery = (index: number, folder: string) => {
    const items = folder === 'all' ? getAllMemories() : memories[folder] || [];
    setCurrentMediaItems(items);
    setCurrentMediaIndex(index);
    setShowGallery(true);
  };

  const getAllMemories = () => {
    return Object.values(memories).flat();
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGallery) {
        if (e.key === 'ArrowLeft') {
          setCurrentMediaIndex(prev => (prev - 1 + currentMediaItems.length) % currentMediaItems.length);
        } else if (e.key === 'ArrowRight') {
          setCurrentMediaIndex(prev => (prev + 1) % currentMediaItems.length);
        } else if (e.key === 'Escape') {
          setShowGallery(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showGallery, currentMediaItems.length]);

  // Render categories
  const renderCategories = () => {
    const allCategories = { ...defaultCategories, ...customCategories };
    
    return Object.entries(allCategories).map(([id, category]) => {
      const count = memories[id]?.length || 0;
      return (
        <div key={id} className={styles.categoryCard} onClick={() => showFolderMemories(id)}>
          <img src={category.image} alt={category.name} className={styles.categoryImage} />
          <div className={styles.categoryContent}>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
          <div className={styles.memoriesCount}>{count}</div>
        </div>
      );
    });
  };

  const showFolderMemories = (folder: string) => {
    setCurrentFolder(folder);
  };

  const showAllMemories = () => {
    setCurrentFolder('all');
  };

  const backToCategories = () => {
    setCurrentFolder('');
    setSelectionMode(false);
    setSelectedMemories(new Set());
  };

  // Memory selection functions
  const toggleMemorySelection = (memoryId: number) => {
    const newSelected = new Set(selectedMemories);
    if (newSelected.has(memoryId)) {
      newSelected.delete(memoryId);
    } else {
      newSelected.add(memoryId);
    }
    setSelectedMemories(newSelected);
  };

  const selectAllMemories = () => {
    const items = currentFolder === 'all' ? getAllMemories() : memories[currentFolder] || [];
    const allIds = new Set(items.map(item => item.id));
    setSelectedMemories(allIds);
  };

  const deselectAllMemories = () => {
    setSelectedMemories(new Set());
  };

  const deleteSelectedMemories = () => {
    if (selectedMemories.size === 0) {
      alert('Please select memories to delete');
      return;
    }

    showConfirmation(
      'Delete Selected Memories',
      `Are you sure you want to delete ${selectedMemories.size} selected ${selectedMemories.size === 1 ? 'memory' : 'memories'}? This action cannot be undone.`,
      () => {
        const newMemories = { ...memories };
        Object.keys(newMemories).forEach(folder => {
          newMemories[folder] = newMemories[folder].filter(m => !selectedMemories.has(m.id));
        });
        setMemories(newMemories);
        setSelectedMemories(new Set());
        setSelectionMode(false);
        setShowConfirmModal(false);
      }
    );
  };

  // Render memories
  const renderMemories = () => {
    const items = currentFolder === 'all' ? getAllMemories() : memories[currentFolder] || [];
    
    if (items.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>No memories found in this folder. Upload some to get started!</p>
        </div>
      );
    }

    return items.map((item, index) => (
      <div
        key={item.id}
        className={styles.memoryItem}
        onClick={() => selectionMode ? toggleMemorySelection(item.id) : openGallery(index, currentFolder)}
        onContextMenu={(e) => handleContextMenu(e, item.id)}
      >
        {selectionMode && (
          <div className={styles.selectionOverlay}>
            <input
              type="checkbox"
              checked={selectedMemories.has(item.id)}
              onChange={() => toggleMemorySelection(item.id)}
              className={styles.selectionCheckbox}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {item.type === 'image' ? (
          <img src={item.src} alt="Memory" className={styles.memoryMedia} />
        ) : (
          <video src={item.src} className={styles.memoryMedia} preload="metadata" />
        )}
        <div className={styles.memoryType}>{item.type === 'image' ? 'Photo' : 'Video'}</div>
      </div>
    ));
  };

  return (
    <div className={styles.weddingGiftTracker}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Unwrapping the Joy</h1>
          <p className={styles.subtitle}>Preserving your wedding gift memories</p>
          <div className={styles.headerButtons}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowGiftTracker(true)}>
              <Gift size={20} /> Gift Tracker
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={showAllMemories}>
              <PhotoIcon size={20} /> View All Memories
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageContainer}>
          <img 
            src="https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Wedding couple" 
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroText}>
          <h2>Cherish Every Moment</h2>
          <p>After the wedding celebrations, take time together to unwrap each gift, capture the memories, and preserve the love and thoughtfulness from your family and friends. This is your space to document every special present and the joy it brought.</p>
        </div>
      </section>

      {/* Upload Section */}
      <section className={styles.uploadSection}>
        <h2>Add Your Memories</h2>
        <p>Upload photos and videos of your gift unwrapping moments to preserve them forever</p>
        <div className={styles.uploadOptions}>
          <div className={styles.uploadBtn} onClick={() => { setUploadType('photo'); setShowUploadModal(true); }}>
            <Camera size={32} />
            <span>Add Photos</span>
          </div>
          <div className={styles.uploadBtn} onClick={() => { setUploadType('video'); setShowUploadModal(true); }}>
            <Video size={32} />
            <span>Add Videos</span>
          </div>
        </div>
      </section>

      {/* Add Category Section */}
      <section className={styles.addCategory}>
        <h2>Create New Category</h2>
        <div className={styles.addCategoryForm}>
          <div className={styles.formGroup}>
            <label>Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Handmade Gifts"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <input
              type="text"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="e.g. Thoughtful handmade creations"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
            />
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={addCategory}>
            <Plus size={20} /> Add Category
          </button>
        </div>
      </section>

      {/* Categories or Memories View */}
      {currentFolder ? (
        <section className={styles.memoriesContainer}>
          <div className={styles.memoriesHeader}>
            <h2>
              {currentFolder === 'all' ? 'All Memories' : 
               `${(customCategories[currentFolder] || defaultCategories[currentFolder])?.name || 'Folder'} Memories`}
            </h2>
            <div className={styles.headerActions}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={backToCategories}>
                <ArrowLeft size={20} /> Back to Categories
              </button>
              {currentFolder !== 'all' && (
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => showConfirmation(
                    'Delete Folder',
                    `Are you sure you want to delete this folder and all its memories?`,
                    () => {
                      if (customCategories[currentFolder]) {
                        const newCustomCategories = { ...customCategories };
                        delete newCustomCategories[currentFolder];
                        setCustomCategories(newCustomCategories);
                      }
                      const newMemories = { ...memories };
                      newMemories[currentFolder] = [];
                      setMemories(newMemories);
                      backToCategories();
                      setShowConfirmModal(false);
                    }
                  )}
                >
                  <Trash2 size={20} /> Delete Folder
                </button>
              )}
            </div>
          </div>
          <div className={styles.memoriesGrid}>
            {renderMemories()}
          </div>
        </section>
      ) : (
        <section className={styles.categories}>
          <h2>Your Gift Categories</h2>
          <div className={styles.categoryGrid}>
            {renderCategories()}
          </div>
        </section>
      )}

      {/* Gift Tracker Modal */}
      {showGiftTracker && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button className={styles.closeBtn} onClick={() => setShowGiftTracker(false)}>
              <X size={24} />
            </button>
            <h2>Gift Tracker</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>No.</th>
                    <th style={{ width: '40%' }}>Guest Name</th>
                    <th style={{ width: '40%' }}>Gift Received</th>
                    {editMode && <th style={{ width: '10%' }}>Select</th>}
                  </tr>
                </thead>
                <tbody>
                  {giftTableData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newData = [...giftTableData];
                            newData[index].name = e.target.value;
                            setGiftTableData(newData);
                          }}
                          className={styles.tableInput}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.gift}
                          onChange={(e) => {
                            const newData = [...giftTableData];
                            newData[index].gift = e.target.value;
                            setGiftTableData(newData);
                          }}
                          className={styles.tableInput}
                        />
                      </td>
                      {editMode && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.has(index)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedRows);
                              if (e.target.checked) {
                                newSelected.add(index);
                              } else {
                                newSelected.delete(index);
                              }
                              setSelectedRows(newSelected);
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.buttonContainer}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  const newData = [...giftTableData, { name: '', gift: '' }];
                  setGiftTableData(newData);
                }}
              >
                <Plus size={20} /> Add Row
              </button>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setEditMode(!editMode)}
              >
                <Edit size={20} /> {editMode ? 'Exit Edit' : 'Edit Table'}
              </button>
              {editMode && (
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    const newData = giftTableData.filter((_, index) => !selectedRows.has(index));
                    setGiftTableData(newData);
                    setSelectedRows(new Set());
                  }}
                >
                  <Trash2 size={20} /> Delete Selected
                </button>
              )}
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  saveGiftTracker();
                  alert('Gift table saved successfully!');
                }}
              >
                <Save size={20} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button className={styles.closeBtn} onClick={() => setShowUploadModal(false)}>
              <X size={24} />
            </button>
            <h2>Upload {uploadType === 'photo' ? 'Photos' : 'Videos'}</h2>
            <div className={styles.uploadArea}>
              <div className={styles.uploadDrop}>
                <Upload size={48} />
                <p>Drag and drop files here or</p>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </button>
              </div>
              <div className={styles.folderSelect}>
                <label>Select Folder:</label>
                <select 
                  value={selectedFolder} 
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className={styles.select}
                >
                  {Object.entries({ ...defaultCategories, ...customCategories }).map(([id, category]) => (
                    <option key={id} value={id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(e.target.files);
                }
              }}
            />
            <div className={styles.buttonContainer}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className={styles.popup}>
          <div className={styles.popupContent} style={{ maxWidth: '500px' }}>
            <button className={styles.closeBtn} onClick={() => setShowConfirmModal(false)}>
              <X size={24} />
            </button>
            <h2>{confirmTitle}</h2>
            <p>{confirmMessage}</p>
            <div className={styles.buttonContainer}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  confirmAction?.();
                  setShowConfirmModal(false);
                }}
              >
                Confirm
              </button>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && currentMediaItems.length > 0 && (
        <div className={styles.galleryModal}>
          <div className={styles.galleryContent}>
            <button className={styles.galleryClose} onClick={() => setShowGallery(false)}>
              <X size={32} />
            </button>
            <div className={styles.galleryNav}>
              <button 
                className={styles.galleryNavBtn}
                onClick={() => setCurrentMediaIndex(prev => (prev - 1 + currentMediaItems.length) % currentMediaItems.length)}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className={styles.galleryNavBtn}
                onClick={() => setCurrentMediaIndex(prev => (prev + 1) % currentMediaItems.length)}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            {currentMediaItems[currentMediaIndex]?.type === 'image' ? (
              <img 
                src={currentMediaItems[currentMediaIndex].src} 
                alt="Memory" 
                className={styles.galleryMedia}
              />
            ) : (
              <video 
                src={currentMediaItems[currentMediaIndex]?.src} 
                controls 
                className={styles.galleryMedia}
              />
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          ref={contextMenuRef}
          className={styles.contextMenu}
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <ul>
            <li onClick={() => {
              const memory = Object.values(memories).flat().find(m => m.id === selectedMemoryId);
              if (memory?.type === 'image') {
                // Update hero image
                alert('Hero image updated!');
              }
              setShowContextMenu(false);
            }}>
              <Star size={16} /> Set as Hero Image
            </li>
            <li onClick={() => {
              const memory = Object.values(memories).flat().find(m => m.id === selectedMemoryId);
              if (memory) {
                // Download functionality
                const link = document.createElement('a');
                link.href = memory.src;
                link.download = `memory-${memory.id}.${memory.type === 'image' ? 'jpg' : 'mp4'}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              setShowContextMenu(false);
            }}>
              <Upload size={16} /> Download
            </li>
            <li 
              onClick={() => {
                showConfirmation(
                  'Delete Memory',
                  'Are you sure you want to delete this memory?',
                  () => {
                    const newMemories = { ...memories };
                    Object.keys(newMemories).forEach(folder => {
                      newMemories[folder] = newMemories[folder].filter(m => m.id !== selectedMemoryId);
                    });
                    setMemories(newMemories);
                    setShowContextMenu(false);
                    setShowConfirmModal(false);
                  }
                );
              }}
              className={styles.deleteOption}
            >
              <Trash2 size={16} /> Delete Memory
            </li>
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h3>Unwrapping the Joy</h3>
          <p>Preserving your wedding gift memories for a lifetime</p>
        </div>
      </footer>
    </div>
  );
};

export default WeddingGiftTracker;