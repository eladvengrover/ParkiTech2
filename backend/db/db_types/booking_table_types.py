from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Booking(Base):
    __tablename__ = 'bookings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    resident_id = Column(Integer, nullable=False)
    guest_name = Column(String, nullable=False)
    guest_car_number = Column(String, nullable=False)
    booking_start = Column(DateTime, nullable=False)
    booking_end = Column(DateTime, nullable=False)
    status = Column(String, nullable=False)
    parking_id = Column(Integer, ForeignKey('Parkings.parking_id'))
