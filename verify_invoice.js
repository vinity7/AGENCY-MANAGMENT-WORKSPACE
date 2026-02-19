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
        console.log('--- Invoice Verification Test ---');

        // 1. Get a Client ID
        console.log('\n1. Fetching a Client ID...');
        const clientOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/clients',
            method: 'GET',
        };
        const clientRes = await makeRequest(clientOptions);
        if (clientRes.statusCode !== 200) throw new Error('Failed to get clients');
        const clients = JSON.parse(clientRes.body);
        if (clients.length === 0) throw new Error('No clients found');
        const clientId = clients[0]._id;
        console.log(`Using Client ID: ${clientId}`);

        // 2. Get a Project ID
        console.log('\n2. Fetching a Project ID...');
        const projectOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/projects',
            method: 'GET',
        };
        const projectRes = await makeRequest(projectOptions);
        if (projectRes.statusCode !== 200) throw new Error('Failed to get projects');
        const projects = JSON.parse(projectRes.body);
        if (projects.length === 0) throw new Error('No projects found');
        const projectId = projects[0]._id;
        console.log(`Using Project ID: ${projectId}`);

        // 3. Create an Invoice
        console.log('\n3. Creating an Invoice...');
        const invoiceData = JSON.stringify({
            client: clientId,
            project: projectId,
            amount: 1500.00,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
            status: 'Pending'
        });

        const createOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/invoices',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': invoiceData.length
            }
        };

        const createRes = await makeRequest(createOptions, invoiceData);
        console.log(`POST STATUS: ${createRes.statusCode}`);
        console.log(`POST BODY: ${createRes.body}`);

        // 4. Get All Invoices
        console.log('\n4. Fetching All Invoices...');
        const getOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/invoices',
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
