from .connection import session
from db.db_types.parking_availability_types import ParkingAvailability
from db.db_types.parking_table_types import Parking
import datetime
from sqlalchemy import and_


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
                "status": parking.status,
                "booking_id": parking.booking_id
            }
            for parking in parking_status
        ]        

        return parking_status_list
    except Exception as e:
        print(f"Error: {e}")
        return None
