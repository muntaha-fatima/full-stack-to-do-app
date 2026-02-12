#!/usr/bin/env python3
"""
Test script to verify backend API endpoints are working correctly.
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_api_endpoints():
    print("Testing API endpoints...")
    
    # Test health endpoint
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/../health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
    
    # Register a test user
    print("\n2. Testing user registration...")
    try:
        register_data = {
            "email": "testuser@example.com",
            "password": "securepassword123",
            "full_name": "Test User"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Registration: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Registration failed: {e}")
    
    # Login with the test user
    print("\n3. Testing user login...")
    try:
        login_data = {
            "username": "testuser@example.com",
            "password": "securepassword123"
        }
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        print(f"Login: {response.status_code} - {response.json()}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"Access token received: {token_data['access_token'][:20]}...")
            
            # Test protected endpoint
            print("\n4. Testing protected endpoint (me)...")
            headers = {"Authorization": f"Bearer {token_data['access_token']}"}
            response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            print(f"Get user profile: {response.status_code} - {response.json()}")
    
    except Exception as e:
        print(f"Login failed: {e}")

if __name__ == "__main__":
    test_api_endpoints()