import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { UploadModalProps } from './types';
import styles from './BlessingInvite.module.css';

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [memoryText, setMemoryText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files).filter(file => 
        file.type.startsWith('image/') || file.type.startsWith('video/')
      );
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles, memoryText);
      setSelectedFiles([]);
      setMemoryText('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setMemoryText('');
    onClose();
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h2>Upload Memories</h2>
          <button className={styles['close-button']} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div
          className={`${styles['drop-zone']} ${isDragOver ? styles.dragover : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} />
          <p>Drag and drop files here or click to select</p>
          <p>Supports images and videos</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {selectedFiles.length > 0 && (
          <div>
            <p>Selected files: {selectedFiles.length}</p>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <textarea
          className={styles['memory-text-input']}
          placeholder="Add a description for your memories..."
          value={memoryText}
          onChange={(e) => setMemoryText(e.target.value)}
        />

        <div className={styles['modal-actions']}>
          <button className={styles['cancel-button']} onClick={handleCancel}>
            Cancel
          </button>
          <button 
            className={styles['upload-button']} 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >
            <Upload size={16} />
            Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};