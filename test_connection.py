import requests
import sys

def test_backend_connection():
    try:
        print("Testing backend connection...")
        
        # Test the health endpoint
        response = requests.get("http://localhost:8000/health", timeout=10)
        print(f"Health check status: {response.status_code}")
        print(f"Health check response: {response.text}")
        
        # Test the root endpoint
        response = requests.get("http://localhost:8000/", timeout=10)
        print(f"Root endpoint status: {response.status_code}")
        print(f"Root endpoint response: {response.text}")
        
        # Test the API endpoint
        response = requests.get("http://localhost:8000/api/v1/health", timeout=10)
        print(f"API health endpoint status: {response.status_code}")
        print(f"API health response: {response.text}")
        
        print("\nBackend connection test completed.")
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to backend. Is it running on port 8000?")
    except requests.exceptions.Timeout:
        print("ERROR: Timeout while connecting to backend.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_backend_connection()