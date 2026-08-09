// models/Business.js
import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },

    businessType: {
      type: String,
      required: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },

    // Multi-select list of neighborhoods this business serves,
    // chosen from the admin-managed Neighborhood list
    neighborhoods: {
      type: [String],
      default: [],
    },

    website: String,

    phone: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    description: String,

    keywords: [String],

    availability: {
      days:                { type: [String], default: [] },
      timeSlots:           { type: [String], default: [] },
      appointmentDuration: { type: Number,   default: 60  },
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

businessSchema.index({
  businessName: "text",
  description: "text",
  keywords: "text",
});

export default mongoose.model("Business", businessSchema);
