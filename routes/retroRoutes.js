const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    createRetroBoard,
    postRetroCard,
    createActionItem,
    convertActionToTask
} = require('../controllers/retroController');

router.post('/boards', auth, hasPermission('create_retro'), createRetroBoard);
router.post('/boards/:id/cards', auth, hasPermission('post_retro_card'), postRetroCard);
router.post('/boards/:id/actions', auth, hasPermission('create_action_item'), createActionItem);
router.post('/boards/:id/actions/:actionId/convert', auth, hasPermission('create_action_item'), convertActionToTask);

module.exports = router;
