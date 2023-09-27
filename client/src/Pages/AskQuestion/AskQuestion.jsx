import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './AskQuestion.css';
import { askQuestion } from '../../actions/question';
import axios from 'axios';

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const userId = user?.result?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      if (questionTitle && questionBody && questionTags) {
        try {
          // Fetch count from the server
          const userdb = await axios.get(`/questions/getquescount/${userId}`);
  
          // Check if user has reached the limit
          const userQuestions = userdb.data;
          if (userQuestions === 0) {
            alert('You have reached the maximum limit of questions.');
          } else {
            const response = await dispatch(askQuestion({
              questionTitle,
              questionBody,
              questionTags,
              userPosted: user?.result?.name,
              userId: user?.result?._id
            }, navigate));
          }
        } catch (error) {
          console.error("An error occurred:", error);
          alert('An error occurred while submitting your question.');
        }
      } else {
        alert('Please enter all fields');
      }
    } else {
      alert('Login to ask a question');
    }
  }  
    
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setQuestionBody(questionBody + "\n");
    }
  }

  return (
    <div className='ask-question'>
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      <div className='ask-ques-container'>
        <h1>Ask a public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className='ask-form-container'>
            <label htmlFor='ask-ques-title'>
              <h4>Title</h4>
              <p>Be specific and imagine you're asking a question to another person</p>
              <input type="text" id='ask-ques-title' onChange={(e) => { setQuestionTitle(e.target.value); }} placeholder='e.g. Is there an R function for finding the index of an element in a vector?' />
            </label>
            <label htmlFor='ask-ques-body'>
              <h4>Body</h4>
              <p>Include all the information someone would need to answer your question</p>
              <textarea name=" " id='ask-ques-body' onChange={(e) => { setQuestionBody(e.target.value); }} cols="30" rows="10" onKeyPress={handleEnter}></textarea>
            </label>
            <label htmlFor='ask-ques-tags'>
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input type="text" id='ask-ques-tags' onChange={(e) => { setQuestionTags(e.target.value.split(" ")); }} placeholder="e.g. (xml typescript wordpress)" />
            </label>
          </div>
          <input type="submit" value='Review your question' className='review-btn' />
        </form>
      </div>
    </div>
  )
}

export default AskQuestion;
