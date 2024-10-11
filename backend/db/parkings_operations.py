from .connection import session
from db.db_types.parking_availability_types import ParkingAvailability
from db.db_types.parking_table_types import Parking
from db.db_types.booking_table_types import Booking
import datetime
from booking_managment import remove_bookings_by_parking_id
from sqlalchemy import and_
from sqlalchemy.orm.exc import NoResultFound



def get_parkings_statuses(building_id):
    try:
        now = datetime.datetime.now()
        
        # Querying ParkingAvailability with a join on Parking table to filter by building_id
        parking_status = session.query(
                ParkingAvailability.parking_id,
                ParkingAvailability.status,
                ParkingAvailability.booking_id,
                Parking.parking_number,
                Parking.is_permanently_blocked
            ).join(
            Parking, ParkingAvailability.parking_id == Parking.parking_id
        ).filter(
            and_(
                ParkingAvailability.start_time <= now,
                ParkingAvailability.end_time >= now,
                Parking.building_id == building_id
            )
        ).all()

        # Creating the list of parking statuses
        parking_status_list = [
            {
                "parking_id": parking.parking_id,
                "status": parking.status,
                "booking_id": parking.booking_id,
                "parking_number": parking.parking_number,
                "is_permanently_blocked": parking.is_permanently_blocked
            }
            for parking in parking_status
        ]        

        return parking_status_list
    except Exception as e:
        print(f"Error: {e}")
        return None

def update_parking_details(parking_id, parking_number, location, building_id, is_permanently_blocked):
    try:
        existing_parking = session.query(Parking).filter_by(id=parking_id).one()

        # Part isn't relevant for current basic flow
        # old_is_permanently_blocked_val = existing_parking.is_permanently_blocked

        existing_parking.parking_id = parking_id
        existing_parking.parking_number = parking_number
        existing_parking.location = location
        existing_parking.building_id = building_id
        existing_parking.is_permanently_blocked = is_permanently_blocked
        session.commit()

        # Part isn't relevant for current basic flow
        #if (old_is_permanently_blocked_val == False and is_permanently_blocked):
            #remove_bookings_by_parking_id(parking_id)

        return existing_parking.id
    except NoResultFound:
        return -1

def remove_parking(parking_id):
    try:
        # Check if the username exists
        existing_parking = session.query(Parking).filter_by(parking_id=parking_id).first()
        
        if not existing_parking:
            print(f"Parking ID '{parking_id}' doesn't exist. Please choose a different parking.")
            return -1        
        session.delete(existing_parking)
        session.commit()

        remove_bookings_by_parking_id(parking_id)
        print(f"Parking '{parking_id}' has been removed")

        existing_parking = session.query(ParkingAvailability).filter_by(parking_id=parking_id).first()
        if not existing_parking:
            print(f"Parking ID '{parking_id}' doesn't exist. Please choose a different parking.")
            return -1        
        session.delete(existing_parking)
        session.commit()

        return parking_id
    
    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")
        return -1
    
