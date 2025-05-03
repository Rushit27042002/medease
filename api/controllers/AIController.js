const axios = require("axios");

module.exports = {
  async generateResponse(req, res) {
    try {
      // Extract the prompt from the request body
      const { prompt } = req.body;
      if (!prompt) {
        return res.badRequest({ error: "Prompt is required" });
      }

      // Get the API key from config/custom.js
      const apiKey = sails.config.custom.geminiApiKey;
      if (!apiKey) {
        return res.serverError({
          error: "API key is missing in config/custom.js",
        });
      }

      // API endpoint for Gemini
      const apiUrl =
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

      // System prompt to strictly restrict AI to medical topics
      const systemPrompt = `
       You are a professional medical assistant.  
Your job is to provide **accurate** medical-related information, including:  
- Symptoms and possible causes of diseases  
- Treatments and medications  
- Healthcare advice  
- Medical procedures and first aid  
- Home remedies for minor or common symptoms  

If the symptom is mild or common (such as a headache, cough, or stomach pain), provide **safe home remedies** along with medical advice.  

**DO NOT** say that you are an AI or that you cannot provide medical advice.  
If a question is **not medical-related**, simply reply: "I can only answer medical-related questions."
      `;

      // Modify the prompt to enforce medical focus
      const modifiedPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

      // Prepare the request payload
      const requestBody = {
        contents: [{ parts: [{ text: modifiedPrompt }] }],
      };

      // Call the Gemini API
      const response = await axios.post(`${apiUrl}?key=${apiKey}`, requestBody);

      // Check if the response contains valid data
      if (
        !response.data ||
        !response.data.candidates ||
        response.data.candidates.length === 0
      ) {
        return res.serverError({ error: "Invalid response from Gemini API" });
      }

      // Extract and return the AI-generated response
      return res.json({
        success: true,
        generatedText: response.data.candidates[0].content.parts[0].text,
      });
    } catch (error) {
      // Handle API or server errors
      return res.serverError({
        error: "An error occurred while generating AI response",
        details: error.response?.data || error.message,
      });
    }
  },
};
