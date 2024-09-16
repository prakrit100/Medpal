import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaPills, FaPlusCircle, FaUser, FaSignOutAlt, FaChartBar, FaRobot } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Pill, Users, Star, Trophy, TrendingUp } from 'lucide-react';
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Medication } from '../../services/medicationService';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [nextPill, setNextPill] = useState<{ name: string; time: string } | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActiveRoute = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/landing');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const initial = user ? getInitial(user.displayName || 'User') : '';

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const adherenceRate = 91;
  const streak = 7;
  const level = 3;

  useEffect(() => {
    if (user) {
      const medicationsRef = collection(db, 'medications');
      const q = query(medicationsRef, where("userId", "==", user.uid));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const meds: Medication[] = [];
        querySnapshot.forEach((doc) => {
          meds.push({ id: doc.id, ...doc.data() } as Medication);
        });
        setMedications(meds);
      }, (error) => {
        console.error("Error fetching medications:", error);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const calculateNextPill = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      let nextPillTime = Infinity;
      let nextPillName = '';

      medications.forEach((med) => {
        const [hours, minutes] = med.frequency.split(':').map(Number);
        const medicationTime = hours * 60 + minutes;

        if (medicationTime > currentTime && medicationTime < nextPillTime) {
          nextPillTime = medicationTime;
          nextPillName = med.medicationName;
        }
      });

      if (nextPillName) {
        const hours = Math.floor(nextPillTime / 60);
        const minutes = nextPillTime % 60;
        setNextPill({
          name: nextPillName,
          time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        });
      } else {
        setNextPill(null);
      }
    };

    calculateNextPill();
  }, [medications]);

  return (
    <nav className="bg-secondary text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-2xl font-bold text-primary">MedPal</Link>
          </div>
          {user && (
            <div className="relative">
              <button
                onClick={toggleModal}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold"
              >
                {initial}
              </button>

              <AnimatePresence>
                {isModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-gray-800 rounded-lg p-6 w-full max-w-sm relative"
                    >
                      <button 
                        onClick={toggleModal} 
                        className="absolute top-2 right-2 text-gray-400 hover:text-primary"
                      >
                        <X size={24} />
                      </button>

                      <div className="mb-6">
                        <div className="flex items-center space-x-2 text-white mb-2">
                          <User size={24} className="text-primary" />
                          <span className="font-semibold text-xl text-white">{user.displayName || 'User'}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold text-white">Adherence Score</span>
                          <div className="flex items-center">
                            <Star className="text-yellow-500 mr-1" size={20} />
                            <span className="text-2xl font-bold text-yellow-500">{adherenceRate}</span>
                          </div>
                        </div>
                        <div className="bg-gray-700 h-4 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-yellow-500 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${adherenceRate}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                          <Trophy className="text-primary mx-auto mb-2" size={24} />
                          <span className="text-white font-semibold block">Level {level}</span>
                          <span className="text-sm text-gray-400">Medication Master</span>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                          <TrendingUp className="text-green-500 mx-auto mb-2" size={24} />
                          <span className="text-white font-semibold block">{streak} Day Streak</span>
                          <span className="text-sm text-gray-400">Keep it up!</span>
                        </div>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-lg mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Pill className="text-primary" size={24} />
                            <span className="text-white font-semibold">Next Pill</span>
                          </div>
                          {nextPill ? (
                            <div className="text-right">
                              <span className="text-primary font-bold">{nextPill.name}</span>
                              <span className="text-gray-400 block text-sm">at {nextPill.time}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">No upcoming pills</span>
                          )}
                        </div>
                      </div>

                      <button className="w-full bg-gray-700 p-4 rounded-lg flex items-center justify-between hover:bg-gray-600 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Users className="text-primary" size={24} />
                          <span className="text-white font-semibold">Community</span>
                        </div>
                        <span className="text-gray-400">Join</span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <div className={`fixed inset-y-0 left-0 max-w-xs w-full bg-secondary transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="h-16 flex items-center justify-between px-4">
          <span className="text-xl font-semibold text-primary">Menu</span>
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {user ? (
            <>
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveRoute('/') ? 'text-primary bg-secondary-light' : 'text-white hover:text-primary hover:bg-secondary-light'
                }`}
                onClick={closeMenu}
              >
                <FaHome className="mr-3" />
                Home
              </Link>
              <Link
                to="/medications"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveRoute('/medications') ? 'text-primary bg-secondary-light' : 'text-white hover:text-primary hover:bg-secondary-light'
                }`}
                onClick={closeMenu}
              >
                <FaPills className="mr-3" />
                Medications
              </Link>
              <Link
                to="/add-medication"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveRoute('/add-medication') ? 'text-primary bg-secondary-light' : 'text-white hover:text-primary hover:bg-secondary-light'
                }`}
                onClick={closeMenu}
              >
                <FaPlusCircle className="mr-3" />
                Add Medication
              </Link>
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveRoute('/profile') ? 'text-primary bg-secondary-light' : 'text-white hover:text-primary hover:bg-secondary-light'
                }`}
                onClick={closeMenu}
              >
                <FaUser className="mr-3" />
                Profile
              </Link>
              <Link
                to="/report"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveRoute('/report') ? 'text-primary bg-secondary-light' : 'text-white hover:text-primary hover:bg-secondary-light'
                }`}
                onClick={closeMenu}
              >
                <FaChartBar className="mr-3" />
                Report
              </Link>
              <Link
                to="/chatbot"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveRoute('/chatbot') ? 'text-primary bg-secondary-light' : 'text-white hover:text-primary hover:bg-secondary-light'
                }`}
                onClick={closeMenu}
              >
                <FaRobot className="mr-3" />
                Chatbot
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-secondary-light transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-3" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/landing"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveRoute('/landing') ? 'text-primary bg-secondary-light' : 'text-white hover:text-primary hover:bg-secondary-light'
                }`}
                onClick={closeMenu}
              >
                <FaUser className="mr-3" />
                Sign In / Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;