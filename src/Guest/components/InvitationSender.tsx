import React, { useState, useRef, useEffect } from 'react';
import { Upload, Users, Bookmark, HelpCircle, Phone, User, FileText, Video, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import './InvitationSender.css';

interface Contact {
  name: string;
  phone: string;
  raw: string;
}

interface SavedList {
  name: string;
  contacts: Contact[];
}

interface InvitationSenderProps {
  // API integration props
  onUploadFile?: (file: File) => Promise<void>;
  onSaveContacts?: (contacts: Contact[]) => Promise<void>;
  onLoadContacts?: () => Promise<Contact[]>;
  onSendInvitation?: (contact: Contact, file: File) => Promise<void>;
}

const InvitationSender: React.FC<InvitationSenderProps> = ({
  onUploadFile,
  onSaveContacts,
  onLoadContacts,
  onSendInvitation
}) => {
  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [finalizedList, setFinalizedList] = useState<string | null>(null);
  const [currentListIndex, setCurrentListIndex] = useState<number | null>(null);
  const [editingListIndex, setEditingListIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [showHelp, setShowHelp] = useState({ invitation: false, contacts: false });
  const [activeTab, setActiveTab] = useState('android');
  const [listName, setListName] = useState('');
  const [manualContact, setManualContact] = useState({ name: '', phone: '' });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vcfInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const contactsPerPage = 10;

  // File handling
  const handleFileUpload = async (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'];
    if (!validTypes.includes(file.type)) {
      showStatus('Please upload a valid file (PDF, JPG, PNG, or MP4)', 'error');
      return;
    }

    setSelectedFile(file);
    if (onUploadFile) {
      try {
        await onUploadFile(file);
      } catch (error) {
        showStatus('Error uploading file', 'error');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // VCF parsing
  const parseVcf = (vcfData: string) => {
    const contactBlocks = vcfData.split('BEGIN:VCARD').filter(block => block.trim() !== '');
    const newContacts: Contact[] = [];

    contactBlocks.forEach(block => {
      const fullBlock = 'BEGIN:VCARD' + block;
      const lines = fullBlock.split('\n');
      let contact: Contact = { name: '', phone: '', raw: fullBlock };

      lines.forEach(line => {
        if (line.startsWith('FN:')) {
          contact.name = line.substring(3).trim();
        } else if (line.startsWith('TEL;') || line.startsWith('TEL:')) {
          const phone = line.split(':')[1].replace(/[^\d+]/g, '');
          if (phone) contact.phone = phone;
        }
      });

      if (contact.name || contact.phone) {
        newContacts.push(contact);
      }
    });

    setContacts(newContacts);
    setCurrentPage(1);
    setSearchTerm('');
    showStatus(`Loaded ${newContacts.length} contacts`, 'success');
  };

  const handleVcfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const vcfData = e.target?.result as string;
      parseVcf(vcfData);
    };
    reader.readAsText(file);
  };

  // Contact management
  const toggleContactSelection = (index: number) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedContacts(newSelected);
  };

  const selectAllContacts = () => {
    const displayContacts = getDisplayContacts();
    const newSelected = new Set(selectedContacts);
    displayContacts.forEach(contact => {
      const index = contacts.indexOf(contact);
      newSelected.add(index);
    });
    setSelectedContacts(newSelected);
  };

  const deselectAllContacts = () => {
    const displayContacts = getDisplayContacts();
    const newSelected = new Set(selectedContacts);
    displayContacts.forEach(contact => {
      const index = contacts.indexOf(contact);
      newSelected.delete(index);
    });
    setSelectedContacts(newSelected);
  };

  const addManualContact = () => {
    const { name, phone } = manualContact;
    if (!name.trim() && !phone.trim()) {
      showStatus('Please enter at least a name or phone number', 'error');
      return;
    }

    if (phone && !/^[\d+][\d\s-]{5,}$/.test(phone)) {
      showStatus('Please enter a valid phone number', 'error');
      return;
    }

    const newContact: Contact = {
      name: name.trim() || 'No Name',
      phone: phone.trim() || 'No Phone',
      raw: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEND:VCARD`
    };

    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
    setSelectedContacts(prev => new Set([...prev, newContacts.length - 1]));
    setManualContact({ name: '', phone: '' });
    showStatus('Contact added successfully', 'success');
  };

  // List management
  const saveContactList = async () => {
    if (selectedContacts.size === 0) {
      showStatus('No contacts selected to save', 'error');
      return;
    }

    const selectedContactsArray = Array.from(selectedContacts).map(i => contacts[i]);
    const newListName = listName.trim() || 'My Contact List';

    if (editingListIndex !== null) {
      const newSavedLists = [...savedLists];
      newSavedLists[editingListIndex] = {
        name: newListName,
        contacts: selectedContactsArray
      };
      setSavedLists(newSavedLists);
      setEditingListIndex(null);
      showStatus(`"${newListName}" updated successfully`, 'success');
    } else {
      setSavedLists(prev => [...prev, { name: newListName, contacts: selectedContactsArray }]);
      showStatus(`"${newListName}" with ${selectedContactsArray.length} contacts saved successfully`, 'success');
    }

    if (onSaveContacts) {
      try {
        await onSaveContacts(selectedContactsArray);
      } catch (error) {
        showStatus('Error saving contacts to server', 'error');
      }
    }

    setSelectedContacts(new Set());
    setListName('');
  };

  const loadList = (index: number) => {
    const list = savedLists[index];
    setContacts([...list.contacts]);
    const newSelected = new Set<number>();
    for (let i = 0; i < list.contacts.length; i++) {
      newSelected.add(i);
    }
    setSelectedContacts(newSelected);
    setCurrentPage(1);
    setCurrentListIndex(index);
    setEditingListIndex(null);
    showStatus(`Loaded "${list.name}" with ${list.contacts.length} contacts`, 'success');
  };

  const deleteList = (index: number) => {
    const listName = savedLists[index].name;
    if (window.confirm(`Are you sure you want to delete the list "${listName}"?`)) {
      setSavedLists(prev => prev.filter((_, i) => i !== index));
      if (finalizedList === listName) {
        setFinalizedList(null);
      }
      if (currentListIndex === index) {
        setCurrentListIndex(null);
        setContacts([]);
        setSelectedContacts(new Set());
      }
      showStatus(`"${listName}" deleted successfully`, 'success');
    }
  };

  const finalizeList = (index: number) => {
    const list = savedLists[index];
    setFinalizedList(list.name);
    showStatus(`"${list.name}" set as the finalized list for sending`, 'success');
  };

  // Utility functions
  const getDisplayContacts = () => {
    return searchTerm
      ? contacts.filter(contact => 
          contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : contacts;
  };

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    if (type === 'success') {
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 5000);
    }
  };

  const sendToContact = async (contact: Contact) => {
    if (!selectedFile) {
      showStatus('Please upload an invitation file first', 'error');
      return;
    }

    if (onSendInvitation) {
      try {
        await onSendInvitation(contact, selectedFile);
        showStatus(`Invitation sent to ${contact.name}`, 'success');
      } catch (error) {
        showStatus('Error sending invitation', 'error');
      }
    } else {
      // Default WhatsApp behavior
      const message = getMessageForFileType(selectedFile);
      const whatsappLink = `https://web.whatsapp.com/send?phone=${contact.phone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
      showStatus(`Opened WhatsApp for ${contact.phone}`, 'success');
    }
  };

  const getMessageForFileType = (file: File) => {
    if (file.type.includes('image')) return 'Please check the attached image invitation';
    if (file.type.includes('video')) return 'Please check the attached video invitation';
    if (file.type === 'application/pdf') return 'Please check the attached PDF invitation';
    return 'Please check the attached invitation';
  };

  // Pagination
  const displayContacts = getDisplayContacts();
  const totalPages = Math.ceil(displayContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const pageContacts = displayContacts.slice(startIndex, startIndex + contactsPerPage);

  const finalizedListData = finalizedList ? savedLists.find(l => l.name === finalizedList) : null;

  return (
    <div className="invitation-sender">
      <header className="invitation-sender__header">
        <h1>Send Your Invitations</h1>
        <p>Upload your invitation card and select contacts to send</p>
      </header>

      <div className="invitation-sender__main">
        {/* Upload Section */}
        <div className="invitation-sender__upload">
          <h2 className="invitation-sender__section-title">
            Invitation Card
            <HelpCircle
              className="invitation-sender__help-toggle"
              onClick={() => setShowHelp(prev => ({ ...prev, invitation: !prev.invitation }))}
            />
          </h2>

          {showHelp.invitation && (
            <div className="invitation-sender__help-content">
              <p>Upload your invitation card in PDF, image (JPG/PNG), or video (MP4) format.</p>
            </div>
          )}

          <div
            className="invitation-sender__upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={48} />
            <p>Drag & Drop your invitation file here or click to browse</p>
            <p className="invitation-sender__small">Supports: PDF, JPG, PNG, MP4</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.mp4"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <button className="invitation-sender__btn invitation-sender__btn--secondary">
              Browse Files
            </button>
          </div>

          {selectedFile && (
            <div className="invitation-sender__preview">
              <h3>Preview</h3>
              <div className="invitation-sender__preview-content">
                {selectedFile.type === 'application/pdf' && (
                  <div className="invitation-sender__file-preview">
                    <FileText size={48} />
                    <p>{selectedFile.name}</p>
                  </div>
                )}
                {selectedFile.type.includes('image') && (
                  <div className="invitation-sender__file-preview">
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
                    <p>{selectedFile.name}</p>
                  </div>
                )}
                {selectedFile.type.includes('video') && (
                  <div className="invitation-sender__file-preview">
                    <video controls>
                      <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                    </video>
                    <p>{selectedFile.name}</p>
                  </div>
                )}
              </div>
              <button 
                className="invitation-sender__btn invitation-sender__btn--danger"
                onClick={clearFile}
              >
                Remove File
              </button>
            </div>
          )}
        </div>

        {/* Contact List Section */}
        <div className="invitation-sender__contacts">
          <h2 className="invitation-sender__section-title">
            Contact List
            <HelpCircle
              className="invitation-sender__help-toggle"
              onClick={() => setShowHelp(prev => ({ ...prev, contacts: !prev.contacts }))}
            />
          </h2>

          {showHelp.contacts && (
            <div className="invitation-sender__help-content">
              <p>Upload your contacts from a .vcf file or add them manually.</p>
            </div>
          )}

          <div className="invitation-sender__search">
            <input
              type="text"
              placeholder="Search contacts by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="invitation-sender__vcf-upload">
            <Users size={24} />
            <p>Upload your .vcf contact file</p>
            <input
              ref={vcfInputRef}
              type="file"
              accept=".vcf"
              onChange={handleVcfUpload}
              style={{ display: 'none' }}
            />
            <button
              className="invitation-sender__btn invitation-sender__btn--secondary"
              onClick={() => vcfInputRef.current?.click()}
            >
              Upload VCF File
            </button>
          </div>

          <div className="invitation-sender__list-actions">
            <div>
              <span className="invitation-sender__selected-count">{selectedContacts.size}</span> contacts selected
            </div>
            <div className="invitation-sender__action-buttons">
              <button className="invitation-sender__btn invitation-sender__btn--secondary" onClick={selectAllContacts}>
                Select All
              </button>
              <button className="invitation-sender__btn invitation-sender__btn--secondary" onClick={deselectAllContacts}>
                Deselect All
              </button>
            </div>
          </div>

          <div className="invitation-sender__contacts-list">
            {pageContacts.length === 0 ? (
              <div className="invitation-sender__no-contacts">
                <Users size={48} />
                <p>No contacts loaded yet. Upload a .vcf file or add contacts manually.</p>
              </div>
            ) : (
              pageContacts.map((contact, index) => {
                const globalIndex = contacts.indexOf(contact);
                const isSelected = selectedContacts.has(globalIndex);
                return (
                  <div key={globalIndex} className="invitation-sender__contact-item">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleContactSelection(globalIndex)}
                    />
                    <div className="invitation-sender__contact-info">
                      <div className="invitation-sender__contact-name">{contact.name || 'No Name'}</div>
                      <div className="invitation-sender__contact-phone">{contact.phone || 'No Phone'}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="invitation-sender__pagination">
              <button
                className="invitation-sender__btn invitation-sender__btn--secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="invitation-sender__btn invitation-sender__btn--secondary"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <div className="invitation-sender__save-list">
            <input
              type="text"
              placeholder="Name this contact list (optional)"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
            <button className="invitation-sender__btn" onClick={saveContactList}>
              Save List
            </button>
          </div>

          <div className="invitation-sender__manual-add">
            <h3>Add Contact Manually</h3>
            <div className="invitation-sender__manual-form">
              <input
                type="text"
                placeholder="Name"
                value={manualContact.name}
                onChange={(e) => setManualContact(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={manualContact.phone}
                onChange={(e) => setManualContact(prev => ({ ...prev, phone: e.target.value }))}
              />
              <button className="invitation-sender__btn" onClick={addManualContact}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Saved Lists Section */}
        <div className="invitation-sender__saved-lists">
          <h2 className="invitation-sender__section-title">Saved Contact Lists</h2>
          
          {savedLists.length === 0 ? (
            <div className="invitation-sender__no-contacts">
              <Bookmark size={48} />
              <p>No saved lists yet. Save a contact list to see it here.</p>
            </div>
          ) : (
            <div className="invitation-sender__saved-lists-container">
              {savedLists.map((list, index) => (
                <div key={index} className="invitation-sender__saved-list-item">
                  <button
                    className="invitation-sender__btn invitation-sender__btn--secondary"
                    onClick={() => loadList(index)}
                  >
                    {list.name}
                  </button>
                  <div className="invitation-sender__list-item-actions">
                    <button
                      className="invitation-sender__btn invitation-sender__btn--success"
                      onClick={() => finalizeList(index)}
                    >
                      Finalize
                    </button>
                    <button
                      className="invitation-sender__btn invitation-sender__btn--danger"
                      onClick={() => deleteList(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Section */}
      <div className="invitation-sender__send">
        <h2>Send Invitations</h2>
        <p>Click "Send" for each contact to open WhatsApp web. Then, attach the invitation file and send the message.</p>
        
        {finalizedListData && (
          <div className="invitation-sender__finalized-info">
            <p>Invitations will be sent to:</p>
            <div className="invitation-sender__finalized-list">
              <span className="invitation-sender__finalized-name">{finalizedListData.name}</span>
              ({finalizedListData.contacts.length} contacts)
            </div>
          </div>
        )}

        <div className="invitation-sender__contacts-to-send">
          <h3>Contacts in Finalized List</h3>
          {finalizedListData && finalizedListData.contacts.length > 0 ? (
            finalizedListData.contacts.map((contact, index) => (
              contact.phone && contact.phone !== 'No Phone' && (
                <div key={index} className="invitation-sender__contact-item">
                  <div className="invitation-sender__contact-info">
                    <div className="invitation-sender__contact-name">{contact.name || 'No Name'}</div>
                    <div className="invitation-sender__contact-phone">{contact.phone}</div>
                  </div>
                  <button
                    className="invitation-sender__btn invitation-sender__btn--success"
                    onClick={() => sendToContact(contact)}
                  >
                    <Phone size={16} />
                    Send
                  </button>
                </div>
              )
            ))
          ) : (
            <p>No list finalized yet.</p>
          )}
        </div>
      </div>

      {/* Status Message */}
      {statusMessage.text && (
        <div className={`invitation-sender__status invitation-sender__status--${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
};

export default InvitationSender;