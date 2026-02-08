import requests
import json

# Test the chat endpoint
def test_chat():
    # Use user ID 1 (the test user we created) instead of 2
    url = "http://localhost:8001/api/v1/1/chat"
    
    # Use the newly generated valid token for user ID 1
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzA1MzczMDIsInN1YiI6IjEiLCJ0eXBlIjoiYWNjZXNzIn0.5HKlB2LPgw4z3f7_hk9HjhZMHlLtD6m51bPaQ3GJ1vg'
    }
    
    data = {
        "message": "Add task: Buy groceries",
        "conversation_id": None
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Request failed with error: {e}")

if __name__ == "__main__":
    test_chat()