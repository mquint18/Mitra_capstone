// models/Resident.js
import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
  {
    firstName: {
      type:     String,
      required: true,
      trim:     true,
    },
    lastName: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: true,
      select:   false,   // never returned in queries unless explicitly requested
    },
    address: {
      type:    String,
      trim:    true,
      default: "",
    },
    suburb: {
      type:    String,
      trim:    true,
      default: "",
    },
    phone: {
      type:    String,
      trim:    true,
      default: "",
    },
    role: {
      type:    String,
      default: "resident",
      enum:    ["resident"],
    },
    active: {
      type:    Boolean,
      default: true,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Booking",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Resident", residentSchema);
