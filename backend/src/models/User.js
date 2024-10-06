const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { jobPostSchema } = require("./JobPost"); // Assuming JobPost is a schema, not a model
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }], // Array of JobPost references
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user", // Default role for all new users
    },
    userData: {
      name: { type: String, required: false },
      skills: [{ type: String, required: false }],
      education: { type: String, required: false },
      experience: { type: String, required: false },
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

// Static method for signup
userSchema.statics.signup = async function (
  firstname,
  lastname,
  email,
  password,
  favourites,
  appliedJobs
) {
  const userExists = await this.findOne({ email });
  if (userExists) throw new Error("User already exists");

  // Email validator

  if (!validator.isEmail(email)) {
    throw Error("Invalid email!");
  }

  // Password validator
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    favourites,
    appliedJobs,
  });
  return user;
};

// Static method for login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return user;
};

// module.exports = User;
module.exports = mongoose.model("User", userSchema);
