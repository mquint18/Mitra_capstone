// models/Resident.js
import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
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
      select:   false,
    },
    address: { type: String, trim: true, default: "" },

    // Renamed from "suburb" — now selected from the admin-managed neighborhood list
    neighborhood: { type: String, trim: true, default: "" },

    phone: { type: String, trim: true, default: "" },
    role: { type: String, default: "resident", enum: ["resident", "admin"] },
    active: { type: Boolean, default: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

export default mongoose.model("Resident", residentSchema);
