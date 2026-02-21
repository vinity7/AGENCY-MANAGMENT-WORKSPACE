`const http = require('http');

function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => { resolve({ statusCode: res.statusCode, body: data }); });
        });
        req.on('error', (e) => { reject(e); });
        req.end();
    });
}

async function runTest() {
    try {
        console.log('--- Dashboard Stats Verification Test ---');

        const options = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/dashboard/stats',
            method: 'GET',
        };

        const res = await makeRequest(options);
        console.log(`STATUS: ${res.statusCode}`);

        if (res.statusCode === 200) {
            const stats = JSON.parse(res.body);
            console.log('Stats received successfully:');
            console.log(JSON.stringify(stats, null, 2));

            if (stats.counts && typeof stats.counts.clients === 'number') {
                console.log('\nPASSED: Dashboard stats are in the correct format.');
            } else {
                console.log('\nFAILED: Stats format is incorrect.');
            }
        } else {
            console.log(`FAILED: Unexpected status code ${res.statusCode}`);
            console.log(`Response: ${res.body}`);
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

runTest();
