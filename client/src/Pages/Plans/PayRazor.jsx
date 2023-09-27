import { useEffect } from 'react';

const PayRazor = ({ razorpayOptions, buttonId }) => {

  useEffect(() => {
    
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
     
        const rzp = new window.Razorpay(razorpayOptions);
        
        document.getElementById(buttonId).onclick = function(e){
          rzp.open();
          e.preventDefault();
        };
      };

      document.head.appendChild(script);
    };

    loadRazorpay();
  }, [razorpayOptions, buttonId]);

  return null; 
};

export default PayRazor;