import { useState } from "react";
import axios from "axios"; // Importing axios

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    experience: "",
    education: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userData: {
        name: formData.name,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        experience: formData.experience,
        education: formData.education,
      },
    };

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/userData",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Profile submitted successfully!");
      } else {
        console.error("Profile submission failed.");
      }
    } catch (error) {
      console.log(payload);

      console.error("Error submitting profile:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        User Information - These details will be inserted into LLM for creating
        the Cover Letter, make it count!
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills (comma-separated):
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education:
          </label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience:
          </label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows="5"
          ></textarea>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
        >
          Submit Profile
        </button>
      </div>
    </form>
  );
}
