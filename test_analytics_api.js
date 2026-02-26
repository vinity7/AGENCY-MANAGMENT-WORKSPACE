const axios = require('axios');

const testAnalytics = async () => {
    try {
        const loginRes = await axios.post('http://localhost:5001/api/users/login', {
            email: 'admin_test@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login successful, token received.');

        const config = {
            headers: { 'x-auth-token': token }
        };

        const prodRes = await axios.get('http://localhost:5001/api/analytics/productivity', config);
        console.log('\nProductivity Data:', JSON.stringify(prodRes.data, null, 2));

        const revRes = await axios.get('http://localhost:5001/api/analytics/revenue', config);
        console.log('\nRevenue Data:', JSON.stringify(revRes.data, null, 2));

        const projRes = await axios.get('http://localhost:5001/api/analytics/projects', config);
        console.log('\nProject Metrics:', JSON.stringify(projRes.data, null, 2));

    } catch (err) {
        console.error('API Test Error:', err.response ? err.response.data : err.message);
    }
};

testAnalytics();
