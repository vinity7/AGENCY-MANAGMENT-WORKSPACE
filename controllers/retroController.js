const RetroBoard = require('../models/RetroBoard');

// Local keyword analyzer
const analyzeSentiment = (text) => {
    const positive = ['great', 'good', 'well', 'improvement', 'success', 'happy', 'efficient', 'thanks'];
    const negative = ['slow', 'block', 'failed', 'issue', 'problem', 'hard', 'stuck', 'frustrated', 'delay'];
    
    text = text.toLowerCase();
    let score = 0;
    positive.forEach(word => { if (text.includes(word)) score++; });
    negative.forEach(word => { if (text.includes(word)) score--; });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
};

// @desc    Create new retro board
// @route   POST /api/v1/retro/boards
// @access  Private (SM)
exports.createRetroBoard = async (req, res) => {
    try {
        const { sprintId, columns } = req.body;
        const retroBoard = await RetroBoard.create({
            organizationId: req.user.orgId,
            sprintId,
            columns: columns || [
                { title: 'What went well', cards: [] },
                { title: 'What went wrong', cards: [] },
                { title: 'What to improve', cards: [] }
            ]
        });
        res.status(201).json(retroBoard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Post card to retro board
// @route   POST /api/v1/retro/boards/:id/cards
// @access  Private (Team)
exports.postRetroCard = async (req, res) => {
    try {
        const { columnTitle, text, isAnonymous } = req.body;
        const board = await RetroBoard.findById(req.params.id);
        if (!board) return res.status(404).json({ msg: 'Board not found' });

        const column = board.columns.find(c => c.title === columnTitle);
        if (!column) return res.status(404).json({ msg: 'Column not found' });

        column.cards.push({
            text,
            author: isAnonymous ? null : req.user.id,
            isAnonymous,
            sentiment: analyzeSentiment(text)
        });

        await board.save();
        res.json(board);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Convert insight to action item
// @route   POST /api/v1/retro/boards/:id/actions
// @access  Private (PO, SM)
exports.createActionItem = async (req, res) => {
    try {
        const board = await RetroBoard.findById(req.params.id);
        if (!board) return res.status(404).json({ msg: 'Board not found' });

        board.actionItems.push(req.body); // { text, type, status, owner }
        await board.save();

        res.json(board);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Convert action item to backlog task
// @route   POST /api/v1/retro/boards/:id/actions/:actionId/convert
// @access  Private (PO, SM)
exports.convertActionToTask = async (req, res) => {
    try {
        const { projectId } = req.body;
        const Task = require('../models/Task');
        
        const board = await RetroBoard.findById(req.params.id);
        if (!board) return res.status(404).json({ msg: 'Board not found' });

        const actionItem = board.actionItems.id(req.params.actionId);
        if (!actionItem) return res.status(404).json({ msg: 'Action item not found' });

        if (actionItem.linkedTaskId) {
            return res.status(400).json({ msg: 'Task already created for this action item' });
        }

        // Create new task in backlog
        const newTask = new Task({
            name: `[RETRO] ${actionItem.text}`,
            description: `Automated task from Retrospective Action Item. Type: ${actionItem.type}`,
            project: projectId,
            orgId: req.user.orgId,
            status: 'Pending',
            priority: 'Medium'
        });

        const task = await newTask.save();

        // Update action item
        actionItem.status = 'approved';
        actionItem.linkedTaskId = task._id;
        await board.save();

        res.json({ board, task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
