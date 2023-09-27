import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { simulateChatbotResponse } from './Chatcon';
import send from '../../assets/send.png';
import axios from 'axios';

const Chatbox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [setIsTyping] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const chatContentRef = useRef(null);

  const rasaApi = "https://rasa-bot-zgu1.onrender.com/webhooks/rest/webhook";
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = "Welcome! Select a programming language:";
      setMessages([{ text: welcomeMessage, isUser: false }]);
      
      const initialSuggestions = ["python", "java", "html", "css", "php"];
      const suggestionMessages = initialSuggestions.map((suggestionText) => ({
        text: suggestionText,
        isUser: false,
        isSuggestion: true,
      }));
      setMessages((prevMessages) => [...prevMessages, ...suggestionMessages]);
    }
  }, [isOpen, messages]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  const handleUserInput = async (inputText) => {
    setIsTyping(true);
  
    try {
      const response = await axios.post(rasaApi, {
        sender: 'user',
        message: inputText,
      });
  
      if (response.data && response.data.length > 0) {
        const chatbotResponse = response.data[0].text;
  
        const newMessages = [
          ...messages,
          { text: inputText, isUser: true },
          { text: chatbotResponse, isUser: false },
        ];
  
        setMessages(newMessages);
        setIsTyping(false);
        scrollToBottom();
      } else {
        console.error('Empty or invalid response from Rasa:', response);
      }
    } catch (error) {
      console.error('Error communicating with Rasa:', error);
    }
  };  
      
  const handleSuggestionClick = (suggestionText) => {

    const suggestion = suggestionText.substring('SUGGESTION:'.length).trim();
  
    handleUserInput(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputText = userInput.trim();
    if (inputText) {
      handleUserInput(inputText);
      setUserInput('');
    }
  };
  
  const sendOTPByEmail = async (email, generatedOtp ) => {
    console.log('Sending OTP for email:', email);
    try {
      const response = await fetch('http://localhost:5000/api/otp/sendotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, generatedOtp }),
      });
      console.log('Response:', response);
  
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };  

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Generated random otp
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    // Set otp Sent flag
    setOtpSent(true);
  
    setGeneratedOtp(generatedOtp);
  
    // Send otp via email
    await sendOTPByEmail(email, generatedOtp);

    // Scroll to the bottom
    scrollToBottom();
  };  

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.trim();
    
    // Check for otp matches
    if (enteredOtp === generatedOtp.toString()) {
      setIsUserAuthenticated(true);
      //console.log(generatedOtp)
    } else {
      alert('Invalid OTP. Please try again.');
    }

    // Scroll to the bottom
    scrollToBottom();
  };

  return (
    <div className={`chatbox ${isOpen ? 'open' : ''}`}>
      <div className="header">
        ChatBot 
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div>
        {isUserAuthenticated ? (
          <div>
            <div className="chat-content" ref={chatContentRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.isUser
                      ? 'user-message'
                      : message.isSuggestion
                      ? 'sug-msg suggestion-message'
                      : 'chatbot-message'
                  }`}
                >
                  {message.isSuggestion ? (
                    <div
                      onClick={() => handleSuggestionClick(`SUGGESTION: ${message.text}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {message.text}
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              ))}
            </div>
            <form className="user-input-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button type="submit">
                <img src={send} alt="sendicon" width="15" />
              </button>
            </form>
          </div>
        ) : (
          <div className='user-auth'>
            {!otpSent ? (
              <form onSubmit={handleEmailSubmit}>
                <label htmlFor="email">
                  <h4>Email</h4>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email.."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <button type="submit">Send OTP</button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <label htmlFor="otp">
                  <h4>OTP</h4>
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    placeholder="Otp.."
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </label>
                <button type="submit">Submit OTP</button>
              </form>
            )}
          </div> 
        )}
      </div>
    </div>
  );
};

export default Chatbox;
