const express = require('express');
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

const normalizeLevel = (value) => {
  const parsed = Number(value);
  return [1, 2, 3, 4].includes(parsed) ? parsed : 1;
};

// Create course
router.post('/', async (req, res) => {
	try {
		const payload = { ...req.body, level: normalizeLevel(req.body.level) };
		const course = await Course.create(payload);
		res.status(201).json(course);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// List courses
router.get('/', async (_req, res) => {
	try {
		const courses = await Course.find().sort({ createdAt: -1 });
		res.json(courses);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get course by id
router.get('/:id', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);
		if (!course) return res.status(404).json({ error: 'Not found' });
		res.json(course);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Update course
router.put('/:id', async (req, res) => {
	try {
		const payload = { ...req.body };
		if (payload.level !== undefined) {
			payload.level = normalizeLevel(payload.level);
		}
		const course = await Course.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
		if (!course) return res.status(404).json({ error: 'Not found' });
		res.json(course);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Delete course
router.delete('/:id', async (req, res) => {
	try {
		const result = await Course.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.status(204).send();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Add material to course
router.post('/:id/materials', async (req, res) => {
	try {
		const { title, type, url } = req.body;
		if (!title || !type) return res.status(400).json({ error: 'title and type are required' });
		const course = await Course.findById(req.params.id);
		if (!course) return res.status(404).json({ error: 'Not found' });
		course.materials = course.materials || [];
		course.materials.push({ title, type, url });
		await course.save();
		res.json(course);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Upload material file and attach to course
router.post('/:id/materials/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, type } = req.body;
    if (!req.file) return res.status(400).json({ error: 'file is required' });
    if (!title || !type) return res.status(400).json({ error: 'title and type are required' });
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Not found' });
    const url = `/uploads/${req.file.filename}`;
    course.materials = course.materials || [];
    course.materials.push({ title, type, url });
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete material from course
router.delete('/:id/materials/:materialId', async (req, res) => {
  try {
    const { id, materialId } = req.params;

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: id, 'materials._id': materialId },
      { $pull: { materials: { _id: materialId } } },
      { new: true }
    );

    if (!updatedCourse) {
      const courseExists = await Course.exists({ _id: id });
      return res.status(404).json({ error: courseExists ? 'Material not found' : 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
