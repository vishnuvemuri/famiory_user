import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BellRing as Ring, Users, PartyPopper } from 'lucide-react';
import { useLoveJourney } from '../contexts/LoveJourneyContext';

const navigationItems = [
  { id: 'proposal', label: 'Proposal Story', icon: Heart },
  { id: 'engagement', label: 'Engagement', icon: Ring },
  { id: 'family', label: 'Family Celebration', icon: Users },
  { id: 'party', label: 'Engagement Party', icon: PartyPopper },
];

const NavigationHeader: React.FC = () => {
  const { state, setActiveTab } = useLoveJourney();

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="navigation-header"
    >
      <nav className="nav-container">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`nav-button ${state.activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.header>
  );
};

export default NavigationHeader;