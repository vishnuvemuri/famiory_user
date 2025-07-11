import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WeddingEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Ram',
    partnerName: 'Sita',
    weddingDate: '09/10/2025',
    noDateSelected: false,
    location: 'New Delhi, IN'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Wedding form data:', formData);
    navigate('/create-event/pre-wedding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF1F0] px-4 py-10">
      <div className="flex w-full max-w-6xl rounded-xl overflow-hidden bg-white shadow-lg">
        {/* Left Image Section */}
        <div className="w-1/2 relative bg-pink-200 p-6">
          <div
            className="absolute inset-10 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url('/uploads/wed2.jpeg')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
            <div className="relative h-full flex flex-col justify-center items-start text-white px-8 py-12 space-y-4 text-2xl font-semibold leading-tight">
              <p>Together,</p>
              <p>we walk the path of righteousness.</p>
              <p>Together,</p>
              <p>we create strength.</p>
              <p>Together,</p>
              <p>we share responsibilities as partners and equals.</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-1/2 p-8 bg-white flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-purple-800 mb-2">Famiory</h1>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Let’s get ready to transform memories into everlasting tales.
            </h2>
            <p className="text-gray-600 text-sm">We’ll need a few details first.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Your First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ram"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Partner's First Name
              </label>
              <input
                type="text"
                id="partnerName"
                name="partnerName"
                value={formData.partnerName}
                onChange={handleInputChange}
                placeholder="Sita"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-1">
                Wedding Date
              </label>
              <input
                type="text"
                id="weddingDate"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleInputChange}
                placeholder="09/10/2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="noDateSelected"
                name="noDateSelected"
                checked={formData.noDateSelected}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="noDateSelected" className="ml-2 text-sm text-gray-700">
                We haven't picked a date (yet)
              </label>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New Delhi, IN"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-700 transition duration-200"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WeddingEvent;