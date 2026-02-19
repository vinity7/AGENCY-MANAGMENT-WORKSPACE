const http = require('http');

// Helper to make requests
function makeRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: data });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

async function runTest() {
    try {
        console.log('--- Project Verification Test ---');

        // 1. Get a Client ID first
        console.log('\n1. Fetching a Client ID...');
        const clientOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/clients',
            method: 'GET',
        };
        const clientRes = await makeRequest(clientOptions);
        if (clientRes.statusCode !== 200) {
            throw new Error(`Failed to get clients. Status: ${clientRes.statusCode}`);
        }
        const clients = JSON.parse(clientRes.body);
        if (clients.length === 0) {
            throw new Error('No clients found. Please run verify_client.js first to create a client.');
        }
        const clientId = clients[0]._id;
        console.log(`Using Client ID: ${clientId}`);

        // 2. Create a Project
        console.log('\n2. Creating a Project...');
        const projectData = JSON.stringify({
            name: 'Website Redesign',
            client: clientId,
            description: 'Redesigning the corporate website.',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
            status: 'In Progress'
        });

        const createOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/projects',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': projectData.length
            }
        };

        const createRes = await makeRequest(createOptions, projectData);
        console.log(`POST STATUS: ${createRes.statusCode}`);
        console.log(`POST BODY: ${createRes.body}`);

        // 3. Get All Projects
        console.log('\n3. Fetching All Projects...');
        const getOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/projects',
            method: 'GET',
        };

        const getRes = await makeRequest(getOptions);
        console.log(`GET STATUS: ${getRes.statusCode}`);
        console.log(`GET BODY: ${getRes.body}`);

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

runTest();
