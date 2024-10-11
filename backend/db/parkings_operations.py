from .connection import session
from db.db_types.parking_availability_types import ParkingAvailability
from db.db_types.parking_table_types import Parking
import datetime
from sqlalchemy import and_ # type: ignore



def get_parkings_statuses(building_id):
    try:
        now = datetime.datetime.now()
        
        # Querying ParkingAvailability with a join on Parking table to filter by building_id
        parking_status = session.query(ParkingAvailability).join(
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
                "status": ParkingAvailability.status,
                "booking_id": parking.booking_id
            }
            for parking in parking_status
        ]        

        return parking_status_list
    except Exception as e:
        print(f"Error: {e}")
        return None


def get_parking_location_and_number(parking_id):
    try:
        # Querying Parking and filtering by parking_id
        parking_record = session.query(Parking).filter(Parking.parking_id == parking_id).one_or_none()

        if parking_record:
            # Return a dictionary with location and parking_number
            return {"location": parking_record.location, "parking_number": parking_record.parking_number}
        else:
            print(f"No parking found for parking ID: {parking_id}")
            return None
    except Exception as e:
        print(f"Error retrieving parking location and number: {e}")
        return None
