from sqlalchemy import Column, Integer, String # type: ignore 
from sqlalchemy.ext.declarative import declarative_base # type: ignore

Base = declarative_base()

class Parking(Base):
    __tablename__ = 'parkings'
    parking_id = Column(Integer, primary_key=True)
    parking_number = Column(Integer)
    location = Column(String)
    building_id = Column(Integer, nullable=False)