const http = require('http');

// Helper to make requests
const makeRequest = (path, method = 'GET', token = '', body = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

const runTest = async () => {
    console.log('--- Testing RBAC Restrictions ---');

    // 1. Try to login as an intern (assuming one exists)
    // For the test, we'll verify if the token is required first

    console.log('\nTest: Accessing clients without token');
    const res1 = await makeRequest('/api/clients');
    console.log('Result:', res1.status, res1.body);

    console.log('\nTest: Updating task status (should fail without token)');
    const res2 = await makeRequest('/api/tasks/699976c4a947c3bcc90e30fd/status', 'PATCH', '', { status: 'Completed' });
    console.log('Result:', res2.status, res2.body);

    console.log('\nNote: Full token-based testing requires a valid login token with role.');
    console.log('The backend code now checks for req.user.role in routes.');
};

runTest();
