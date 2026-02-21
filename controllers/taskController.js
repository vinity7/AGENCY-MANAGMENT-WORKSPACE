const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin only)
exports.createTask = async (req, res) => {
    try {
        console.log('--- Creating Task ---');
        console.log('User:', req.user);
        console.log('Body:', req.body);

        const { name, description, project, assignedTo, dueDate, status } = req.body;

        const newTask = new Task({
            name,
            description,
            project,
            assignedTo,
            dueDate,
            status,
            priority: req.body.priority || 'Medium',
        });

        const task = await newTask.save();
        console.log('Task saved successfully:', task._id);
        res.status(201).json(task);
    } catch (err) {
        console.error('Create Task Catch Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('project', ['name', 'status'])
            .populate('assignedTo', ['name', 'email'])
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Public
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', ['name', 'status'])
            .populate('assignedTo', ['name', 'email']);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Admin only)
exports.updateTask = async (req, res) => {
    try {
        const { name, description, project, assignedTo, dueDate, status, priority } = req.body;

        const taskFields = {};
        if (name) taskFields.name = name;
        if (description) taskFields.description = description;
        if (project) taskFields.project = project;
        if (assignedTo) taskFields.assignedTo = assignedTo;
        if (dueDate) taskFields.dueDate = dueDate;
        if (status) taskFields.status = status;
        if (priority) taskFields.priority = priority;

        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        await task.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Check if user is Admin or the assignee
        if (req.user.role !== 'Admin' && (!task.assignedTo || task.assignedTo.toString() !== req.user.id)) {
            return res.status(403).json({ msg: 'User not authorized to update this task' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};
