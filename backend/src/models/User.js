const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { jobPostSchema } = require("./JobPost"); // Assuming JobPost is a schema, not a model

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

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

// const User = mongoose.model("User", userSchema);

// Static method for signup
userSchema.statics.signup = async function (firstname, lastname, email, password, favourites, appliedJobs) {
  const userExists = await this.findOne({ email });
  if (userExists) throw new Error('User already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ firstname, lastname, email, password: hashedPassword, favourites, appliedJobs });
  return user;
};

// Static method for login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  return user;
};


// module.exports = User;
module.exports = mongoose.model('User', userSchema);