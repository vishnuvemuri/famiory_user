import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HeroSection from '../components/vendor/HeroSection';
import AboutSection from '../components/vendor/AboutSection';
import CollectionsSection from '../components/vendor/CollectionsSection';
import NewArrivalsSection from '../components/vendor/NewArrivalsSection';
import Footer from '../components/vendor/Footer';
import { VendorData } from '../types/vendor';
import { fetchVendorData } from '../services/api';

const VendorPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendorData = async () => {
      if (!vendorId) return;
      
      try {
        setLoading(true);
        // Single line API integration - replace with your actual API call
        const data = await fetchVendorData(vendorId);
        setVendorData(data);
      } catch (error) {
        console.error('Error loading vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVendorData();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
          <p className="mt-4 text-gold-dark">Loading...</p>
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gold-dark mb-4">Vendor not found</h2>
          <Link to="/" className="text-gold hover:text-gold-dark">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-page">
      <HeroSection 
        vendorName={vendorData.name}
        heroImages={vendorData.heroImages}
        tagline={vendorData.tagline}
      />
      
      <main className="container mx-auto px-5">
        <AboutSection 
          logo={vendorData.logo}
          description={vendorData.description}
        />
        
        <CollectionsSection collections={vendorData.collections} />
        
        <NewArrivalsSection newArrivals={vendorData.newArrivals} />
      </main>
      
      <Footer 
        vendorName={vendorData.name}
        website={vendorData.website}
        contact={vendorData.contact}
        locations={vendorData.locations}
        message={vendorData.message}
      />
    </div>
  );
};

export default VendorPage;