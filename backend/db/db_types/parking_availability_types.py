from sqlalchemy import Column, Integer, String, DateTime # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore

Base = declarative_base()

class ParkingAvailability(Base):
    __tablename__ = 'parking_availability'

    availability_id = Column(Integer, primary_key=True, autoincrement=True)
    parking_id = Column(Integer, nullable=False)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String)
    booking_id = Column(Integer, nullable=True)
