import React from 'react';
import Header from '../components/home/Header';
import FilterSection from '../components/home/FilterSection';
import FeaturedStore from '../components/home/FeaturedStore';
import StoreGrid from '../components/home/StoreGrid';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-5">
        <FilterSection />
        <FeaturedStore />
        <StoreGrid />
      </main>
    </>
  );
};

export default HomePage;