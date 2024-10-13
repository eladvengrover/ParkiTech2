from sqlalchemy import Column, Integer, String, DateTime # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore

Base = declarative_base()

class ParkingAvailability(Base):
    __tablename__ = 'parking_availability'

    availability_id = Column(Integer, primary_key=True, autoincrement=True)
    parking_id = Column(Integer, nullable=False)
    # parking_id = Column(Integer, ForeignKey('parkings.parking_id'))
    # TODO - check the issue with foreign key and enable it!
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String) #TODO - consider if needs both status and booking ID
    booking_id = Column(Integer, nullable=True)
    # booking_id = Column(Integer, ForeignKey('bookings.booking_id'), nullable=True)
    # TODO - check the issue with foreign key and enable it!