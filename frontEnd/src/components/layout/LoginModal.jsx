import React, { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create a context to manage the modal's open state
const ModalContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
});

// Custom hook to use the modal context
const useModalContext = () => useContext(ModalContext);

// Function to calculate password strength based on criteria
const calculatePasswordStrength = (password) => {
  let strength = 0;

  // Check for length of at least 6 characters
  if (password.length >= 6) strength += 1;

  // Check for the presence of uppercase letter
  if (/[A-Z]/.test(password)) strength += 1;

  // Check for the presence of lowercase letter
  if (/[a-z]/.test(password)) strength += 1;

  // Check for the presence of a number
  if (/[0-9]/.test(password)) strength += 1;

  // Check for the presence of a special character
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return strength;
};

// Modal content component
function ModalContent() {
  const navigate = useNavigate();
  const { setIsOpen } = useModalContext();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0); // Password strength state
  const [error, setError] = useState("");

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Update password strength only when password field changes
    if (e.target.name === "password") {
      const strength = calculatePasswordStrength(e.target.value); // Calculate password strength
      setPasswordStrength(strength);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handling the REGISTER submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "https://jobscout-api-f8ep.onrender.com/api/users/register",
        formData
      );
      alert(response.data.message);
      const { token } = response.data;

      localStorage.setItem("token", token);

      navigate("/");
      window.location.reload();

      setIsOpen(false);
      setError("");
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // Handling the LOGIN submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://jobscout-api-f8ep.onrender.com/api/users/login",
        loginData
      );
      const { token } = response.data;

      localStorage.setItem("token", token);

      navigate("/");
      window.location.reload();

      setIsOpen(false);
      setError("");
      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Full error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Account Access</DialogTitle>
        <DialogDescription>
          Login to your account or create a new one.
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                onChange={handleLoginChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                onChange={handleLoginChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-950 hover:bg-indigo-900"
            >
              Login
            </Button>
            {error && (
              <div className="text-red-500 bg-red-100 p-2 mt-2 rounded">
                {error}
              </div>
            )}
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-firstname">Firstname</Label>
              <Input
                id="register-firstname"
                type="text"
                name="firstname"
                onChange={handleRegisterChange}
                placeholder="Firstname"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-lastname">Lastname</Label>
              <Input
                id="register-lastname"
                type="text"
                name="lastname"
                onChange={handleRegisterChange}
                placeholder="Lastname"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                name="email"
                onChange={handleRegisterChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="register-email">Password</Label>
              <input
                id="register-password"
                type="password"
                name="password"
                onChange={handleRegisterChange}
                className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Password"
                required
              />

              {/* Password strength indicator */}
              <div className="grid w-full h-1 grid-cols-12 gap-4 mt-3">
                <div
                  className={`h-full col-span-3 ${
                    passwordStrength >= 2 ? "bg-green-500" : "bg-gray-200"
                  } rounded`}
                ></div>
                <div
                  className={`h-full col-span-3 ${
                    passwordStrength >= 3 ? "bg-green-500" : "bg-gray-200"
                  } rounded`}
                ></div>
                <div
                  className={`h-full col-span-3 ${
                    passwordStrength >= 4 ? "bg-green-500" : "bg-gray-200"
                  } rounded`}
                ></div>
                <div
                  className={`h-full col-span-3 ${
                    passwordStrength === 5 ? "bg-green-500" : "bg-gray-200"
                  } rounded`}
                ></div>
              </div>

              {/* Password validation message */}
              {formData.password && (
                <div
                  className={`mt-2 ${
                    passwordStrength === 5 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {passwordStrength === 5 ? "Strong password" : "Weak password"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                onChange={handleRegisterChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-950 hover:bg-indigo-900"
            >
              Register
            </Button>
            {error && (
              <div className="text-red-500 bg-red-100 p-2 mt-2 rounded">
                {error}
              </div>
            )}
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

// Main component that accepts a custom trigger
export default function LoginModal({ trigger }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <ModalContent />
      </Dialog>
    </ModalContext.Provider>
  );
}
