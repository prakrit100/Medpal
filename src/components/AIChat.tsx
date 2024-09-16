import React, { useState } from 'react';

const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const medicalQA: {[key: string]: string} = {
    "What are the side effects of aspirin?": "Common side effects of aspirin include stomach irritation, nausea, and increased risk of bleeding. Always consult your doctor for personalized advice.",
    "How often should I take my medication?": "The frequency of medication intake depends on the specific prescription. Always follow your doctor's instructions or the label on your medication.",
    "What should I do if I miss a dose?": "If you miss a dose, take it as soon as you remember. However, if it's almost time for your next dose, skip the missed one. Don't double up on doses.",
    "Can I take my medication with food?": "It depends on the specific medication. Some are best taken with food to reduce stomach upset, while others should be taken on an empty stomach. Check your prescription or ask your pharmacist.",
    "How should I store my medications?": "Most medications should be stored in a cool, dry place away from direct sunlight. Some may require refrigeration. Always check the label for specific storage instructions.",
    "What is a drug interaction?": "A drug interaction occurs when a substance affects the activity of a drug when both are taken together. This can cause unexpected side effects or reduce the effectiveness of the medication.",
    "How long does it take for a medication to start working?": "The time it takes for a medication to start working varies depending on the drug and your individual body. Some work within minutes, others may take days or weeks to show full effects.",
    "Is it safe to drink alcohol while taking medication?": "Many medications can interact negatively with alcohol. It's best to avoid alcohol or consult with your doctor or pharmacist about potential interactions with your specific medications.",
    "What's the difference between generic and brand-name drugs?": "Generic drugs have the same active ingredients as brand-name drugs but are typically less expensive. They are required to be just as safe and effective as the brand-name version.",
    "How can I remember to take my medication regularly?": "Try setting daily alarms, using a pill organizer, or linking your medication time to a daily routine like brushing your teeth. There are also many smartphone apps designed to help with medication reminders."
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    for (const [key, value] of Object.entries(medicalQA)) {
      if (lowerQuestion.includes(key.toLowerCase())) {
        return value;
      }
    }
    return "I'm sorry, I don't have specific information about that. Please consult with a healthcare professional for accurate medical advice.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prev => [...prev, {text: input, isUser: true}]);
      setInput('');
      setIsLoading(true);

      // Simulate AI response delay
      setTimeout(() => {
        const aiResponse = getAIResponse(input);
        setMessages(prev => [...prev, {text: aiResponse, isUser: false}]);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="mb-4 h-64 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-primary text-white' : 'bg-gray-700 text-white'}`}>
              {message.text}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-400">AI is thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-gray-700 text-white p-2 rounded-l-lg"
          placeholder="Ask a medical question..."
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-r-lg" disabled={isLoading}>Send</button>
      </form>
      <p className="text-xs text-gray-400 mt-2">Disclaimer: This AI is not a substitute for professional medical advice.</p>
    </div>
  );
};

export default AIChat;