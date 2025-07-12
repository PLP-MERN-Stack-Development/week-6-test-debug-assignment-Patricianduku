const Bug = require('../models/Bug');

exports.getBugs = async (req, res) => {
    try {
        const bugs = await Bug.find();
        res.json(bugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBug = async (req, res) => {
    const { title, description } = req.body;
    const bug = new Bug({ title, description });
    try {
        const savedBug = await bug.save();
        res.status(201).json(savedBug);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBug = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedBug = await Bug.findByIdAndUpdate(id, { status }, { new: true });
        res.json(updatedBug);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBug = async (req, res) => {
    const { id } = req.params;
    try {
        await Bug.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
