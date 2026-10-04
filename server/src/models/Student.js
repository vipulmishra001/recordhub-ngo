const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      index: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      index: true
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other', 'prefer_not_to_say', ''],
        message: '{VALUE} is not a valid gender'
      },
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
      index: true
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    guardianName: {
      type: String,
      trim: true,
      default: ''
    },
    guardianPhone: {
      type: String,
      trim: true,
      default: ''
    },
    guardianRelationship: {
      type: String,
      trim: true,
      default: ''
    },
    educationLevel: {
      type: String,
      trim: true,
      default: ''
    },
    schoolName: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['active', 'graduated', 'transferred', 'inactive'],
        message: '{VALUE} is not a valid student status'
      },
      default: 'active',
      index: true
    },
    notes: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        return ret;
      }
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        return ret;
      }
    }
  }
);

// Compound indexes for searching and filtering
studentSchema.index({ status: 1, createdAt: -1 });
studentSchema.index({ firstName: 1, lastName: 1 });
studentSchema.index({ schoolName: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
