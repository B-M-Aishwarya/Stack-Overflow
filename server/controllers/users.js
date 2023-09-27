import mongoose from 'mongoose'
import users from '../models/auth.js'

export const getAllUsers = async (req, res) => {
  try {
       const allUsers = await users.find();
       const allUserDetails =[]
       allUsers.forEach(user => {
         allUserDetails.push({_id: user._id, name: user.name, about: user.about, tags: user.tags,joinedOn: user.joinedOn, badges: user.badges })
       })
         res.status(200).json(allUserDetails);
    } catch (error) {
         res.status(404).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const updatedProfile = await users.findByIdAndUpdate(_id, { $set: { name: name, about: about, tags: tags } },{ new: true }
    )
    res.status(200).json(updatedProfile)
  } catch (error) {
    res.status(405).json({ message: error.message })
  }
}

export const optplan = async (req, res) => {
  const { userId: _id } = req.params;
  const { selectedPlan } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await users.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's selected plan
    const planData = await users.findByIdAndUpdate(
      _id,
      { $set: {  
      'plan.selectedPlan': selectedPlan,
      'plan.selectedPlanOn': new Date(), }},
      { new: true }
    );

    if (!planData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the noOfQuestions based on the selectedPlan
    let noOfQuestions = 0;
    if (selectedPlan === 'Free') {
      noOfQuestions = 1;
    } else if (selectedPlan === 'Silver') {
      noOfQuestions = 5;
    } else if (selectedPlan === 'Gold') {
      noOfQuestions=Infinity;
    }

    // Update the user's noOfQuestions
    const updatedUser = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          noOfQuestions,
        },
      },
      { new: true }
    );

    console.log('Updated plan:', updatedUser);
    res.status(200).json(updatedUser);
 
  } catch (error) {
    console.error('Error updating selected plan:', error);
    res.status(500).json({ message: 'An error occurred while updating the plan' });
  }
};

