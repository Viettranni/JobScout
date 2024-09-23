import React, { createContext, useContext, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';


// Create a context to manage the modal's open state
const ModalContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
})

// Custom hook to use the modal context
const useModalContext = () => useContext(ModalContext)

// Modal content component
function ModalContent() {
  const navigate = useNavigate()
  const { setIsOpen } = useModalContext()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };


  // Handling the REGISTER submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/users/register", formData);
      alert(response.data.message); // Show success message
      const { token } = response.data;

      localStorage.setItem("token", token);

      navigate("/");
      window.location.reload();

      setIsOpen(false)
    } catch (error) {
      console.error("Registration error:", error);
        
      // Ensure the response and data exist before trying to alert
      if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message); // Show error message from server
      } else {
          alert("An unexpected error occurred."); // Fallback message for other errors
      }
    }
  };


  // Handling the LOGIN submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/users/login", loginData);
      console.log(response)

      const { token } = response.data;

      localStorage.setItem("token", token);
      
      navigate("/");
      window.location.reload();

      // alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Full error:", error);
      alert(error.response.data.message); // Show error message
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
              <Input id="email" type="email" name="email" onChange={handleLoginChange} placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" onChange={handleLoginChange} required />
            </div>
            <Button type="submit" className="w-full bg-indigo-950 hover:bg-indigo-900">Login</Button>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-firstname">Firstname</Label>
              <Input id="register-firstname" type="text" name="firstname" onChange={handleRegisterChange} placeholder="Firstname" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-lastname">Lastname</Label>
              <Input id="register-lastname" type="text" name="lastname" onChange={handleRegisterChange} placeholder="lastname" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input id="register-email" type="email" name="email" onChange={handleRegisterChange} placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input id="register-password" type="password" name="password" onChange={handleRegisterChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" name="confirmPassword" onChange={handleRegisterChange} required />
            </div>
            <Button type="submit" className="w-full bg-indigo-950 hover:bg-indigo-900">Register</Button>
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
}

// Main component that accepts a custom trigger
export default function LoginModal({ trigger }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <ModalContent />
      </Dialog>
    </ModalContext.Provider>
  )
}