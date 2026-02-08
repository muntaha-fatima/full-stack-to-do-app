import requests
import json

# Test different task operations
def test_task_operations():
    url = "http://localhost:8001/api/v1/1/chat"
    
    # Use a valid token
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzA1NDA1NjgsInN1YiI6IjEiLCJ0eXBlIjoiYWNjZXNzIn0.djgP2pXoonsbUNAGAm6DZpQVA_fobnMnlWT-JVGnqCg'
    }
    
    # Test cases
    test_cases = [
        {"message": "Add task: Buy groceries", "description": "Add task"},
        {"message": "Complete task 1", "description": "Complete task"},
        {"message": "Update task 1: Buy groceries and milk", "description": "Update task"},
        {"message": "Delete task 1", "description": "Delete task"},
        {"message": "Show my tasks", "description": "List tasks"}
    ]
    
    for test_case in test_cases:
        print(f"\n--- Testing: {test_case['description']} ---")
        print(f"Message: {test_case['message']}")
        
        data = {
            "message": test_case["message"],
            "conversation_id": None
        }
        
        try:
            response = requests.post(url, headers=headers, json=data)
            print(f"Response Status Code: {response.status_code}")
            if response.status_code == 200:
                response_data = response.json()
                print(f"Response: {response_data['response'][:100]}...")
            else:
                print(f"Error Response: {response.text}")
        except Exception as e:
            print(f"Request failed with error: {e}")

if __name__ == "__main__":
    test_task_operations()