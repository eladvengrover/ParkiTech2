from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Parking(Base):
    __tablename__ = 'Parkings'
    parking_id = Column(Integer, primary_key=True)
    location = Column(String)
    # TODO - maybe add direction?