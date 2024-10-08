import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

// Avatar imports
import avatar1 from "../../../assets/avatar1.png";
import avatar2 from "../../../assets/avatar2.png";
import avatar3 from "../../../assets/avatar3.png";
import avatar4 from "../../../assets/avatar4.png";
import avatar5 from "../../../assets/avatar5.png";
import avatar6 from "../../../assets/avatar6.png";
import avatar7 from "../../../assets/avatar7.png";
import avatar8 from "../../../assets/avatar8.png";

// Array of default avatar images
const defaultAvatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    avatar: defaultAvatars[0],
  });

  const [formData, setFormData] = useState({
    skills: "",
    experience: "",
    education: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:4000/api/users/profile", // Fetch user profile
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          const { firstname, lastname, email, userData } = response.data;
          setProfile({ firstname, lastname, email, avatar: defaultAvatars[0] });
          setFormData({
            skills: userData.skills.join(", "),
            experience: userData.experience,
            education: userData.education,
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (newAvatar) => {
    setProfile({ ...profile, avatar: newAvatar });
    setShowAvatarSelector(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAvatarChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Updated handleSubmit to include profile data and userData
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Only call preventDefault if there's an event
    }

    const payload = {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      userData: {
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        experience: formData.experience,
        education: formData.education,
      },
    };

    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        "http://localhost:4000/api/users/profile", // Adjust the URL to your backend endpoint
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully!");
        setProfile({
          ...profile,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
        });
        setIsEditingProfile(false); // Stop editing mode after successful update
      } else {
        console.error("Profile update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your profile details here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div
                  className="w-32 h-32 rounded-full overflow-hidden cursor-pointer relative group"
                  onClick={() => setShowAvatarSelector(true)}
                >
                  <img
                    src={profile.avatar}
                    alt={`${profile.firstname} ${profile.lastname}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-sm">Change Avatar</span>
                  </div>
                </div>
                {showAvatarSelector && (
                  <div className="flex flex-wrap justify-center gap-4">
                    {defaultAvatars.map((avatar, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 rounded-full overflow-hidden cursor-pointer"
                        onClick={() => handleAvatarChange(avatar)}
                      >
                        <img
                          src={avatar}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-full flex justify-center mt-4">
                      <Button onClick={() => fileInputRef.current.click()}>
                        Upload Custom
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
                {isEditingProfile ? (
                  <>
                    <Input
                      name="firstname"
                      value={profile.firstname || ""}
                      onChange={handleProfileChange}
                      placeholder="First Name"
                      type="text"
                    />
                    <Input
                      name="lastname"
                      value={profile.lastname || ""}
                      onChange={handleProfileChange}
                      placeholder="Last Name"
                      type="text"
                    />
                    <Input
                      name="email"
                      value={profile.email || ""}
                      onChange={handleProfileChange}
                      placeholder="Email"
                      type="email"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">
                      {profile.firstname} {profile.lastname}
                    </h2>
                    <p>{profile.email}</p>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="hover:bg-hover"
                onClick={() => {
                  if (isEditingProfile) {
                    handleSubmit(); // Call handleSubmit  without an event object
                  } else {
                    setIsEditingProfile(true); // Enable edit mode
                  }
                }}
              >
                {isEditingProfile ? "Save Profile" : "Edit Profile"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Update your professional details to receive personalized cover
                letter generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma-separated):
                  </label>
                  <Input
                    name="skills"
                    value={formData.skills || ""}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education:
                  </label>
                  <Input
                    name="education"
                    value={formData.education || ""}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience:
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience || ""}
                    onChange={handleFormChange}
                    required
                    rows="8"
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full hover:bg-hover">
                  Submit Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
