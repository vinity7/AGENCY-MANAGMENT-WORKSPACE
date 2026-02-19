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
        console.log('--- Task & User Verification Test ---');

        // 1. Get a Project ID
        console.log('\n1. Fetching a Project ID...');
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

        // 2. Register an Intern
        console.log('\n2. Registering an Intern...');
        const internData = JSON.stringify({
            name: 'John Doe',
            email: 'john' + Date.now() + '@example.com',
            password: 'password123',
            role: 'Intern'
        });

        const registerOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/users/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': internData.length
            }
        };

        const registerRes = await makeRequest(registerOptions, internData);
        console.log(`REGISTER STATUS: ${registerRes.statusCode}`);
        const user = JSON.parse(registerRes.body).user;
        const userId = user.id;
        console.log(`Registered Intern ID: ${userId}`);

        // 3. Create a Task
        console.log('\n3. Creating a Task...');
        const taskData = JSON.stringify({
            name: 'Fix Login Bug',
            description: 'Fix the issue where login fails with 500 error.',
            project: projectId,
            assignedTo: userId,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
            status: 'Pending'
        });

        const createTaskOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/tasks',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': taskData.length
            }
        };

        const taskRes = await makeRequest(createTaskOptions, taskData);
        console.log(`POST STATUS: ${taskRes.statusCode}`);
        console.log(`POST BODY: ${taskRes.body}`);

        // 4. Get All Tasks
        console.log('\n4. Fetching All Tasks...');
        const getTasksOptions = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/tasks',
            method: 'GET',
        };

        const getTasksRes = await makeRequest(getTasksOptions);
        console.log(`GET STATUS: ${getTasksRes.statusCode}`);
        console.log(`GET BODY: ${getTasksRes.body}`);

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

runTest();
