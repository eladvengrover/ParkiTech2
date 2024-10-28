from booking_managment import remove_bookings_by_parking_id
from .connection import session
from db.db_types.parking_availability_types import ParkingAvailability
from db.db_types.parking_table_types import Parking
import datetime
from sqlalchemy import and_
from sqlalchemy.orm.exc import NoResultFound
import logging
from sqlalchemy import and_ # type: ignore
from sqlalchemy.orm.exc import NoResultFound # type: ignore

TIMEZONE_HOURS_OFFSET = 2;


def get_parkings_statuses(building_id):
    try:
        now = datetime.datetime.now() + datetime.timedelta(hours=TIMEZONE_HOURS_OFFSET)
        
        # Querying ParkingAvailability with a join on Parking table to filter by building_id
        parking_status = session.query(
                ParkingAvailability.parking_id,
                ParkingAvailability.status,
                ParkingAvailability.booking_id,
                Parking.location,
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
                "location": parking.location,
                "parking_number": parking.parking_number,
                "is_permanently_blocked": parking.is_permanently_blocked
            }
            for parking in parking_status
        ]        

        return parking_status_list
    except Exception as e:
        logging.info(f"Error: {e}")
        return None


def get_parking_location_and_number(parking_id):
    try:
        # Querying Parking and filtering by parking_id
        parking_record = session.query(Parking).filter(Parking.parking_id == parking_id).one_or_none()

        if parking_record:
            # Return a dictionary with location and parking_number
            return {"location": parking_record.location, "parking_number": parking_record.parking_number}
        else:
            logging.info(f"No parking found for parking ID: {parking_id}")
            return None
    except Exception as e:
        logging.info(f"Error retrieving parking location and number: {e}")
        return None
    
def get_parking_building_id(parking_id):
    try:
        # Querying Parking and filtering by parking_id
        parking_record = session.query(Parking).filter(Parking.parking_id == parking_id).one_or_none()

        if parking_record:
            # Return building_id
            return parking_record.building_id
        else:
            logging.info(f"No parking found for parking ID: {parking_id}")
            return None
    except Exception as e:
        logging.info(f"Error retrieving parking's building ID: {e}")
        return None


def create_new_parking(parking_number, location, building_id, is_permanently_blocked):
    try:
        new_parking = Parking(
            parking_number=parking_number,
            location=location,
            building_id=building_id,
            is_permanently_blocked=is_permanently_blocked
        )
        session.add(new_parking)
        session.commit()
        new_parking_availability = ParkingAvailability(
            parking_id=new_parking.parking_id,
            start_time=datetime.datetime(2024,10,1,00,00,00),
            end_time=datetime.datetime(2124,10,1,00,00,00),
            status="Available"
        )
        session.add(new_parking_availability)
        session.commit()
        print(f"Parking added with parking ID: {new_parking.parking_id}")
        return new_parking.parking_id
    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")
        return -1
    is_permanently_blocked = Column(Boolean, default=False)



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

        existing_parking = session.query(ParkingAvailability).filter_by(parking_id=parking_id).all()
        for parking_slot in existing_parking:
            session.delete(parking_slot)
            session.commit()
        return parking_id
   
    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")
        return -1


def update_parking_details(parking_id, parking_number, location, building_id, is_permanently_blocked):
    try:
        existing_parking = session.query(Parking).filter_by(parking_id=parking_id).one()


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


        return existing_parking.parking_id
    except NoResultFound:
        return -1

