const Client = require('../models/Client');

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (Admin only)
exports.createClient = async (req, res) => {
    try {
        const { name, email, phone, companyName, address, status } = req.body;

        const newClient = new Client({
            name,
            email,
            phone,
            companyName,
            address,
            status,
            orgId: req.user.orgId, // Mandatory for multi-tenancy
        });

        const client = await newClient.save();
        res.status(201).json(client);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        console.error('Create Client Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// @desc    Get all clients for the organization
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({ orgId: req.user.orgId }).sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get client by ID within organization
// @route   GET /api/clients/:id
// @access  Private
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, orgId: req.user.orgId });

        if (!client) {
            return res.status(404).json({ msg: 'Client not found or access denied' });
        }

        res.json(client);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Client not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update client within organization
// @route   PUT /api/clients/:id
// @access  Private (Admin only)
exports.updateClient = async (req, res) => {
    try {
        const { name, email, phone, companyName, address, status } = req.body;

        const clientFields = {};
        if (name) clientFields.name = name;
        if (email) clientFields.email = email;
        if (phone) clientFields.phone = phone;
        if (companyName) clientFields.companyName = companyName;
        if (address) clientFields.address = address;
        if (status) clientFields.status = status;

        let client = await Client.findOne({ _id: req.params.id, orgId: req.user.orgId });

        if (!client) return res.status(404).json({ msg: 'Client not found or access denied' });

        client = await Client.findByIdAndUpdate(
            req.params.id,
            { $set: clientFields },
            { new: true }
        );

        res.json(client);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Client not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete client within organization
// @route   DELETE /api/clients/:id
// @access  Private (Admin only)
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, orgId: req.user.orgId });

        if (!client) {
            return res.status(404).json({ msg: 'Client not found or access denied' });
        }

        await client.deleteOne();

        res.json({ msg: 'Client removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Client not found' });
        }
        res.status(500).send('Server Error');
    }
};
