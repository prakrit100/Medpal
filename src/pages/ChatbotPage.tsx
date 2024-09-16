import React from 'react';

const ChatbotPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h1 className="text-xl font-semibold text-center">MedPal Chatbot</h1>
          </div>
          <div className="p-4">
            <iframe 
              className="w-full h-[60vh] md:h-[70vh] rounded-lg border-none" 
              allow="microphone;"
              src="https://console.dialogflow.com/api-client/demo/embedded/876c378a-64cd-41a0-9867-08b590192cc1"
            ></iframe>
          </div>
          <div className="bg-gray-100 p-2 text-center text-sm text-gray-600">
            Powered by Dialogflow
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;