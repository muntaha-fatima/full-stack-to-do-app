// Simple test to check if the user is authenticated and can access protected endpoints
async function testAuth() {
  // Get the token
  const token = localStorage.getItem('access_token');
  
  console.log('Access token exists:', !!token);
  
  if (!token) {
    console.log('No access token found. User needs to log in.');
    return;
  }
  
  console.log('Testing authentication with token...');
  
  try {
    const response = await fetch('https://shazsabir-to-do-backend.hf.space/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Auth response status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('Authenticated user:', userData);
      
      // Now test the chat endpoint
      console.log('Testing chat endpoint...');
      const chatResponse = await fetch('https://shazsabir-to-do-backend.hf.space/api/v1/' + userData.id + '/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: "test"
        })
      });
      
      console.log('Chat response status:', chatResponse.status);
      
      if (!chatResponse.ok) {
        const errorText = await chatResponse.text();
        console.log('Chat error:', errorText);
      } else {
        const chatData = await chatResponse.json();
        console.log('Chat response:', chatData);
      }
    } else {
      const errorText = await response.text();
      console.log('Auth error:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the test
testAuth();