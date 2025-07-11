import React, { useState, useRef, useEffect } from 'react';
import { Upload, User, Calendar, Clock, MapPin, Stars as Mars, Menu as Venus, CheckCircle } from 'lucide-react';

interface FormData {
  name: string;
  gender: 'male' | 'female';
  dob: string;
  time: string;
  location: string;
  kundaliImage: File | null;
}

interface VedicAstrologyFormProps {
  onGroomSubmit?: (data: FormData) => Promise<void>;
  onBrideSubmit?: (data: FormData) => Promise<void>;
  apiEndpoint?: string;
}

const VedicAstrologyForm: React.FC<VedicAstrologyFormProps> = ({
  onGroomSubmit,
  onBrideSubmit,
  apiEndpoint = '/api/analyze-kundali'
}) => {
  const [groomData, setGroomData] = useState<FormData>({
    name: '',
    gender: 'male',
    dob: '',
    time: '',
    location: '',
    kundaliImage: null
  });

  const [brideData, setBrideData] = useState<FormData>({
    name: '',
    gender: 'female',
    dob: '',
    time: '',
    location: '',
    kundaliImage: null
  });

  const [groomLoading, setGroomLoading] = useState(false);
  const [brideLoading, setBrideLoading] = useState(false);
  const [groomKundaliPreview, setGroomKundaliPreview] = useState<string | null>(null);
  const [brideKundaliPreview, setBrideKundaliPreview] = useState<string | null>(null);

  const groomFileInputRef = useRef<HTMLInputElement>(null);
  const brideFileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split('T')[0];

  // API integration helper
  const submitToAPI = async (data: FormData, type: 'groom' | 'bride') => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('gender', data.gender);
    formData.append('dob', data.dob);
    formData.append('time', data.time);
    formData.append('location', data.location);
    formData.append('type', type);
    if (data.kundaliImage) {
      formData.append('kundaliImage', data.kundaliImage);
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('API submission error:', error);
      throw error;
    }
  };

  const handleFileUpload = (file: File, type: 'groom' | 'bride') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'groom') {
          setGroomKundaliPreview(result);
          setGroomData(prev => ({ ...prev, kundaliImage: file }));
        } else {
          setBrideKundaliPreview(result);
          setBrideData(prev => ({ ...prev, kundaliImage: file }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'groom' | 'bride') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file, type);
  };

  const handleSubmit = async (e: React.FormEvent, type: 'groom' | 'bride') => {
    e.preventDefault();
    
    const data = type === 'groom' ? groomData : brideData;
    const setLoading = type === 'groom' ? setGroomLoading : setBrideLoading;
    const customHandler = type === 'groom' ? onGroomSubmit : onBrideSubmit;

    setLoading(true);

    try {
      if (customHandler) {
        await customHandler(data);
      } else {
        await submitToAPI(data, type);
      }
      
      // Success feedback
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="vedic-astrology-container">
      <div className="vedic-header-container">
        <a href="https://www.famiory.com" className="vedic-logo">FAMIORY</a>
        <div className="vedic-tagline">Vedic Astrology Matching</div>
      </div>

      <header className="vedic-header">
        <h1>The Celestial Bond</h1>
        <h2>Vedic Astrology Compatibility Analysis for Marriage</h2>
      </header>

      <div className="vedic-container">
        {/* Groom's Section */}
        <div className="vedic-form-wrapper">
          <div className="vedic-kundali-display vedic-groom-kundali">
            <div className="vedic-placeholder">
              {groomKundaliPreview ? (
                <img src={groomKundaliPreview} alt="Groom's Kundali" />
              ) : (
                <>
                  <Mars size={48} />
                  <p>Groom's Kundali</p>
                  <p className="vedic-small">Will appear here</p>
                </>
              )}
            </div>
          </div>
          
          <div className="vedic-form-container">
            <h3>Groom's Details</h3>
            <form onSubmit={(e) => handleSubmit(e, 'groom')}>
              <div className="vedic-form-group">
                <label className="vedic-required">Full Name</label>
                <div className="vedic-input-icon">
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={groomData.name}
                    onChange={(e) => setGroomData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <User size={16} />
                </div>
              </div>

              <div className="vedic-gender-selector">
                <div className="vedic-gender-option">
                  <input
                    type="radio"
                    id="groom-male"
                    name="groom-gender"
                    value="male"
                    checked={groomData.gender === 'male'}
                    onChange={(e) => setGroomData(prev => ({ ...prev, gender: 'male' }))}
                  />
                  <label htmlFor="groom-male"><Mars size={16} /> Male</label>
                </div>
                <div className="vedic-gender-option">
                  <input
                    type="radio"
                    id="groom-female"
                    name="groom-gender"
                    value="female"
                    checked={groomData.gender === 'female'}
                    onChange={(e) => setGroomData(prev => ({ ...prev, gender: 'female' }))}
                  />
                  <label htmlFor="groom-female"><Venus size={16} /> Female</label>
                </div>
              </div>

              <div className="vedic-form-group">
                <label className="vedic-required">Date of Birth</label>
                <div className="vedic-input-icon">
                  <input
                    type="date"
                    max={today}
                    value={groomData.dob}
                    onChange={(e) => setGroomData(prev => ({ ...prev, dob: e.target.value }))}
                    required
                  />
                  <Calendar size={16} />
                </div>
              </div>

              <div className="vedic-form-group">
                <label className="vedic-required">Time of Birth</label>
                <div className="vedic-input-icon">
                  <input
                    type="time"
                    value={groomData.time}
                    onChange={(e) => setGroomData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                  <Clock size={16} />
                </div>
              </div>

              <div className="vedic-form-group">
                <label className="vedic-required">Birth Location</label>
                <div className="vedic-input-icon">
                  <input
                    type="text"
                    placeholder="Search city or town"
                    value={groomData.location}
                    onChange={(e) => setGroomData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                  <MapPin size={16} />
                </div>
              </div>

              <div className="vedic-form-group">
                <label>Kundali Image</label>
                <div
                  className="vedic-drag-drop"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'groom')}
                  onClick={() => groomFileInputRef.current?.click()}
                >
                  {groomData.kundaliImage ? (
                    <>
                      <CheckCircle size={40} />
                      <p>Kundali Uploaded</p>
                      <p className="vedic-small">{(groomData.kundaliImage.size / 1024).toFixed(1)} KB</p>
                    </>
                  ) : (
                    <>
                      <Upload size={40} />
                      <p>Drag & drop Kundali here</p>
                      <p className="vedic-small">or click to browse files</p>
                    </>
                  )}
                  <input
                    ref={groomFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'groom');
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" disabled={groomLoading}>
                {groomLoading ? (
                  <>
                    <div className="vedic-spinner" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Groom\'s Kundali'
                )}
              </button>

              <div className="vedic-form-footer">
                As per Vedic astrology principles
              </div>
            </form>
          </div>
        </div>

        {/* Bride's Section */}
        <div className="vedic-form-wrapper">
          <div className="vedic-kundali-display vedic-bride-kundali">
            <div className="vedic-placeholder">
              {brideKundaliPreview ? (
                <img src={brideKundaliPreview} alt="Bride's Kundali" />
              ) : (
                <>
                  <Venus size={48} />
                  <p>Bride's Kundali</p>
                  <p className="vedic-small">Will appear here</p>
                </>
              )}
            </div>
          </div>
          
          <div className="vedic-form-container">
            <h3>Bride's Details</h3>
            <form onSubmit={(e) => handleSubmit(e, 'bride')}>
              <div className="vedic-form-group">
                <label className="vedic-required">Full Name</label>
                <div className="vedic-input-icon">
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={brideData.name}
                    onChange={(e) => setBrideData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <User size={16} />
                </div>
              </div>

              <div className="vedic-gender-selector">
                <div className="vedic-gender-option">
                  <input
                    type="radio"
                    id="bride-male"
                    name="bride-gender"
                    value="male"
                    checked={brideData.gender === 'male'}
                    onChange={(e) => setBrideData(prev => ({ ...prev, gender: 'male' }))}
                  />
                  <label htmlFor="bride-male"><Mars size={16} /> Male</label>
                </div>
                <div className="vedic-gender-option">
                  <input
                    type="radio"
                    id="bride-female"
                    name="bride-gender"
                    value="female"
                    checked={brideData.gender === 'female'}
                    onChange={(e) => setBrideData(prev => ({ ...prev, gender: 'female' }))}
                  />
                  <label htmlFor="bride-female"><Venus size={16} /> Female</label>
                </div>
              </div>

              <div className="vedic-form-group">
                <label className="vedic-required">Date of Birth</label>
                <div className="vedic-input-icon">
                  <input
                    type="date"
                    max={today}
                    value={brideData.dob}
                    onChange={(e) => setBrideData(prev => ({ ...prev, dob: e.target.value }))}
                    required
                  />
                  <Calendar size={16} />
                </div>
              </div>

              <div className="vedic-form-group">
                <label className="vedic-required">Time of Birth</label>
                <div className="vedic-input-icon">
                  <input
                    type="time"
                    value={brideData.time}
                    onChange={(e) => setBrideData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                  <Clock size={16} />
                </div>
              </div>

              <div className="vedic-form-group">
                <label className="vedic-required">Birth Location</label>
                <div className="vedic-input-icon">
                  <input
                    type="text"
                    placeholder="Search city or town"
                    value={brideData.location}
                    onChange={(e) => setBrideData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                  <MapPin size={16} />
                </div>
              </div>

              <div className="vedic-form-group">
                <label>Kundali Image</label>
                <div
                  className="vedic-drag-drop"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'bride')}
                  onClick={() => brideFileInputRef.current?.click()}
                >
                  {brideData.kundaliImage ? (
                    <>
                      <CheckCircle size={40} />
                      <p>Kundali Uploaded</p>
                      <p className="vedic-small">{(brideData.kundaliImage.size / 1024).toFixed(1)} KB</p>
                    </>
                  ) : (
                    <>
                      <Upload size={40} />
                      <p>Drag & drop Kundali here</p>
                      <p className="vedic-small">or click to browse files</p>
                    </>
                  )}
                  <input
                    ref={brideFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'bride');
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" disabled={brideLoading}>
                {brideLoading ? (
                  <>
                    <div className="vedic-spinner" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Bride\'s Kundali'
                )}
              </button>

              <div className="vedic-form-footer">
                Based on ancient astrological texts
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vedic-astrology-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: url('https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
          padding: 20px;
          position: relative;
        }

        .vedic-astrology-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 0;
        }

        .vedic-header-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          position: relative;
          z-index: 1;
        }

        .vedic-logo {
          font-family: 'Georgia', serif;
          font-size: 2.5rem;
          color: #D4AF37;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .vedic-logo:hover {
          color: #F4E5C2;
          text-shadow: 0 0 10px #D4AF37;
        }

        .vedic-tagline {
          color: #F4E5C2;
          font-size: 1rem;
          font-weight: 500;
        }

        .vedic-header {
          text-align: center;
          margin: 20px 0 40px;
          position: relative;
          z-index: 1;
        }

        .vedic-header::after {
          content: '';
          display: block;
          width: 150px;
          height: 4px;
          background: linear-gradient(to right, #D4AF37, #E8A5A5);
          margin: 20px auto;
          border-radius: 2px;
        }

        .vedic-header h1 {
          font-family: 'Georgia', serif;
          font-size: 3rem;
          color: #D4AF37;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          font-weight: 700;
        }

        .vedic-header h2 {
          font-size: 1.5rem;
          color: #F4E5C2;
          font-weight: 400;
          margin-bottom: 10px;
        }

        .vedic-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .vedic-form-wrapper {
          position: relative;
          width: 100%;
          max-width: 500px;
        }

        .vedic-kundali-display {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 250px;
          height: 250px;
          border: 12px solid #F4E5C2;
          border-radius: 50%;
          background: radial-gradient(circle, #F4E5C2 60%, #D4AF37 100%);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 2;
        }

        .vedic-groom-kundali {
          left: -270px;
        }

        .vedic-bride-kundali {
          right: -270px;
        }

        .vedic-placeholder {
          text-align: center;
          padding: 20px;
          color: #996515;
        }

        .vedic-placeholder p {
          font-size: 1rem;
          font-weight: 500;
          margin: 10px 0 5px;
        }

        .vedic-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 15px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .vedic-small {
          font-size: 0.8rem !important;
          color: #996515 !important;
        }

        .vedic-form-container {
          background: #F4E5C2;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          width: 100%;
          position: relative;
          z-index: 1;
          border: 1px solid #D4AF37;
        }

        .vedic-form-container h3 {
          font-family: 'Georgia', serif;
          font-size: 1.8rem;
          color: #D4AF37;
          margin-bottom: 25px;
          position: relative;
          display: inline-block;
          font-weight: 700;
        }

        .vedic-form-container h3::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, #D4AF37, #E8A5A5);
          border-radius: 3px;
        }

        .vedic-form-group {
          margin-bottom: 20px;
          position: relative;
        }

        .vedic-form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
          font-size: 0.95rem;
        }

        .vedic-required::after {
          content: '*';
          color: #E8A5A5;
          margin-left: 4px;
        }

        .vedic-input-icon {
          position: relative;
        }

        .vedic-input-icon input {
          width: 100%;
          padding: 14px 40px 14px 15px;
          border: 1px solid #D4AF37;
          border-radius: 15px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background-color: rgba(255, 255, 255, 0.8);
        }

        .vedic-input-icon input:focus {
          outline: none;
          border-color: #996515;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
          background-color: white;
        }

        .vedic-input-icon svg {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #996515;
        }

        .vedic-gender-selector {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .vedic-gender-option {
          flex: 1;
          text-align: center;
        }

        .vedic-gender-option input {
          display: none;
        }

        .vedic-gender-option label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 2px solid #D4AF37;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: rgba(255, 255, 255, 0.5);
        }

        .vedic-gender-option input:checked + label {
          border-color: #996515;
          background-color: rgba(212, 175, 55, 0.1);
          font-weight: 600;
          color: #996515;
        }

        .vedic-drag-drop {
          border: 2px dashed #D4AF37;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          color: #996515;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          background-color: rgba(255, 255, 255, 0.5);
        }

        .vedic-drag-drop:hover {
          border-color: #996515;
          background-color: rgba(255, 255, 255, 0.7);
        }

        .vedic-drag-drop p {
          margin: 10px 0;
          font-weight: 500;
        }

        .vedic-form-container button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(to right, #996515, #D4AF37);
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .vedic-form-container button:hover:not(:disabled) {
          background: linear-gradient(to right, #D4AF37, #996515);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        .vedic-form-container button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .vedic-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .vedic-form-footer {
          text-align: center;
          margin-top: 30px;
          font-size: 0.85rem;
          color: #996515;
        }

        @media (max-width: 1300px) {
          .vedic-kundali-display {
            width: 220px;
            height: 220px;
          }
          
          .vedic-groom-kundali {
            left: -240px;
          }
          
          .vedic-bride-kundali {
            right: -240px;
          }
        }

        @media (max-width: 1200px) {
          .vedic-kundali-display {
            width: 200px;
            height: 200px;
          }
          
          .vedic-groom-kundali {
            left: -220px;
          }
          
          .vedic-bride-kundali {
            right: -220px;
          }
        }

        @media (max-width: 1100px) {
          .vedic-container {
            gap: 80px;
          }
          
          .vedic-kundali-display {
            position: static;
            transform: none;
            margin: 0 auto 30px;
            width: 220px;
            height: 220px;
          }
          
          .vedic-form-wrapper {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .vedic-header h1 {
            font-size: 2.2rem;
          }

          .vedic-header h2 {
            font-size: 1.2rem;
          }

          .vedic-form-container {
            padding: 25px;
          }
          
          .vedic-logo {
            font-size: 2rem;
          }
          
          .vedic-kundali-display {
            width: 180px;
            height: 180px;
          }
        }

        @media (max-width: 576px) {
          .vedic-astrology-container {
            padding: 15px;
          }
          
          .vedic-header-container {
            flex-direction: column;
            gap: 10px;
          }
          
          .vedic-gender-selector {
            flex-direction: column;
          }
          
          .vedic-kundali-display {
            width: 160px;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default VedicAstrologyForm;