const http = require('http');

const postData = JSON.stringify({
    name: 'Test Client',
    email: 'test' + Date.now() + '@example.com',
    phone: '1234567890',
    companyName: 'Test Co',
    address: '123 Main St'
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/clients',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};

console.log('Sending POST request...');
const req = http.request(options, (res) => {
    console.log(`POST STATUS: ${res.statusCode}`);
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`POST BODY: ${data}`);

        console.log('Sending GET request...');
        http.get('http://localhost:5001/api/clients', (res) => {
            console.log(`GET STATUS: ${res.statusCode}`);
            let getData = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                getData += chunk;
            });
            res.on('end', () => {
                console.log(`GET BODY: ${getData}`);
            });
        }).on('error', (e) => {
            console.error(`GET Error: ${e.message}`);
        });
    });
});

req.on('error', (e) => {
    console.error(`POST Error: ${e.message}`);
});

req.write(postData);
req.end();
