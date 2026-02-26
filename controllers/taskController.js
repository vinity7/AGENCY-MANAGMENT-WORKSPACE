const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

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

        // Send Email Notification to Intern
        if (assignedTo) {
            const intern = await User.findById(assignedTo);
            if (intern && intern.email) {
                await sendEmail({
                    email: intern.email,
                    subject: `New Task Assigned: ${name}`,
                    message: `Hello ${intern.name},\n\nYou have been assigned a new task: ${name}.\n\nDescription: ${description || 'No description provided'}\nDue Date: ${dueDate || 'N/A'}\n\nPlease check your dashboard for details.`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #2563eb;">New Task Allocated</h2>
                            <p>Hello <strong>${intern.name}</strong>,</p>
                            <p>You have been assigned a new work token:</p>
                            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #1e293b;">${name}</h3>
                                <p style="color: #64748b; font-size: 14px;">${description || 'No additional details.'}</p>
                                <p style="font-weight: bold; margin-bottom: 0;">Deadline: <span style="color: #e11d48;">${dueDate ? new Date(dueDate).toLocaleDateString() : 'Flexible'}</span></p>
                            </div>
                            <p>Please log in to the Agency Workspace to start working on this task.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                            <small style="color: #94a3b8;">This is an automated notification from Agency Mgr.</small>
                        </div>
                    `
                });
            }
        }

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

        let task = await Task.findById(req.params.id).populate('assignedTo', ['name', 'email']);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Check if user is Admin or the assignee
        if (req.user.role !== 'Admin' && (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)) {
            return res.status(403).json({ msg: 'User not authorized to update this task' });
        }

        const oldStatus = task.status;
        task.status = status;
        await task.save();

        // If status changed to Completed, notify Admin
        if (status === 'Completed' && oldStatus !== 'Completed') {
            const admins = await User.find({ role: 'Admin' });
            for (const admin of admins) {
                if (admin.email) {
                    await sendEmail({
                        email: admin.email,
                        subject: `Task Completed: ${task.name}`,
                        message: `The task "${task.name}" has been marked as completed by ${task.assignedTo?.name || 'an intern'}.`,
                        html: `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                                <h2 style="color: #10b981;">Task Successfully Completed</h2>
                                <p>Hello <strong>${admin.name}</strong>,</p>
                                <p>A task in your agency has been finalized:</p>
                                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #d1fae5;">
                                    <h3 style="margin-top: 0; color: #065f46;">${task.name}</h3>
                                    <p style="color: #065f46; font-size: 14px; margin-bottom: 0;">Completed By: <strong>${task.assignedTo?.name || 'Team Member'}</strong></p>
                                </div>
                                <p>You can now review the deliverables in the project hub.</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                                <small style="color: #94a3b8;">This is an automated notification from Agency Mgr.</small>
                            </div>
                        `
                    });
                }
            }
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
