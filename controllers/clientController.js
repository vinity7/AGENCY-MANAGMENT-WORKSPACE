const Client = require('../models/Client');

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (Admin only)
exports.createClient = async (req, res) => {
    try {
        console.log('--- Creating Client ---');
        console.log('User:', req.user);
        console.log('Body:', req.body);

        const { name, email, phone, companyName, address, status } = req.body;

        const newClient = new Client({
            name,
            email,
            phone,
            companyName,
            address,
            status,
        });

        const client = await newClient.save();
        console.log('Client saved successfully:', client._id);
        res.status(201).json(client);
    } catch (err) {
        if (err.code === 11000) {
            console.log('Create Client failed: Email exists');
            return res.status(400).json({ msg: 'Email already exists' });
        }
        console.error('Create Client Catch Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Public
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ msg: 'Client not found' });
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

// @desc    Update client
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

        let client = await Client.findById(req.params.id);

        if (!client) return res.status(404).json({ msg: 'Client not found' });

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

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin only)
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ msg: 'Client not found' });
        }

        await client.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Client removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Client not found' });
        }
        res.status(500).send('Server Error');
    }
};
