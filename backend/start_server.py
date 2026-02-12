#!/usr/bin/env python3
"""
Script to start the server and show output
"""

import uvicorn
import sys

if __name__ == "__main__":
    try:
        print("Starting server...")
        uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=False)
        print("Server started successfully!")
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)