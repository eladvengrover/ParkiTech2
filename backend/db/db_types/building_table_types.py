from sqlalchemy import Column, Integer, String, Float # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore

Base = declarative_base()

class Building(Base):
    __tablename__ = 'buildings'
    
    building_id = Column(Integer, primary_key=True, autoincrement=True)
    building_name = Column(String, nullable=False)
    building_address = Column(String, nullable=False)
    building_address_latitude = Column(Float, nullable=False)
    building_address_longitude = Column(Float, nullable=False)
    manager_id = Column(Integer, nullable=False)
    