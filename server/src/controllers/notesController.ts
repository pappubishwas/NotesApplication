import { Request, Response } from "express";
import Note from "../models/Note";
import { AuthRequest } from "../middlewares/auth";

export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const user = req.user!;
  const note = new Note({ title, content, user: user._id });
  await note.save();
  return res.json(note);
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const notes = await Note.find({ user: user._id }).sort({ createdAt: -1 });
  return res.json(notes);
};

export const getNotesById = async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { id } = req.params;
  const note = await Note.findOne({ _id: id, user: user._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  return res.json(note);
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { id } = req.params;
  const note = await Note.findOneAndDelete({ _id: id, user: user._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  return res.json({ message: "Note Deleted!" });
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, user: user._id },
    { title, content },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: "Note not found" });
  return res.json(note);
};
