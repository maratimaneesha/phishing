const axios = require('axios');

const checkPhishing = async (emailBody) => {
  try {
    const response = await axios.post('LLM_API_ENDPOINT', { text: emailBody });
    return response.data.isPhishing;
  } catch (error) {
    console.error('Phishing detection error:', error);
    return false;
  }
};

module.exports = { checkPhishing };