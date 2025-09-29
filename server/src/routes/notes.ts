import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { createNote, getNotes, deleteNote, updateNote, getNotesById } from "../controllers/notesController";

const router = Router();

router.get("/", authenticate, getNotes);
router.get("/:id", authenticate, getNotesById);
router.post("/", authenticate, createNote);
router.delete("/:id", authenticate, deleteNote);
router.put("/:id", authenticate, updateNote);

export default router;
