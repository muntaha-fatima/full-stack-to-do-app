import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))

from app.core.security import create_access_token

# Create a token for user ID 1 (the test user we just created)
token = create_access_token(subject=1)
print(f"Generated token for user ID 1: {token}")