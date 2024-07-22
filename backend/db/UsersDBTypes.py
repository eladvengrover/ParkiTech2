from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    is_manager = Column(bool, nullable=False)
    
