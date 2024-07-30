from .connection import session
from .db_types.users_table_types import User

def remove_user(username):
    try:
        # Check if the username exists
        existing_user = session.query(User).filter_by(username=username).first()
        
        if not existing_user:
            print(f"Username '{username}' doesn't exist. Please choose a different username.")
            return -1
        
        user_id = existing_user.id
        # If username exists, remove it
        session.delete(existing_user)
        session.commit()
        print(f"User '{username}' has been removed")
        return user_id
    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")
        return -1


def create_new_user(username, password, is_manager):
    try:
        # Check if the username already exists
        existing_user = session.query(User).filter_by(username=username).first()
        
        if existing_user:
            print(f"Username '{username}' already exists. Please choose a different username.")
            return -1
        
        # If username does not exist, create a new user
        new_user = User(
            username=username,
            password=password,
            is_manager=is_manager
        )
        session.add(new_user)
        session.commit()
        print(f"User added with username: {new_user.username}")
        return new_user.id
    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")
        return -1

def update_user_password(username, new_password):
    try:
        # Query the user by username
        user = session.query(User).filter_by(username=username).first()
        
        # If user is found, update the password
        if user:
            user.password = new_password
            session.commit()
            print(f"Password for user '{username}' updated successfully.")
        else:
            print(f"User '{username}' not found.")
    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")


def is_user_manager(username):
    user = session.query(User).filter_by(username=username).first()

    if user:
        return user.is_manager
    else:
        return -1


def login(username, password):
    # Query the user by username and password
    user = session.query(User).filter_by(username=username, password=password).first()
    
    # If user is found and password matches, return True
    if user:
        return user.id  
    else:
        return -1


if __name__ == "__main__":
    create_new_user(
        username="Gur",
        password="123456",
        is_manager=False
    )
    print(login("Elad", "111111"))
    print(login("Elad", "11111e"))
    print(login("Gur", "123456"))