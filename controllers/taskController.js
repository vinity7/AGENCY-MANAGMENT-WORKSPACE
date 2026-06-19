const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin or Lead)
exports.createTask = async (req, res) => {
    try {
        const { 
            name, description, project, assignedMembers, teamLead, milestones, 
            dueDate, status, priority, reach, impact, confidence, effort 
        } = req.body;

        // Calculate RICE Score
        const r = Number(reach) || 0;
        const i = Number(impact) || 0;
        const c = (Number(confidence) || 0) / 100;
        const e = Number(effort) || 1;
        const riceScore = (r * i * c) / e;

        const newTask = new Task({
            name,
            description,
            project,
            assignedMembers: Array.isArray(assignedMembers) ? assignedMembers : (assignedMembers ? [assignedMembers] : []),
            teamLead,
            milestones: Array.isArray(milestones) ? milestones : [],
            dueDate,
            status,
            priority: priority || 'Medium',
            reach: r,
            impact: i,
            confidence: Number(confidence) || 100,
            effort: e,
            riceScore: riceScore,
            orgId: req.user.orgId,
        });

        const task = await newTask.save();

        // Send Email Notification to Team Lead and Members
        const notifyIdsSet = new Set();
        if (Array.isArray(task.assignedMembers)) {
            task.assignedMembers.forEach(id => notifyIdsSet.add(id.toString()));
        }
        if (teamLead) {
            notifyIdsSet.add(teamLead.toString());
        }

        const notifyIds = Array.from(notifyIdsSet);

        if (notifyIds.length > 0) {
            User.find({ _id: { $in: notifyIds }, orgId: req.user.orgId })
                .then(async (users) => {
                    for (const user of users) {
                        if (user.email) {
                            try {
                                await sendEmail({
                                    email: user.email,
                                    subject: `New Task Assignment: ${name}`,
                                    message: `Hello ${user.name},\n\nYou have been assigned to the task: ${name}.\n\nLead: ${teamLead ? 'Specified' : 'Not assigned'}\nDescription: ${description || 'No description provided'}\nDue Date: ${dueDate || 'N/A'}\n\nPlease check your dashboard to track milestones.`,
                                    html: `
                                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                                            <h2 style="color: #2563eb;">New Task Allocation: ${name}</h2>
                                            <p>Hello <strong>${user.name}</strong>,</p>
                                            <p>You have been added to the execution team for:</p>
                                            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                                <h3 style="margin-top: 0; color: #1e293b;">${name}</h3>
                                                <p style="color: #64748b; font-size: 14px;">${description || 'No additional details.'}</p>
                                                <p style="font-weight: bold; margin-bottom: 0;">Lead Deadline: <span style="color: #e11d48;">${dueDate ? new Date(dueDate).toLocaleDateString() : 'Flexible'}</span></p>
                                            </div>
                                            <p>Progress for this task is tracked via milestones in the workspace.</p>
                                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                                            <small style="color: #94a3b8;">This is an automated notification from Agency Mgr.</small>
                                        </div>
                                    `
                                });
                            } catch (emailErr) {
                                console.error(`Failed to send email to ${user.email}:`, emailErr);
                            }
                        }
                    }
                })
                .catch(err => console.error('Error finding users for notification:', err));
        }

        res.status(201).json(task);
    } catch (err) {
        console.error('Create Task Catch Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// @desc    Get all tasks for the organization
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ orgId: req.user.orgId })
            .populate('project', ['name', 'status'])
            .populate('assignedMembers', ['name', 'email'])
            .populate('teamLead', ['name', 'email'])
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get task by ID within organization
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, orgId: req.user.orgId })
            .populate('project', ['name', 'description', 'status'])
            .populate('assignedMembers', ['name', 'email'])
            .populate('teamLead', ['name', 'email'])
            .populate('feedback.user', ['name', 'role']);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found or access denied' });
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

