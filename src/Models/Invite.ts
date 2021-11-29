import { Document, Schema, models, model } from "mongoose";

export interface Invite extends Document {
  _id: string;
  createdBy: string;
  createdAt: Date;
}

const InviteSchema = new Schema({
  _id: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Invite = models["invites"] || model<Invite>("invites", InviteSchema);
