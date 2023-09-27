import Questions from '../models/Questions.js'
import mongoose from 'mongoose'

import User from "../models/auth.js"; 

export default async function updateBadges(userId, badgeType, incrementBy) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.badges[badgeType] += incrementBy;

    await user.save();
    
  } catch (error) {
    console.error('Error updating badge counts:', error);
  }
}

export const AskQuestion = async (req, res) => {
    const postQuestionData = req.body;
    const postQuestion = new Questions(postQuestionData);

    try {
        const user = await User.findById(postQuestionData.userId);
        if (user.noOfQuestions <= 0) {
            return res.status(403).json("You have reached the maximum limit of questions.");
        }

        user.noOfQuestions -= 1;
        await user.save();

        await postQuestion.save();

        await updateBadges(postQuestionData.userId, 'Bronze', 5);

        res.status(200).json("Posted a new question.");
    } catch (error) {
        console.log(error);
        res.status(409).json("Couldn't post a new question!!");
    }
}

export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find();
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error)
  }
}

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    await Questions.findByIdAndRemove(_id);
     res.status(200).json({ message: "successfully deleted..." })
  } catch (error) {
     res.status(404).json({ message: error.message })
  }
}

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findById(_id);

    // Check if the question exists
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex((id) => id === String(userId));

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter((id) => id !== String(userId));
      }

      if (upIndex === -1) {
        question.upVote.push(userId);

        if (question.upVote.length % 5 === 0) {
          const questionPosted = await User.findById(question.userId);

          if (questionPosted) {
            // Update badge count for the users
            questionPosted.badges.Silver += 5;
            await questionPosted.save();
          }
        }
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }

      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter((id) => id !== String(userId));
      }
    }

    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "Voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "ID not found" });
  }
};

export const getQuestionCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json('User not found');
    }
    //get noofquestions
    res.status(200).json(user.noOfQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
};

export const getUserUpvoteCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const userQuestions = await Questions.find({ userPosted: userId });

    let upvoteCount = 0;
    userQuestions.forEach((question) => {
      upvoteCount += question.upVote.filter((voter) => voter === userId).length;
    });

    return res.status(200).json({ upvoteCount });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};