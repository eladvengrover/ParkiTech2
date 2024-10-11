from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(50), nullable=False)
    mail = Column(String(100), nullable=False)
    is_manager = Column(Boolean, nullable=False)
    building_id = Column(Integer, nullable=False) #for managers put 0 value

    
