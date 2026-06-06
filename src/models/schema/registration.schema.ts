import mongoose, { Schema } from "mongoose";
import Registration from "../entity/registration.entity";

const RegistrationSchema: Schema = new Schema(
  {
    registrationNumber: {
      type: String,
      unique: true,
      required: true
    },
    status: {
      type: String,
      enum: ["Validated", "Unvalidated"],
      default: "Unvalidated",
      required: true
    },
    student: {
      fullName: {
        type: String,
        required: true,
        trim: true
      },
      nisn: {
        type: String,
        trim: true
      },
      nik: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
      noKk: {
        type: String,
        required: true,
        trim: true
      },
      birthPlace: {
        type: String,
        required: true,
        trim: true
      },
      birthDate: {
        type: Date,
        required: true
      },
      gender: {
        type: String,
        required: true
      },
      religion: {
        type: String,
        required: true
      },
      address: {
        street: {
          type: String,
          required: true,
          trim: true
        },
        rt: {
          type: String,
          required: true,
          trim: true
        },
        rw: {
          type: String,
          required: true,
          trim: true
        },
        village: {
          type: String,
          required: true,
          trim: true
        },
        district: {
          type: String,
          required: true,
          trim: true
        },
        postalCode: {
          type: String,
          required: true,
          trim: true
        }
      },
      childOrder: {
        type: Number,
        required: true
      },
      numberOfSiblings: {
        type: Number,
        required: true
      },
      kindergartenOrigin: {
        type: String,
        trim: true
      }
    },

    father: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      birthYear: {
        type: Number,
        required: true,
      },
      occupation: {
        type: String
      },
      education: {
        type: String
      },
      monthlyIncome: {
        type: String
      },
      nik: {
        type: String,
        required: true,
        trim: true
      }
    },

    mother: {
       name: {
        type: String,
        required: true,
        trim: true
      },
      birthYear: {
        type: Number,
        required: true,
      },
      occupation: {
        type: String
      },
      education: {
        type: String
      },
      monthlyIncome: {
        type: String
      },
      nik: {
        type: String,
        required: true,
        trim: true
      }
    },

    contactPhoneNumber: {
      type: String,
      required: true,
      trim: true
    },

    hasGuardian: {
      type: Boolean,
      default: false
    },

    guardian: {
      name: {
        type: String,
        trim: true
      },
      relationship: {
        type: String,
        trim: true
      },
      phoneNumber: {
        type: String,
        trim: true
      }
    }
  },
  {
    collection: "registration",
    timestamps: true
  }
);

const RegistrationModel = mongoose.model<Registration>(
  "registration",
  RegistrationSchema
);

export default RegistrationModel;