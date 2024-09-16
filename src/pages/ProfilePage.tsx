import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const IconWrapper = ({ Icon, className }: { Icon: React.ElementType; className: string }) => (
  <div className={className}>
    <Icon />
  </div>
);

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const initial = getInitial(user.displayName || 'User');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-8 rounded-lg shadow-2xl border-t-4 border-primary"
    >
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-4xl font-bold shadow-lg"
        >
          {initial}
        </motion.div>
        <h1 className="text-3xl font-bold text-white mt-4 mb-1">{user.displayName || 'User'}</h1>
        <p className="text-gray-400 text-sm">Member since {new Date(user.metadata.creationTime || '').getFullYear()}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
          <div className="flex items-center text-gray-300 mb-2">
            <IconWrapper Icon={FaUser} className="mr-2" />
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </div>
          <p className="text-white">{user.displayName || 'Not provided'}</p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
          <div className="flex items-center text-gray-300 mb-2">
            <IconWrapper Icon={FaEnvelope} className="mr-2" />
            <h2 className="text-lg font-semibold">Email</h2>
          </div>
          <p className="text-white">{user.email}</p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
          <div className="flex items-center text-gray-300 mb-2">
            <IconWrapper Icon={FaCalendarAlt} className="mr-2" />
            <h2 className="text-lg font-semibold">Account Created</h2>
          </div>
          <p className="text-white">{new Date(user.metadata.creationTime || '').toLocaleDateString()}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;