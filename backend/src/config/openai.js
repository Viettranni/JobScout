const OpenAI = require("openai");
require("dotenv").config();

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Key found in .env file
});

// Function to generate cover letter
async function generateCoverLetter(userData, jobData) {
  try {
    // Ensure user data is valid
    if (!userData || Object.keys(userData).length === 0) {
      throw new Error("User information required, please fill it out in the settings.");
    }

    const { firstname, lastname, skills, experience, education } = userData;
    console.log(userData);
    

    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant who writes professional cover letters for job applicants.",
      },
      {
        role: "user",
        content: `
          Write a formal job application cover letter for the role of ${jobData.title} at ${jobData.company}.
          The applicant's name is ${firstname} ${lastname}.
          Their key qualifications are:
          - Skills: ${skills.join(", ")}.
          - Experience: ${experience}.
          - Education: ${education}.
          Generate the cover letter while taking notes from the job post's description: ${jobData.description}.
          Include a professional introduction and a closing paragraph that shows enthusiasm for the position. Make it so it doesn't seem like it's LLM generated.
        `,
      },
    ];

    // Call OpenAI API to generate cover letter
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
