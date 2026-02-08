"""
Define model relationships after all models are loaded to avoid circular import issues.
"""

from sqlalchemy.orm import configure_mappers


def setup_relationships():
    """
    Establish relationships between models after all classes are defined.
    This avoids circular import issues during model definition.
    """
    # Configure all mappers
    configure_mappers()


# Call setup_relationships to establish relationships
setup_relationships()