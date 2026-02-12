import requests
import json

# Test the backend API connection
def test_backend_connection():
    try:
        # Test the root endpoint
        response = requests.get("http://localhost:8001/")
        print(f"Backend connection test: Status {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Test the health endpoint
        health_response = requests.get("http://localhost:8001/health")
        print(f"Health check: Status {health_response.status_code}")
        print(f"Health response: {health_response.json()}")
        
        # Test CORS for different origins
        origins_to_test = [
            "http://localhost:3000",
            "http://localhost:3001", 
            "http://localhost:8000",
            "http://0.0.0.0:3000",
            "http://0.0.0.0:3001",
            "http://0.0.0.0:8000",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:8000"
        ]
        
        for origin in origins_to_test:
            cors_test = requests.options("http://localhost:8001/api/v1/test", headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "X-Requested-With"
            })
            print(f"CORS preflight test for {origin}: Status {cors_test.status_code}")
            if 'Access-Control-Allow-Origin' in cors_test.headers:
                print(f"  Allowed origin: {cors_test.headers['Access-Control-Allow-Origin']}")
            else:
                print(f"  No 'Access-Control-Allow-Origin' header found for {origin}")
        
        return True
    except Exception as e:
        print(f"Connection test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing backend connection...")
    test_backend_connection()