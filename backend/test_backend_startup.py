#!/usr/bin/env python3
"""
Test script to run the backend server and see any errors
"""

import sys
import os
import subprocess

# Change to the backend directory
os.chdir(r'C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend')

with open('backend_test_output.txt', 'w') as f:
    f.write("Testing backend server startup...\n")

    try:
        # Test importing the main module first
        from app.main import app
        f.write("✓ Successfully imported app.main\n")
        
        # Test importing the API components
        from app.api.v1.api import api_router
        f.write("✓ Successfully imported API router\n")
        
        # Test importing the config
        from app.core.config import settings
        f.write(f"✓ Successfully imported config - Database URL: {settings.DATABASE_URL}\n")
        
        f.write("All imports successful! The backend should start without issues.\n")
        
    except Exception as e:
        f.write(f"✗ Error: {e}\n")
        import traceback
        f.write(traceback.format_exc())
        sys.exit(1)

print("Backend test completed. Check backend_test_output.txt for details.")