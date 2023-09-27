export const payoption = async(req, res) => {
    const razorpayOptionsSilver = {
        key: process.env.KEY,
        amount: 10000,
        currency: 'INR',
        name: 'StackOverflowClone',
        description: 'Subscription Payment',
        image: 'https://example.com/your_logo.png',
        theme: {
          color: '#3399cc',
        },
        handler: function (response) {
          console.log('Payment successful:', response);
          handleRazorpaySuccess();
        },
      };
     res.json(razorpayOptionsSilver);
}
