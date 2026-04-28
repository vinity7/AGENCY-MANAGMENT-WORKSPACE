const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const {
    createInitiative,
    getInitiatives,
    convertToBacklog,
    updateInitiative
} = require('../controllers/roadmapController');

router.post('/initiatives', auth, hasPermission('create_initiative'), createInitiative);
router.get('/initiatives', auth, getInitiatives);
router.put('/initiatives/:id', auth, hasPermission('create_initiative'), updateInitiative);
router.post('/initiatives/:id/convert-to-backlog', auth, hasPermission('convert_to_backlog'), convertToBacklog);

module.exports = router;
