from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ParkingAvailability(Base):
    __tablename__ = 'ParkingAvailability'

    availability_id = Column(Integer, primary_key=True)
    parking_id = Column(Integer, ForeignKey('parkings.parking_id'))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String)
    booking_id = Column(Integer, ForeignKey('bookings.booking_id'), nullable=True)