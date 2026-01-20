import mongoose from"mongoose";

 const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    whatsappStatus: {
      type: String,
      enum: ["NOT_CONNECTED", "CONNECTED"],
      default: "NOT_CONNECTED",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const Registration = mongoose.model("Registration", registrationSchema);
