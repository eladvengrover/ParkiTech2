from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Parking(Base):
    __tablename__ = 'parkings'
    parking_id = Column(Integer, primary_key=True)
    location = Column(String)
    building_id = Column(Integer, nullable=False)
    # TODO - maybe add direction?