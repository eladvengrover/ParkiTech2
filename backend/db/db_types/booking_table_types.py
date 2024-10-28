from sqlalchemy import Column, Integer, String, DateTime # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore

Base = declarative_base()

class Booking(Base):
    __tablename__ = 'bookings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    resident_id = Column(Integer, nullable=False) #TODO - rename it as tenant_id
    guest_name = Column(String, nullable=False)
    guest_car_number = Column(String, nullable=False)
    booking_start = Column(DateTime, nullable=False)
    booking_end = Column(DateTime, nullable=False)
    parking_id = Column(Integer, nullable=False)
    # parking_id = Column(Integer, ForeignKey('parkings.parking_id')) 
    # TODO - check the issue with foreign key and enable it!
