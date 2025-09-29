import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
}

const NoteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "" },
  content: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model<INote>("Note", NoteSchema);
