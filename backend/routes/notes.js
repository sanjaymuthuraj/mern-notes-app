const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// @route GET api/notes
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/notes
router.post('/', auth, async (req, res) => {
  const { title, content, color } = req.body;
  try {
    const newNote = new Note({
      title,
      content,
      color: color || '#ffffff',
      user: req.user.id
    });
    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/notes/:id
router.put('/:id', auth, async (req, res) => {
  const { title, content, color } = req.body;
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content, color } },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Note.findByIdAndRemove(req.params.id);
    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
