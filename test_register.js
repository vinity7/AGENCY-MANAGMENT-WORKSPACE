const http = require('http');

const data = JSON.stringify({
    name: 'testuser_final',
    email: 'test_final@example.com',
    password: 'password123',
    role: 'Intern'
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/users/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
