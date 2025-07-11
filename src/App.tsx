import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage.tsx';
import Index from "./pages/Index";
import CreateEvent from "./pages/CreateEvent";
import WeddingEvent from "./pages/WeddingEvent";
import NotFound from "./pages/NotFound";
import AppPreWeddingPage from './Pre-wedding/AppPreWedding.tsx';
import Before from './Before/AppBefore.tsx';
import Celestial from './Celestial/AppCelestial.tsx';
import Family from './Family-Tree/AppFamily.tsx';
import Blessing from './Blessing/AppBlessing.tsx';
import { BlessingInvite } from './Blessing/components/BlessingInvite/BlessingInvite';
import FirsttoCherish from './Blessing/components/Firsttocherish/AppFirst.tsx';
import Forever from './Forever/AppForever.tsx';
import Planning from './Planning/AppPlanning.tsx';
import WeddingDatesPage from './Planning/wedding-dates/pages/WeddingDatesPage';
import { ServiceDashboard } from './Planning/finalized-service/components/ServiceDashboard';
import { WeddingTaskDelegation } from './Planning/person-responsibility/components/WeddingTaskDelegation';
import BudgetManagementPage from './Planning/budget-management/pages/BudgetManagementPage';
import Digital from './Digital/AppDigital.tsx';
import Guest from './Guest/AppGuest.tsx';
import PhotographerPortfolio from "./Photographer/AppPhotographer.tsx";
import JewelryPortfolio from "./Jewellery/AppJewellery.tsx";
import Makeup from './Makeup/AppMakeup.tsx';
import Venue from './Venue/AppVenue.tsx';
import EventPlanner from './EventPlanner/AppEventPlanner.tsx';
import EventAnchor from './EventAnchor/AppEventAnchor.tsx';
import GoldMehendi from './GoldMehendi/AppGold.tsx';
import Grand from './Grand/AppGrand.tsx';
import BlessingFarewell from './BlessingandFarewell/AppBlessingFarewell.tsx';
import Mandap from './Mandap/AppMandap.tsx';
import Sacred from './Sacred/AppSacred.tsx';
import Unwrap from './Unwrap/AppUnwrap.tsx';
import Reception from './Reception/AppReception.tsx';
import Escape from './Escape/AppEscape.tsx';
import Gratitude from './Gratitude/AppGratitude.tsx';

import HomePage from './Dressing/pages/HomePage';
import VendorPage from './Dressing/pages/VendorPage';
import { StoreProvider } from './Dressing/context/StoreContext';
import './Dressing/styles/globals.css';



const queryClient = new QueryClient();

const App = () => {
  // 3. Add state to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 4. Create the function to update the state
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // 5. Check the login status
  if (!isLoggedIn) {
    // If NOT logged in, return ONLY the LoginPage component
    return <LoginPage onLogin={handleLogin} />;
  }

  // If LOGGED IN, return your entire application with all its providers and routes
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/create-event/wedding" element={<WeddingEvent />} />
          <Route path="/create-event/pre-wedding" element={<AppPreWeddingPage />} />
          <Route path="/pre-wedding/before" element={<Before/>} />
          <Route path="/pre-wedding/celestial" element={<Celestial/>} />
          <Route path="/pre-wedding/family" element={<Family/>} />
          <Route path="/pre-wedding/blessing" element={<Blessing/>} />
          <Route path="/blessing-invite" element={<BlessingInvite/>} />
          <Route path="/chapter/first-cherish" element={<FirsttoCherish/>} />
          <Route path="/chapter/yes-forever" element={<Forever/>} />
          <Route path="/chapter/big-day" element={<Planning/>} />
          <Route path="/wedding-dates" element={<WeddingDatesPage />} />
          <Route path="/finalized-services" element={<ServiceDashboard />} />
          <Route path="/person-responsibility" element={<WeddingTaskDelegation />} />
          <Route path="/budget-management" element={<BudgetManagementPage />} />
          <Route path="/pre-wedding/dressing" element={<HomePage />} />
          <Route path="/vendor/:vendorId" element={<VendorPage />} />
          <Route path="/planning/digital" element={<Digital />} />
          <Route path="/planning/guest" element={<Guest />} />
          <Route path="/planning/photographers" element={<PhotographerPortfolio />} />
          <Route path="/planning/jewellery" element={<JewelryPortfolio />} />
          <Route path="/planning/makeup" element={<Makeup />} />
          <Route path="/planning/venue" element={<Venue />} />
          <Route path="/planning/eventplanner" element={<EventPlanner />} />
          <Route path="/planning/eventanchor" element={<EventAnchor />} />
          <Route path="/marriage/goldandmehendi" element={<GoldMehendi />} />
          <Route path="/marriage/grandarrival" element={<Grand />} />
          <Route path="/marriage/blessingfarewell" element={<BlessingFarewell />} />
          <Route path="/marriage/mandap" element={<Mandap />} />
          <Route path="/marriage/sacred" element={<Sacred />} />
          <Route path="/marriage/saree" element={<Reception />} />
          <Route path="/marriage/joy" element={<Unwrap />} />
          <Route path="/marriage/escape" element={<Escape />} />
          <Route path="/marriage/gratitude" element={<Gratitude />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
