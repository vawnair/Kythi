import { Document, Schema, models, model } from "mongoose";

export interface User extends Document {
  _id: string;
  username: string;
  password: string;
  email: string;
  uid: number;
  createdAt: Date;
  invite: {
    count: number;
    invited: string[];
    invitedBy: string;
  };
  permissions: {
    admin: boolean;
    moderator: boolean;
  }
}

const UserSchema = new Schema({
  _id: {
    type: String,
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  uid: {
    type: Number,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  invite: {
    count: {
      type: Number,
      default: 0,
    },
    invited: {
      type: [String],
      default: [],
    },
    invitedBy: {
      type: String,
      required: true,
    },
  },
  permissions: {
    admin: {
      type: Boolean,
      default: false,
    },
    moderator: {
      type: Boolean,
      default: false,
    },
  }
});

export const User = models["users"] || model<User>("users", UserSchema);
