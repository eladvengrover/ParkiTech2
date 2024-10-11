from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Building(Base):
    __tablename__ = 'buildings'
    
    building_id = Column(Integer, primary_key=True, autoincrement=True)
    building_name = Column(String, nullable=False)
    building_address = Column(String, nullable=False)
    building_address_latitude = Column(DECIMAL(9,6), nullable=False)
    building_address_longitude = Column(DECIMAL(9,6), nullable=False)
    manager_id = Column(Integer, nullable=False)
    