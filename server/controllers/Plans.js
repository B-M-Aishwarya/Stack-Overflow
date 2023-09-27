import cron from 'node-cron';
import User from '../models/auth.js';

export const task = async () => {
  try {
    await User.updateMany(
      { 'plan.selectedPlan': 'Silver' },
      { $set: { noOfQuestions: 5 } }
    );

    await User.updateMany(
      { 'plan.selectedPlan': 'Free' },
      { $set: { noOfQuestions: 1 } }
    );
    
    console.log(`Reset ${User.length} plan users' noOfQuestions.`);
    console.log('Updated noOfQuestions for Silver and Free plans');
  } catch (error) {
    console.error('Error updating noOfQuestions:', error);
  }
};

cron.schedule('0 0 * * *', task, {
  timezone: 'Asia/Kolkata', 
});


export const todo = async () => {
  try {
    const usersToUpdate = await User.find({
      $or: [
        { 'plan.selectedPlan': 'Silver' },
        { 'plan.selectedPlan': 'Gold' },
      ],
    });

    for (const user of usersToUpdate) {
      const selectedPlanDate = user.plan.selectedPlanOn;
      const currentDate = Date.now();
      const daysDifference = Math.floor((currentDate - selectedPlanDate) / (1000 * 60 * 60 * 24));

      if (daysDifference >= 30) {
        user.plan.selectedPlan = 'Free';
        user.plan.selectedPlanOn = Date.now();
        user.noOfQuestions = 1;
        await user.save();
      }
    }

    console.log('Updated selectedPlan and noOfQuestions for Silver and Gold plans');
  } catch (error) {
    console.error('Error updating selectedPlan and noOfQuestions:', error);
  }
};

cron.schedule('0 0 */30 * *', todo, {
  timezone: 'Asia/Kolkata',
});