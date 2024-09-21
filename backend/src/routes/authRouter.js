const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Implemented in the User model

const registerUser = async (req, res) => {
    const { firstname, lastname, email, password, favourites, appliedJobs } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: " You already have an Account! Log in :) "});
        }

        const newUser = new User({ firstname, lastname, email, password, favourites, appliedJobs });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
        
    } catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            console.error("Error during registration:", error);
            res.status(500).json({ message: "Server ERROR" });
        }
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: email } ]});
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successfully!", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    registerUser,
    loginUser
};