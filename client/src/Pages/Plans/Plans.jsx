import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Plans.css';
import PayRazor from './PayRazor';

import LeftSidebar from '../../components/LeftSidebar/LeftSidebar';


const Plans = ({ slideIn, handleSlideIn }) => {
  
  const profileData = JSON.parse(localStorage.getItem("Profile"));
  const userId = profileData?.result?._id || '';

  const [selectedPlan, setSelectedPlan] = useState('');
  const navigate = useNavigate()

  //console.log('plan', selectedPlan )

  useEffect(() => {
    if (!profileData) {
      alert('Login');
      navigate("/Auth");
    }
}, [navigate, profileData]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  }; 


 const razorpayOptionsSilver = {
   key: process.env.REACT_APP_RAZORPAY_KEY,
   amount: 10000,
   currency: 'INR',
   name: 'Subscription',
   description: 'Subscription Payment',
  theme: {
    color: '#3399cc',
  },
  handler: async (response) => {
    if (response.razorpay_payment_id) {
      alert('Payment Successful');
    } else {
      alert('Payment Failed');
    }
    // selectedPlan to server
    try {
      const updateResponse = await fetch(`http://localhost:5000/api/plan/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedPlan }),
      });

      if (updateResponse.ok) {
        console.log('Selected plan updated on the server');
        alert(`You have subscribed to the ${selectedPlan} Plan`);
      } else {
        const errorResponse = await updateResponse.json();
        console.error('Error updating selected plan:', errorResponse);
        alert('An error occurred while subscribing. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating selected plan:', error);
      alert('An error occurred while subscribing. Please try again later.');
    }
  },
};

// Razorpay options for Gold plan
const razorpayOptionsGold = {
  ...razorpayOptionsSilver, 
  amount: 100000, //1000 INR (1000 * 100)
};  

  const handleFree = async () => {
    alert("You have subscribed to Free Plan")
  }

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      {profileData && (
        <div className="home-container-2" style={{ marginTop: '30px' }}>
          <h1 style={{ fontWeight: '400' }}>Choose a Subscription Plan</h1>
          <div className="plans-container">
      <div className={`plan-card ${selectedPlan === 'free' ? 'selected' : ''}`} onClick={() => handlePlanSelect('free')}>
        <h2>Free</h2>
        <div class="price-section">
          <div class="price-area">
           <div class="inner-area">
            <span class="text">₹</span>
            <span class="price">0<span style={{fontSize:"12px"}}>/month</span></span>
           </div>
          </div>
        </div>
        <p>Post 1 question a day</p>
        <button onClick={handleFree}>
          Free
        </button>
           </div> 
           <div className={`plan-card ${selectedPlan === 'silver' ? 'selected' : ''}`} onClick={() => handlePlanSelect('Silver')}>
        <h2>Silver</h2>
        <div class="ribbon"><span>Basic</span></div>
        <div class="price-section">
          <div class="price-area">
           <div class="inner-area">
            <span class="text">₹</span>
            <span class="price">100<span style={{fontSize:"12px"}}>/month</span></span>
           </div>
          </div>
        </div>
        <p>Post 5 questions a day</p>
        <button id="rzp-button-silver">Subscribe</button>
        <PayRazor razorpayOptions={razorpayOptionsSilver} buttonId="rzp-button-silver" />
        </div>
            <div className={`plan-card ${selectedPlan === 'gold' ? 'selected' : ''}`} onClick={() => handlePlanSelect('Gold')}>
            <h2>Gold</h2>
        <div class="ribbon"><span>Pro</span></div>
        <div class="price-section">
          <div class="price-area">
           <div class="inner-area">
            <span class="text">₹</span>
            <span class="price">1000<span style={{fontSize:"12px"}}>/month</span></span>
           </div>
          </div>
        </div>
        <p>Post Unlimited questions</p>
              <button id="rzp-button-gold">Subscribe</button>
              <PayRazor razorpayOptions={razorpayOptionsGold} buttonId="rzp-button-gold" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;