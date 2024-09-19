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

// Create a context to manage the modal's open state
const ModalContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
})

// Custom hook to use the modal context
const useModalContext = () => useContext(ModalContext)

// Modal content component
function ModalContent() {
  const { setIsOpen } = useModalContext()

  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted')
    setIsOpen(false)
  }

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-indigo-950 hover:bg-indigo-900">Login</Button>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-firstname">Firstname</Label>
              <Input id="register-firstname" type="text" placeholder="Firstname" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-lastname">Lastname</Label>
              <Input id="register-lastname" type="text" placeholder="Lastname" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input id="register-email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input id="register-password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" required />
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