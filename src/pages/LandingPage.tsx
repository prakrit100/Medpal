import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPills, FaEnvelope, FaLock, FaUser, FaBrain, FaChartBar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { IconType } from 'react-icons';

const IconWrapper = ({ Icon, className }: { Icon: IconType; className: string }) => (
  <div className={className}>
    <Icon />
  </div>
);

const LandingPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return;
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (error) {
      setError(isSignUp ? 'Failed to create an account' : 'Failed to sign in');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const iconVariants = {
    rotate: { rotate: 360 },
    stop: { rotate: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 relative overflow-hidden">
      <div className="absolute inset-0 border-4 border-primary rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.5)] pointer-events-none"></div>

      <motion.div 
        className="absolute top-10 left-5 w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-10 right-5 w-24 h-24 md:w-32 md:h-32 bg-primary-dark rounded-full opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto pt-8 flex flex-col items-center justify-between">
        <motion.div 
          className="w-full mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-2 text-primary text-center">
            MedPal
          </h1>
          <p className="text-sm text-primary italic mb-6 text-center">
            &#8220;Your personal medication assistant&#8221;
          </p>
          <ul className="space-y-4 text-center">
            <li className="flex items-center justify-center text-base">
              <IconWrapper Icon={FaPills} className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <span>Smart reminders</span>
            </li>
            <li className="flex items-center justify-center text-base">
              <IconWrapper Icon={FaBrain} className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <span>AI-driven insights</span>
            </li>
            <li className="flex items-center justify-center text-base">
              <IconWrapper Icon={FaChartBar} className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <span>Progress tracking</span>
            </li>
          </ul>
        </motion.div>

        <motion.div 
          className="w-full"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gray-800 border-gray-700 shadow-lg rounded-lg p-6">
            <div className="flex justify-center items-center mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'signup' : 'signin'}
                  initial="stop"
                  animate="rotate"
                  exit="stop"
                  variants={iconVariants}
                  transition={{ duration: 0.5 }}
                  className="text-primary text-5xl mr-2"
                >
                  <FaPills />
                </motion.div>
              </AnimatePresence>
              <h2 className="text-2xl text-primary">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-center bg-red-100 py-2 rounded">{error}</p>}
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-base">Name</label>
                  <div className="relative">
                    <IconWrapper Icon={FaUser} className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-base">Email</label>
                <div className="relative">
                  <IconWrapper Icon={FaEnvelope} className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-base">Password</label>
                <div className="relative">
                  <IconWrapper Icon={FaLock} className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {isSignUp && password.length > 0 && password.length < 6 && (
                  <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters long.</p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white text-base py-2 px-4 rounded-md transition duration-200 ease-in-out"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </motion.button>
            </form>
            <p className="text-center mt-4 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button 
                className="text-primary hover:text-primary-dark ml-1 text-sm"
                onClick={toggleSignUp}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;