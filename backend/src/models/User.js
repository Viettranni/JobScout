const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { jobPostSchema } = require("./JobPost"); // Assuming JobPost is a schema, not a model

<<<<<<< HEAD
const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }], // Array of JobPost references
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);
=======
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }], // Array of JobPost references
});
>>>>>>> vietbe

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
