const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    name: {

      type: String,

      required: [true, "Name is required"],

      trim: true,
    },

    email: {

      type: String,

      required: [true, "Email is required"],

      unique: true,

      lowercase: true,

      trim: true,
    },
    password: {


      type: String,


      required: [true, "Password is required"],


      minlength: 6,
    },


    role: {


      type: String,


      enum: ["user", "admin"],


      default: "user",
    },

    orgName: {


      type: String,


      default: null,


    },
    description: {


      type: String,

      default: null,
    },
    website: {

      type: String,
      
      default: null,
    },
    teamSize: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);