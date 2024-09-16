import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPills, FaPlus, FaSun, FaCloud, FaMoon, FaRobot, FaTimes, FaCheck, FaBan } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getMedications, Medication, updateMedication } from '../services/medicationService';
import { motion, AnimatePresence } from 'framer-motion';
import ReminderModal from '../components/ReminderModal';
import AIChat from '../components/AIChat';
import { IconType } from 'react-icons';
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

const IconWrapper = ({ Icon, className }: { Icon: React.ElementType; className: string }) => (
  <div className={className}>
    <Icon />
  </div>
);

const HomePage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminder, setReminder] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const { user } = useAuth();
  const timeSlots = [
    { name: 'Morning', icon: FaSun },
    { name: 'Afternoon', icon: FaCloud },
    { name: 'Night', icon: FaMoon }
  ];
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        setError("Failed to fetch medications. Please try again later.");
        toast.error("Failed to fetch medications");
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      const currentTime = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
      console.log("Current time:", currentTime);

      medications.forEach((med) => {
        console.log("Checking medication:", med.medicationName, "at", med.frequency);
        if (med.frequency === currentTime) {
          console.log("Reminder set for medication:", med.medicationName);
          setReminder(`Time to take your medication: ${med.medicationName}`);
        }
      });
    };

    const interval = setInterval(checkReminder, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [medications]);

  const handleMedicationAction = async (id: string, action: 'take' | 'skip') => {
    if (user) {
      try {
        await updateMedication(id, { status: action });
        toast.success(`Medication ${action === 'take' ? 'taken' : 'skipped'}`);
      } catch (error) {
        console.error("Error updating medication status:", error);
        toast.error("Failed to update medication status");
      }
    }
  };

  const renderEmptyState = (slot: string, Icon: React.ElementType) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-700 p-6 rounded-lg text-center shadow-md flex flex-col items-center"
    >
      <IconWrapper Icon={Icon} className="text-gray-400 text-4xl mb-3" />
      <p className="text-gray-300 font-medium">No medications for {slot}</p>
      <p className="text-gray-400 text-sm mt-2">Enjoy your {slot.toLowerCase()}!</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 text-white border-4 border-primary rounded-lg relative"
    >
      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          {error}
        </div>
      )}
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Welcome, {user?.displayName || 'User'}!</h1>
      <p className="text-gray-300 mb-6 text-center">Here are your medications for today:</p>
      
      <ReminderModal
        isOpen={!!reminder}
        onRequestClose={() => setReminder(null)}
        message={reminder || ''}
      />

      {timeSlots.map((slot) => {
        const slotMedications = medications.filter(med => med.time.toLowerCase() === slot.name.toLowerCase());

        return (
          <motion.div
            key={slot.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <IconWrapper Icon={slot.icon} className="text-primary text-2xl mr-2" />
              <h2 className="text-2xl font-semibold text-primary">{slot.name}</h2>
            </div>
            {slotMedications.length > 0 ? (
              <ul className="space-y-4">
                {slotMedications.map((med) => (
                  <motion.li
                    key={med.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-gray-700 p-4 rounded-lg border border-gray-600 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 ${
                      med.status ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {med.imageUrl ? (
                        <img 
                          src={med.imageUrl} 
                          alt={med.medicationName} 
                          className="w-12 h-12 object-cover rounded-full mr-4"
                          onError={(e) => {
                            console.error(`Failed to load image for medication: ${med.medicationName}`);
                            e.currentTarget.onerror = null; // prevents looping
                            e.currentTarget.src = '/path/to/fallback/image.png'; // replace with a fallback image
                          }}
                        />
                      ) : (
                        <IconWrapper Icon={FaPills} className="text-primary text-3xl mr-4" />
                      )}
                      <div>
                        <h3 className="font-medium text-lg text-gray-200">{med.medicationName}</h3>
                        <p className="text-sm text-gray-400">{med.instruction}</p>
                        {med.status && (
                          <p className={`text-xs mt-1 ${
                            med.status === 'take' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {med.status === 'take' ? 'Taken' : 'Skipped'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">Dosage: {med.dosage}</p>
                      <p className="text-xs text-green-400 mt-1">Time for pill: {med.frequency}</p>
                      {!med.status && (
                        <div className="mt-2 space-x-2 flex justify-end">
                          <button
                            onClick={() => handleMedicationAction(med.id!, 'take')}
                            className="bg-green-500 text-white px-2 py-1 rounded-md text-xs inline-flex items-center"
                          >
                            <IconWrapper Icon={FaCheck} className="w-3 h-3 mr-1" />
                            <span>Take</span>
                          </button>
                          <button
                            onClick={() => handleMedicationAction(med.id!, 'skip')}
                            className="bg-red-500 text-white px-2 py-1 rounded-md text-xs inline-flex items-center"
                          >
                            <IconWrapper Icon={FaBan} className="w-3 h-3 mr-1" />
                            <span>Skip</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : renderEmptyState(slot.name, slot.icon)}
          </motion.div>
        );
      })}

      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
              <button
                onClick={() => setShowAIChat(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <IconWrapper Icon={FaTimes} className="w-6 h-6" />
              </button>
              <AIChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-4 right-4 flex flex-col space-y-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-primary text-white rounded-full p-4 flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors duration-300"
          onClick={() => navigate('/chatbot')}
        >
          <FaRobot className="text-xl" />
        </motion.button>
        <Link to="/add-medication">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-primary text-white rounded-full p-4 flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors duration-300"
          >
            <FaPlus className="text-xl" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;