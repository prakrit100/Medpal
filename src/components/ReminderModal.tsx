import React from 'react';
import Modal from 'react-modal';

interface ReminderModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  message: string;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onRequestClose, message }) => {
  // Extract the medication name from the message
  const medicationName = message.split(': ')[1];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded-lg shadow-lg text-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4">Reminder</h2>
      <p className="text-lg mb-4">
        Time to take your medication: <span className="font-bold text-primary">{medicationName}</span>
      </p>
      <button
        onClick={onRequestClose}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        Dismiss
      </button>
    </Modal>
  );
};

export default ReminderModal;