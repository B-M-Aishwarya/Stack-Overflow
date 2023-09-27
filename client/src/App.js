import { BrowserRouter as Router } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';

import Navbar from './components/Navbar/Navbar'
import AllRoutes from './AllRoutes'
import { fetchAllQuestions } from './actions/question'
import { fetchAllUsers } from './actions/users' 

import Chatbot from './components/Chatbot/Chatbot'
import iconchat from '../src/assets/chat.png'

function App() {
   const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllQuestions())
    dispatch(fetchAllUsers()) 
  }, [dispatch])

  const [slideIn, setslideIn] = useState(true);
  const [showChatbox, setShowChatbox] = useState(false);
  
  useEffect(() => {
    if (window.innerWidth <= 760) {
      setslideIn(false)
    }
  }, []);

  const handleSlideIn = () => {
    if (window.innerWidth <= 760) {
      setslideIn((state) => !state);
    }
  }

  const toggleChatbox = () => {
    console.log('Toggling chatbox');
    setShowChatbox((prevShowChatbox) => !prevShowChatbox);
  };

  return (
    <div className="App">
     <Router>
       <Navbar handleSlideIn={handleSlideIn}/>
       <AllRoutes slideIn={slideIn} handleSlideIn={handleSlideIn} />
     
       <img
        src={iconchat}
        alt="Chat Icon"
        className="chat-icon"
        onClick={toggleChatbox}
      />

        {/* Chatbox */}
        {showChatbox && <Chatbot isOpen={showChatbox} onClose={toggleChatbox} />
}

     </Router>
    </div>
  );
}

export default App;
