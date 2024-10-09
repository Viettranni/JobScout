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
import { useUser } from "../../context/UserContext";

// Array of default avatar image URLs
const defaultAvatars = [
  "/assets/avatars/avatar1.png",
  "/assets/avatars/avatar2.png",
  "/assets/avatars/avatar3.png",
  "/assets/avatars/avatar4.png",
  "/assets/avatars/avatar5.png",
  "/assets/avatars/avatar6.png",
  "/assets/avatars/avatar7.png",
  "/assets/avatars/avatar8.png",
];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    avatar: defaultAvatars[0], // Default avatar if no avatar selected/uploaded
  });

  const [formData, setFormData] = useState({
    skills: "",
    experience: "",
    education: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(""); // New state for update messages
  const fileInputRef = useRef(null);

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
        const { firstname, lastname, email, profileImage, userData } =
          response.data;

        // Set avatar: if profileImage exists, use it; otherwise use the default
        setProfile({
          firstname,
          lastname,
          email,
          avatar: profileImage
            ? `http://localhost:4000${profileImage}`
            : defaultAvatars[0], // Ensure URL points to server
        });
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (newAvatar) => {
    setProfile({ ...profile, avatar: newAvatar }); // Change avatar in state immediately

    // API call to update avatar
    const payload = {
      profileImage: newAvatar,
    };

    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        "http://localhost:4000/api/users/profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setUpdateMessage("Profile picture updated successfully!"); // Show confirmation message
        setTimeout(() => setUpdateMessage(""), 3000); // Clear message after 3 seconds

        window.location.reload();

        // Fetch the updated profile to ensure that everything is consistent with the server
        await fetchProfile();
      } else {
        console.error("Profile picture update failed.");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }

    setShowAvatarSelector(false); // Close avatar selector after selection
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file); // 'avatar' matches the multer fieldname

    // Show the image preview immediately using URL.createObjectURL
    const previewURL = URL.createObjectURL(file);
    setProfile({ ...profile, avatar: previewURL });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/users/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProfile({ ...profile, avatar: response.data.profileImage });
        setUpdateMessage("Profile picture updated successfully!"); // Show confirmation message
        setTimeout(() => setUpdateMessage(""), 3000); // Clear message after 3 seconds

        window.location.reload();

        // Fetch the updated profile to ensure consistency with the server
        await fetchProfile();

        // Close avatar selector after the successful upload
        setShowAvatarSelector(false);
      }
      console.log("File upload response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    // Reset the file input (optional)
    fileInputRef.current.value = "";
  };

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
        "http://localhost:4000/api/users/profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully!");

        // Only update firstname, lastname, email fields while keeping the avatar unchanged
        setProfile((prevProfile) => ({
          ...prevProfile,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
        }));

        setIsEditingProfile(false); // Stop editing mode after successful update
        setUpdateMessage("Profile updated successfully!"); // Show confirmation message
        setTimeout(() => setUpdateMessage(""), 3000); // Clear message after 3 seconds
        window.location.reload();

        // Update the global user context to keep everything in sync
        const { setUser } = useUser();
        setUser(response.data);
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
                    <div className="w-full flex justify-center mt-4 ">
                      <Button
                        className="hover:bg-hover"
                        onClick={() => fileInputRef.current.click()}
                      >
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
                {updateMessage && (
                  <p className="text-green-500 text-sm">{updateMessage}</p>
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
                    handleSubmit(); // Call handleSubmit without an event object
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
