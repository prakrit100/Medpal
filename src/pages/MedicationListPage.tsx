import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getMedications, deleteMedication, Medication } from '../services/medicationService';
import { motion } from 'framer-motion';

interface PopupMessage {
  text: string;
  type: 'add' | 'update' | 'delete';
}

const IconWrapper = ({ Icon, className }: { Icon: React.ElementType; className: string }) => (
  <div className={className}>
    <Icon />
  </div>
);

const MedicationListPage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [popupMessage, setPopupMessage] = useState<PopupMessage | null>(null);
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const fetchMedications = async () => {
        const meds = await getMedications(user.uid);
        setMedications(meds);
      };
      fetchMedications();
    }
  }, [user]);

  useEffect(() => {
    if (location.state && 'message' in location.state && 'type' in location.state) {
      setPopupMessage({
        text: location.state.message as string,
        type: location.state.type as 'add' | 'update' | 'delete'
      });
      setTimeout(() => {
        setPopupMessage(null);
      }, 3000);
    }
  }, [location.state]);

  const handleEdit = (id: string) => {
    navigate(`/add-medication/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedication(id);
      setMedications(medications.filter(med => med.id !== id));
      setPopupMessage({
        text: 'Medication deleted successfully!',
        type: 'delete'
      });
      setTimeout(() => {
        setPopupMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  };

  const getPopupColor = (type: 'add' | 'update' | 'delete') => {
    switch (type) {
      case 'add':
        return 'bg-green-500';
      case 'update':
        return 'bg-yellow-500';
      case 'delete':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 relative"
    >
      {popupMessage && (
        <div className={`fixed top-16 left-0 right-0 ${getPopupColor(popupMessage.type)} text-white px-4 py-2 text-center z-50`}>
          {popupMessage.text}
        </div>
      )}
      <div className="bg-gray-800 p-6 text-white border-4 border-primary rounded-lg">
        <h1 className="text-2xl font-extrabold text-primary mb-6 text-center">Your Medications</h1>
        <motion.ul 
          className="space-y-4 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {medications.map((med) => (
            <motion.li 
              key={med.id}
              variants={itemVariants}
              className={`
                bg-gray-700 p-4 rounded-md border border-gray-600 
                flex justify-between items-center transition-all duration-300 ease-in-out 
                transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30 
                cursor-pointer relative overflow-hidden
                ${expandedMedication === med.id ? 'ring-2 ring-primary' : ''}
              `}
              onClick={() => setExpandedMedication(expandedMedication === med.id ? null : med.id || null)}
            >
              <div className="flex-grow z-10">
                <h2 className="text-lg font-semibold text-gray-200 group-hover:text-primary transition-colors duration-300">
                  {med.medicationName}
                </h2>
                <p className="text-sm text-gray-400">Dosage: {med.dosage}</p>
                <p className="text-xs text-green-400 mt-1">Time for pill: {med.frequency}</p>
                {expandedMedication === med.id && (
                  <div className="mt-2 text-sm text-gray-300">
                    <p>Type: {med.type}</p>
                    <p>Interval: {med.interval}</p>
                    <p>Instruction: {med.instruction}</p>
                    <p>Start Date: {med.startDate}</p>
                    <p>End Date: {med.endDate}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(med.id!);
                  }}
                  className="p-2 text-blue-300 hover:text-blue-400 transition-colors duration-200 bg-gray-800 rounded-full hover:bg-gray-900"
                >
                  <IconWrapper Icon={FaEdit} className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(med.id!);
                  }}
                  className="p-2 text-red-300 hover:text-red-400 transition-colors duration-200 bg-gray-800 rounded-full hover:bg-gray-900"
                >
                  <IconWrapper Icon={FaTrash} className="w-4 h-4" />
                </button>
                {expandedMedication !== med.id && (
                  <button className="p-2 text-yellow-300 hover:text-yellow-400 transition-colors duration-200 bg-gray-800 rounded-full hover:bg-gray-900">
                    <IconWrapper Icon={FaInfoCircle} className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default MedicationListPage;