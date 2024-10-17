import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_API_URL || "http://localhost:4000";


export function useGenerateCoverLetter() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false); // State for loading
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages

  const generateCoverLetter = async (jobDescription) => {
    setIsGenerating(true);
    setErrorMessage(null); // Reset error message before generating

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await axios.post(
        "${url}/api/coverLetter", // Backend endpoint
        { jobData: { description: jobDescription } }, // Send job description
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const coverLetter = response.data.coverLetter;
        console.log("Cover letter generated successfully:", coverLetter);

        // Store the cover letter with a unique key
        const uniqueKey = `coverLetter_${Date.now()}`;
        localStorage.setItem(uniqueKey, coverLetter);

        // Open a new tab with the CoverLetterDisplay path and pass the unique key
        window.open(`/cover-letter?key=${uniqueKey}`, "_blank");
      } else {
        throw new Error("Failed to generate the cover letter.");
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setErrorMessage("An error occurred while generating the cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, errorMessage, generateCoverLetter };
}
