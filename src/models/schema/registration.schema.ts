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
        required: true
      },
      nisn: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
      },
      nik: {
        type: String,
        unique: true,
        required: true
      },
      nokk: {
        type: String,
        unique: true,
        required: true
      },
      birthPlace: {
        type: String,
        required: true
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
          required: true
        },
        rt: {
          type: String,
          required: true
        },
        rw: {
          type: String,
          required: true
        },
        village: {
          type: String,
          required: true
        },
        district: {
          type: String,
          required: true
        },
        postalCode: {
          type: String,
          required: true
        }
      },
      childOrder: {
        type: Number,
        required: true
      },
      kindergartenOrigin: {
        type: String
      }
    },

    father: {
      name: {
        type: String,
        required: true
      },
      birthYear: {
        type: String,
        required: true
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
        unique: true,
        required: true
      }
    },

    mother: {
       name: {
        type: String,
        required: true
      },
      birthYear: {
        type: String,
        required: true
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
        unique: true,
        required: true
      }
    },

    contactPhoneNumber: {
      type: String,
      required: true
    },

    hasGuardian: {
      type: Boolean,
      default: false
    },

    guardian: {
      name: String,
      relationship: String,
      phoneNumber: String
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