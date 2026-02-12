"""
Validation utilities for authentication
"""
import re
from typing import Dict, List
from pydantic import EmailStr


def validate_password_strength(password: str) -> Dict[str, bool]:
    """
    Validate password strength based on requirements:
    - At least 12 characters
    - Contains uppercase letter
    - Contains lowercase letter
    - Contains number
    - Contains special character
    
    Returns a dictionary with validation results
    """
    validation_result = {
        'length': len(password) >= 12,
        'has_uppercase': bool(re.search(r'[A-Z]', password)),
        'has_lowercase': bool(re.search(r'[a-z]', password)),
        'has_digit': bool(re.search(r'\d', password)),
        'has_special': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password)),
        'is_valid': False
    }
    
    validation_result['is_valid'] = all([
        validation_result['length'],
        validation_result['has_uppercase'],
        validation_result['has_lowercase'],
        validation_result['has_digit'],
        validation_result['has_special']
    ])
    
    return validation_result


def validate_email_format(email: str) -> bool:
    """
    Validate email format using Pydantic's EmailStr
    """
    try:
        EmailStr.validate(email)
        return True
    except Exception:
        return False


def validate_username(username: str) -> Dict[str, bool]:
    """
    Validate username based on requirements:
    - Between 3 and 20 characters
    - Only alphanumeric characters and underscores
    
    Returns a dictionary with validation results
    """
    validation_result = {
        'length': 3 <= len(username) <= 20,
        'valid_chars': bool(re.match(r'^[a-zA-Z0-9_]+$', username)),
        'is_valid': False
    }
    
    validation_result['is_valid'] = validation_result['length'] and validation_result['valid_chars']
    
    return validation_result


def get_password_validation_errors(password: str) -> List[str]:
    """
    Get a list of errors for an invalid password
    """
    result = validate_password_strength(password)
    errors = []
    
    if not result['length']:
        errors.append('Password must be at least 12 characters long')
    if not result['has_uppercase']:
        errors.append('Password must contain at least one uppercase letter')
    if not result['has_lowercase']:
        errors.append('Password must contain at least one lowercase letter')
    if not result['has_digit']:
        errors.append('Password must contain at least one number')
    if not result['has_special']:
        errors.append('Password must contain at least one special character')
    
    return errors


def get_username_validation_errors(username: str) -> List[str]:
    """
    Get a list of errors for an invalid username
    """
    result = validate_username(username)
    errors = []
    
    if not result['length']:
        errors.append('Username must be between 3 and 20 characters')
    if not result['valid_chars']:
        errors.append('Username can only contain letters, numbers, and underscores')
    
    return errors