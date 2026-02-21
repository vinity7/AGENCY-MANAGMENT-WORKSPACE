const http = require('http');

const taskId = '699976c4a947c3bcc90e30fd'; // videography task ID
const statusUpdate = JSON.stringify({ status: 'In Progress' });

const options = {
    hostname: 'localhost',
    port: 5001,
    path: `/api/tasks/${taskId}/status`,
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': statusUpdate.length
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(statusUpdate);
req.end();
