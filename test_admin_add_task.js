const http = require('http');

const loginData = JSON.stringify({
    email: 'admin_test@example.com',
    password: 'password123'
});

const loginOptions = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/users/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const loginReq = http.request(loginOptions, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            const token = data.token;
            if (!token) {
                console.log('Login failed:', body);
                return;
            }
            console.log('Logged in. Token received.');

            const taskData = JSON.stringify({
                name: 'Debug Task New Admin',
                description: 'Testing admin add task from fresh account',
                project: '6996c2a066e20ed13a750559',
                assignedTo: '6996d031a69b8478f8f7ad92',
                dueDate: '2026-03-01',
                status: 'Pending',
                priority: 'Medium'
            });

            const taskOptions = {
                hostname: 'localhost',
                port: 5001,
                path: '/api/tasks',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': taskData.length,
                    'x-auth-token': token
                }
            };

            const taskReq = http.request(taskOptions, (res2) => {
                console.log(`Add Task Status: ${res2.statusCode}`);
                let body2 = '';
                res2.on('data', (d) => body2 += d);
                res2.on('end', () => {
                    console.log('Response:', body2);
                });
            });

            taskReq.on('error', (e) => console.error(e));
            taskReq.write(taskData);
            taskReq.end();
        } catch (e) {
            console.error(e);
        }
    });
});

loginReq.on('error', (e) => console.error(e));
loginReq.write(loginData);
loginReq.end();
