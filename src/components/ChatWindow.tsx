import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! How can I help you with image upscaling today?", isUser: false },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I'm processing your request. Please upload an image to get started with upscaling.", isUser: false }]);
      }, 1000);
    }
  };

  return (
    <div className="glassmorphism w-full max-w-md mx-auto mt-8">
      <div className="h-96 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-accent-color text-white' : 'bg-gray-700 text-white'} max-w-[70%]`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-yellow-400 text-gray-900 rounded-r-lg px-4 py-2 hover:bg-yellow-500 transition-colors duration-300 font-bold"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;