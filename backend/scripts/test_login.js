const fetch = require('node-fetch');

async function testLogin() {
  const API_URL = 'http://localhost:5000';
  
  console.log('🧪 Testing Login API\n');
  console.log('URL:', `${API_URL}/api/auth/login`);
  console.log('Email: admin@capsulecorp.com');
  console.log('Password: Admin2025!\n');

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@capsulecorp.com',
        password: 'Admin2025!'
      })
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('\nResponse Body:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Login successful!');
      console.log('Token:', data.token ? data.token.substring(0, 50) + '...' : 'N/A');
      console.log('User:', data.user);
    } else {
      console.log('\n❌ Login failed!');
      console.log('Error:', data.error || data.message);
    }

  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
}

testLogin();
