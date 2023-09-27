export const simulateChatbotResponse = (userQuestion) => {
  console.log('Received user question:', userQuestion);

  const lowercasedInput = userQuestion.toLowerCase();
  let responseText = '';
  const suggestions = [];

  if (lowercasedInput.includes('javascript')) {
    console.log('Matched keyword: JavaScript');
    responseText = 'JavaScript is a programming language used for web development.';
    suggestions.push('Tell me more about JavaScript', 'JavaScript frameworks');
  } else if (lowercasedInput.includes('python')) {
    console.log('Matched keyword: Python');
    responseText = 'Python is a versatile programming language used in various applications.';
    suggestions.push('Python libraries', 'Python tutorials');
  } else {
    console.log('No keyword match.');
    responseText = 'I\'m not sure about that. Please ask another question.';
  }
  return { responseText, suggestions };
};