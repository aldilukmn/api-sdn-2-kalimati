"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const RegistrationSchema = new mongoose_1.Schema({
    registrationNumber: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ["validated", "unvalidated"],
        default: "unvalidated",
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
            type: String,
            required: true,
            trim: true
        },
        numberOfSiblings: {
            type: String,
            required: true,
            trim: true
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
            type: String,
            required: true,
            trim: true
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
            type: String,
            required: true,
            trim: true
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
}, {
    collection: "registration",
    timestamps: true
});
const RegistrationModel = mongoose_1.default.model("registration", RegistrationSchema);
exports.default = RegistrationModel;