// @desc    Update task within organization
// @route   PUT /api/tasks/:id
// @access  Private (Admin or Lead)
exports.updateTask = async (req, res) => {
    try {
        const { 
            name, description, project, assignedMembers, teamLead, milestones, 
            dueDate, status, priority, reach, impact, confidence, effort 
        } = req.body;

        let task = await Task.findOne({ _id: req.params.id, orgId: req.user.orgId });
        if (!task) return res.status(404).json({ msg: 'Task not found or access denied' });

        const taskFields = {};
        if (name) taskFields.name = name;
        if (description) taskFields.description = description;
        if (project) taskFields.project = project;
        if (assignedMembers) taskFields.assignedMembers = assignedMembers;
        if (teamLead) taskFields.teamLead = teamLead;
        if (milestones) taskFields.milestones = milestones;
        if (dueDate) taskFields.dueDate = dueDate;
        if (status) taskFields.status = status;
        if (priority) taskFields.priority = priority;

        // RICE Calculation for updates
        if (reach !== undefined) taskFields.reach = Number(reach);
        if (impact !== undefined) taskFields.impact = Number(impact);
        if (confidence !== undefined) taskFields.confidence = Number(confidence);
        if (effort !== undefined) taskFields.effort = Number(effort);

        if (reach !== undefined || impact !== undefined || confidence !== undefined || effort !== undefined) {
            const r = reach !== undefined ? Number(reach) : task.reach;
            const i = impact !== undefined ? Number(impact) : task.impact;
            const c = (confidence !== undefined ? Number(confidence) : task.confidence) / 100;
            const e = effort !== undefined ? Number(effort) : task.effort;
            taskFields.riceScore = (r * i * c) / (e || 1);
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete task within organization
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, orgId: req.user.orgId });
        if (!task) return res.status(404).json({ msg: 'Task not found or access denied' });
        
        await task.deleteOne();
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update task status within organization
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        let task = await Task.findOne({ _id: req.params.id, orgId: req.user.orgId })
            .populate('teamLead assignedMembers');
            
        if (!task) return res.status(404).json({ msg: 'Task not found or access denied' });

        // Admin, Team Lead, or Member can update
        const isMember = task.assignedMembers.some(m => m._id.toString() === req.user.id);
        const isLead = task.teamLead && task.teamLead._id.toString() === req.user.id;

        if (req.user.role !== 'admin' && (!isLead && !isMember)) {
            return res.status(403).json({ msg: 'Not authorized to update status' });
        }

        task.status = status;
        await task.save();
        
        const populatedTask = await Task.findById(task._id)
            .populate('project', ['name', 'description', 'status'])
            .populate('assignedMembers', ['name', 'email'])
            .populate('teamLead', ['name', 'email']);

        res.json(populatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Toggle Milestone Completion
// @route   PATCH /api/tasks/:id/milestones/:milestoneId
// @access  Private
exports.toggleMilestone = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, orgId: req.user.orgId });
        if (!task) return res.status(404).json({ msg: 'Task not found or access denied' });

        const isLead = task.teamLead && task.teamLead.toString() === req.user.id;

        if (req.user.role !== 'admin' && !isLead) {
            return res.status(403).json({ msg: 'Only the Team Lead and Administrators can check milestones.' });
        }

        const milestone = task.milestones.id(req.params.milestoneId);
        if (!milestone) return res.status(404).json({ msg: 'Milestone not found' });

        milestone.completed = !milestone.completed;
        
        const allCompleted = task.milestones.every(m => m.completed);
        if (allCompleted && task.status !== 'Completed') {
            task.status = 'Completed';
        } else if (!allCompleted && task.status === 'Completed') {
            task.status = 'In Progress';
        }

        await task.save();

        const populatedTask = await Task.findById(task._id)
            .populate('project', ['name', 'description', 'status'])
            .populate('assignedMembers', ['name', 'email'])
            .populate('teamLead', ['name', 'email']);

        res.json(populatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
