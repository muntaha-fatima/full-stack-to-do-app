import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))
from backend.app.core.security import create_access_token

token = create_access_token(subject='3')
print(f"Generated token for user ID 3: {token}")