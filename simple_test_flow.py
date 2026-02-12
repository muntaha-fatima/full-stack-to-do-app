import requests
import json

def test_task_flow():
    url = "http://localhost:8001/api/v1/1/chat"
    
    # Use a valid token
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzA1NDcxMzYsInN1YiI6IjEiLCJ0eXBlIjoiYWNjZXNzIn0.VIlgyTgz3R9TPXqFIaeVyWIfU4nXW0cuifeAmB-ejg0'
    }
    
    # Step 1: Add a task
    print("Step 1: Adding a task...")
    data = {
        "message": "Add task: Test task for verification",
        "conversation_id": None
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Add task response: {response.status_code}")
    if response.status_code == 200:
        response_data = response.json()
        print(f"Add task success: {len(response_data['response'])} characters returned")
    
    # Step 2: List tasks to see the ID
    print("\nStep 2: Listing tasks...")
    data = {
        "message": "Show my tasks",
        "conversation_id": None
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"List tasks response: {response.status_code}")
    if response.status_code == 200:
        response_data = response.json()
        print(f"List tasks success: {len(response_data['response'])} characters returned")
    
    # Step 3: Try to complete a task (we'll assume it gets ID 1 or 2)
    print("\nStep 3: Completing task 1...")
    data = {
        "message": "Complete task 1",
        "conversation_id": None
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Complete task response: {response.status_code}")
    if response.status_code == 200:
        response_data = response.json()
        print(f"Complete task success: {len(response_data['response'])} characters returned")

if __name__ == "__main__":
    test_task_flow()