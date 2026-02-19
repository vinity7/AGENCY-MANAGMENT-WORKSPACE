const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Public
exports.createProject = async (req, res) => {
    try {
        const { name, client, description, startDate, endDate, status } = req.body;

        const newProject = new Project({
            name,
            client,
            description,
            startDate,
            endDate,
            status,
        });

        const project = await newProject.save();
        res.status(201).json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
    try {
        // Populate client details (name and email)
        const projects = await Project.find()
            .populate('client', ['name', 'email'])
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('client', ['name', 'email']);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Public
exports.updateProject = async (req, res) => {
    try {
        const { name, client, description, startDate, endDate, status } = req.body;

        const projectFields = {};
        if (name) projectFields.name = name;
        if (client) projectFields.client = client;
        if (description) projectFields.description = description;
        if (startDate) projectFields.startDate = startDate;
        if (endDate) projectFields.endDate = endDate;
        if (status) projectFields.status = status;

        let project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ msg: 'Project not found' });

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: projectFields },
            { new: true }
        );

        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Public
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        await project.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};
