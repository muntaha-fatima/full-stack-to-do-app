from app.db.session import engine
from sqlmodel import Session, select
from app.models.user import User

with Session(engine) as session:
    users = session.exec(select(User)).all()
    print(f'Found {len(users)} users')
    for user in users:
        print(f'ID: {user.id}, Username: {user.username}')