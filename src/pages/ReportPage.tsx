import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPills, FaCalendarAlt, FaChartPie, FaChartLine, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [selectedChart, setSelectedChart] = useState('bar');

  const weeklyData = [
    { name: 'Mon', taken: 3, skipped: 1 },
    { name: 'Tue', taken: 4, skipped: 0 },
    { name: 'Wed', taken: 2, skipped: 2 },
    { name: 'Thu', taken: 3, skipped: 1 },
    { name: 'Fri', taken: 4, skipped: 0 },
    { name: 'Sat', taken: 3, skipped: 1 },
    { name: 'Sun', taken: 2, skipped: 2 },
  ];

  const monthlyData = [
    { name: 'Week 1', taken: 20, skipped: 8 },
    { name: 'Week 2', taken: 24, skipped: 4 },
    { name: 'Week 3', taken: 18, skipped: 10 },
    { name: 'Week 4', taken: 22, skipped: 6 },
  ];

  const overallData = [
    { name: 'Taken', value: 84 },
    { name: 'Skipped', value: 28 },
  ];

  const COLORS = ['#FF6B00', '#f44336'];

  const renderActiveChart = () => {
    const data = activeTab === 'weekly' ? weeklyData : monthlyData;

    switch (selectedChart) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="taken" name="Pills Taken" fill="#FF6B00" />
              <Bar dataKey="skipped" name="Pills Skipped" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="taken" name="Pills Taken" stroke="#FF6B00" />
              <Line type="monotone" dataKey="skipped" name="Pills Skipped" stroke="#f44336" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overallData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {overallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white min-h-screen p-4 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Your Medication Report</h1>
        
        <motion.div 
          className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Glowing border */}
          <div className="absolute inset-0 border-4 border-primary rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.5)] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-primary">Medication Adherence</h2>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${activeTab === 'weekly' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setActiveTab('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${activeTab === 'monthly' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setActiveTab('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="mb-4 flex justify-center space-x-4">
              <button
                className={`p-2 rounded-full ${selectedChart === 'bar' ? 'bg-primary' : 'bg-gray-700'}`}
                onClick={() => setSelectedChart('bar')}
              >
                <FaChartPie className="text-xl" />
              </button>
              <button
                className={`p-2 rounded-full ${selectedChart === 'line' ? 'bg-primary' : 'bg-gray-700'}`}
                onClick={() => setSelectedChart('line')}
              >
                <FaChartLine className="text-xl" />
              </button>
              <button
                className={`p-2 rounded-full ${selectedChart === 'pie' ? 'bg-primary' : 'bg-gray-700'}`}
                onClick={() => setSelectedChart('pie')}
              >
                <FaChartPie className="text-xl" />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${selectedChart}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderActiveChart()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <FaPills className="mr-2" /> Medication Summary
            </h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>Total Medications:</span>
                <span className="font-semibold bg-gray-700 px-3 py-1 rounded-full">5</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Doses Taken This Week:</span>
                <span className="font-semibold text-green-400 bg-green-400 bg-opacity-20 px-3 py-1 rounded-full">21</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Doses Missed This Week:</span>
                <span className="font-semibold text-red-400 bg-red-400 bg-opacity-20 px-3 py-1 rounded-full">7</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <FaCalendarAlt className="mr-2" /> Upcoming Refills
            </h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>Medication A:</span>
                <span className="font-semibold text-yellow-400 bg-yellow-400 bg-opacity-20 px-3 py-1 rounded-full">3 days left</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Medication B:</span>
                <span className="font-semibold text-green-400 bg-green-400 bg-opacity-20 px-3 py-1 rounded-full">10 days left</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Medication C:</span>
                <span className="font-semibold text-red-400 bg-red-400 bg-opacity-20 px-3 py-1 rounded-full">1 day left</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <FaChartPie className="mr-2" /> Adherence Insights
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">75%</span>
            <div className="w-2/3 bg-gray-700 rounded-full h-4">
              <div className="bg-primary rounded-full h-4" style={{ width: '75%' }}></div>
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            Your medication adherence this week is <span className="font-semibold text-primary">75%</span>. 
            This is a <span className="font-semibold text-green-400">5%</span> improvement from last week!
          </p>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Tips to Improve:</h3>
            <ul className="list-disc pl-5 text-gray-300 space-y-1">
              <li>Set timely reminders to ensure you don't miss a dose.</li>
              <li>Align medication times with your daily routines for better consistency.</li>
              <li>Keep a medication journal to track your progress.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportPage;