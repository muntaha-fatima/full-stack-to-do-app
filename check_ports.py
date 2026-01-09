import socket

def check_port(host, port):
    """Check if a port is open on the given host."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(3)  # 3 second timeout
            result = s.connect_ex((host, port))
            return result == 0
    except Exception:
        return False

def main():
    print("Checking if ports are available:")
    
    # Check if backend port is available
    backend_open = check_port('localhost', 8000)
    print(f"Port 8000 (Backend): {'Available' if backend_open else 'Not available'}")
    
    # Check if frontend port is available
    frontend_open = check_port('localhost', 3000)
    print(f"Port 3000 (Frontend): {'Available' if frontend_open else 'Not available'}")

if __name__ == "__main__":
    main()