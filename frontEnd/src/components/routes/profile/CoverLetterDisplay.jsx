import React, { useEffect, useState } from "react";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

const CoverLetterDisplay = () => {
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");

    if (key) {
      const letter = localStorage.getItem(key);
      if (letter) {
        setCoverLetter(letter);
      }
    }
  }, []);

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height; 
    const margin = 10; 
    const fontSize = 12; 
    const lineHeight = 8;
    const textWidth = 260; 
    const textLines = doc.splitTextToSize(coverLetter, textWidth); 
    let y = margin;
  
    // Set font and size
    doc.setFont("Times", "normal"); 
    doc.setFontSize(fontSize); 
  
    // Add lines to the PDF
    textLines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) { // Check if the next line would overflow the page
        doc.addPage();
        y = margin; // Reset y position to the top for the new page
      }
      doc.text(line, margin, y); // Use margin for x position
      y += lineHeight; // Move down for the next line, adjusted for line height
    });
  
    doc.save("cover_letter.pdf");
  };
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Generated Cover Letter</h1>
      <textarea
        className="w-full h-[11.69in] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)} // Update state on input change
      />
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleSaveAsPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
};

export default CoverLetterDisplay;
