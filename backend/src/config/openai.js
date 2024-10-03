const OpenAI = require('openai');
require("dotenv").config(); 

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Key found in .env file, ask Viet for the key
});

// Function to generate cover letter
async function generateCoverLetter(userData, jobData) {
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant who writes professional cover letters for job applicants.",
    },
    {
      role: "user",
      content: `
        Write a formal job application cover letter for the role of ${jobData.title} at ${jobData.company}. 
        The applicant's name is ${userData.name}, and their key qualifications are:
        - Skills: ${userData.skills.join(", ")}.
        - Experience: ${userData.experience}.
        - Education: ${userData.education}.
        Generate the cover letter while taking notes from the job post's description: ${jobData.description}.
        Include a professional introduction and a closing paragraph that shows enthusiasm for the position. Make it so it doesn't seem like it's LLM generated.
      `,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const coverLetter = response.choices[0].message.content.trim();
    return coverLetter;

  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

module.exports = { generateCoverLetter }; // Export the function
