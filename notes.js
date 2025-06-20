const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Note = require('../models/Note'); // Import the Note model

// CREATE a note (POST /api/notes)
router.post('/', async function (req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Both title and content are required',
        received: { title, content }
      });
    }

    const newNote = new Note({ title, content });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({
      error: 'Error creating note',
      details: err.message
    });
  }
});

// READ all notes (GET /api/notes)
router.get('/', async function (req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({
      error: 'Error fetching notes',
      details: err.message
    });
  }
});

// READ a single note by ID (GET /api/notes/:id)
router.get('/:id', async function (req, res) {
  try {
    const noteId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        error: 'Invalid note ID format',
        received: req.params.id
      });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({
      error: 'Error fetching note',
      details: err.message
    });
  }
});

// UPDATE a note by ID (PUT /api/notes/:id)
router.put('/:id', async function (req, res) {
  try {
    const noteId = req.params.id.trim();
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        error: 'Invalid note ID format',
        received: req.params.id
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        error: 'Both title and content are required for update'
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({
      error: 'Error updating note',
      details: err.message
    });
  }
});

// DELETE a note by ID (DELETE /api/notes/:id)
router.delete('/:id', async function (req, res) {
  try {
    const noteId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        error: 'Invalid note ID format',
        received: req.params.id
      });
    }

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      message: 'Note deleted successfully',
      deletedNote: deletedNote
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error deleting note',
      details: err.message
    });
  }
});

module.exports = router;
