const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testNotifications() {
  console.log('🧪 Testing Notification System...\n');

  try {
    // Step 1: Create a recruiter account
    console.log('1. Creating recruiter account...');
    const recruiterSignup = await axios.post(`${BASE_URL}/auth/signup`, {
      email: 'testrecruiter@example.com',
      password: 'password123',
      role: 'recruiter'
    });
    console.log('✅ Recruiter account created');

    // Step 2: Create a student account
    console.log('2. Creating student account...');
    const studentSignup = await axios.post(`${BASE_URL}/auth/signup`, {
      email: 'teststudent@example.com',
      password: 'password123',
      role: 'student'
    });
    console.log('✅ Student account created');

    // Step 3: Login as recruiter
    console.log('3. Logging in as recruiter...');
    const recruiterLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testrecruiter@example.com',
      password: 'password123'
    });
    const recruiterToken = recruiterLogin.data.token;
    console.log('✅ Recruiter logged in');

    // Step 4: Post a job (this should create notifications)
    console.log('4. Posting a job...');
    const jobPost = await axios.post(`${BASE_URL}/jobs`, {
      title: 'Test Software Engineer',
      company: 'Test Company',
      description: 'This is a test job posting to verify notifications work.'
    }, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    console.log('✅ Job posted successfully');

    // Step 5: Login as student
    console.log('5. Logging in as student...');
    const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'teststudent@example.com',
      password: 'password123'
    });
    const studentToken = studentLogin.data.token;
    console.log('✅ Student logged in');

    // Step 6: Check notifications
    console.log('6. Checking notifications...');
    const notifications = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    if (notifications.data.length > 0) {
      console.log('✅ Notifications found!');
      console.log('📧 Notification message:', notifications.data[0].message);
      console.log('📊 Unread count:', notifications.data.filter(n => !n.read).length);
    } else {
      console.log('❌ No notifications found');
    }

    console.log('\n🎉 Notification test completed!');
    console.log('\nTo test the UI:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Login as teststudent@example.com with password123');
    console.log('3. Look for the notification bell in the top-right corner');
    console.log('4. Click it to see the notification');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testNotifications(); 