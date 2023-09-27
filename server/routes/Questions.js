import express from 'express'

import { AskQuestion, getAllQuestions, deleteQuestion, voteQuestion, getQuestionCount, getUserUpvoteCount } from '../controllers/Questions.js'
import auth from '../middleware/auth.js'
const router = express.Router()

router.post('/Ask', AskQuestion)
router.get('/get', getAllQuestions)
router.delete('/delete/:id',auth, deleteQuestion );
router.patch('/vote/:id',auth, voteQuestion);
router.get('/getquescount/:userId', getQuestionCount);
router.get('/upvoteCount/:userId', getUserUpvoteCount);

export default router