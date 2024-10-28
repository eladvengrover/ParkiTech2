from db.connection import session
from db.db_types.booking_table_types import Booking
from db.db_types.parking_availability_types import ParkingAvailability
from db.db_types.users_table_types import User
from db.db_types.parking_table_types import Parking

from sqlalchemy import and_
from sqlalchemy.orm.exc import NoResultFound

import datetime
import logging

TIMEZONE_HOURS_OFFSET = 2;

def update_parking_availability_after_Create(parking_id, start_time, end_time, booking_id):
    slot_contain_new_booking = session.query(ParkingAvailability).filter(
        and_(
            ParkingAvailability.parking_id == parking_id,
            ParkingAvailability.start_time <= start_time,
            ParkingAvailability.end_time >= end_time,
            ParkingAvailability.status == 'Available',
            ParkingAvailability.booking_id == None
        )
    ).first()
    
    if slot_contain_new_booking:
        if slot_contain_new_booking.start_time < start_time:
            new_available_slot = ParkingAvailability(
                parking_id=parking_id,
                start_time=slot_contain_new_booking.start_time,
                end_time=start_time,
                status='Available',
                booking_id=None
            )
            session.add(new_available_slot)
            slot_contain_new_booking.start_time = start_time

        if slot_contain_new_booking.end_time > end_time:
            new_available_slot = ParkingAvailability(
                parking_id=parking_id,
                start_time=end_time,
                end_time=slot_contain_new_booking.end_time,
                status='Available',
                booking_id=None
            )
            session.add(new_available_slot)
            slot_contain_new_booking.end_time = end_time

        slot_contain_new_booking.booking_id = booking_id
        slot_contain_new_booking.status = 'Occupied'
    
    session.commit()

def update_parking_availability_after_delete(parking_id, start_time, end_time, booking_id):
    slot_contain_booking = session.query(ParkingAvailability).filter(
        ParkingAvailability.booking_id == booking_id
    ).first()
    slot_before_booking = session.query(ParkingAvailability).filter(
        and_(
            ParkingAvailability.parking_id == parking_id,
            ParkingAvailability.end_time == start_time
        )
    ).first()
    slot_after_booking = session.query(ParkingAvailability).filter(
        and_(
            ParkingAvailability.parking_id == parking_id,
            ParkingAvailability.start_time == end_time
        )
    ).first()

    if slot_before_booking and slot_before_booking.status == 'Available' and slot_after_booking and slot_after_booking.status == 'Available':
        slot_before_booking.end_time = slot_after_booking.end_time
        session.commit()
        session.delete(slot_after_booking)
        session.delete(slot_contain_booking)
    elif slot_before_booking and slot_before_booking.status == 'Available':
        slot_before_booking.end_time = end_time
        session.commit()
        session.delete(slot_contain_booking)
    elif slot_after_booking and slot_after_booking.status == 'Available':
        slot_after_booking.start_time = start_time
        session.commit()
        session.delete(slot_contain_booking)
    else:
        slot_contain_booking.status = 'Available'
        slot_contain_booking.booking_id = None
        session.commit()

    session.commit()


def create_booking(resident_id, guest_name, guest_car_number, start_time, end_time, parking_id):
    new_booking = Booking(
        resident_id=resident_id,
        guest_name=guest_name,
        guest_car_number=guest_car_number,
        booking_start=start_time,
        booking_end=end_time,
        parking_id=parking_id,
    )
    session.add(new_booking)
    session.commit()
    update_parking_availability_after_Create(parking_id, start_time, end_time, new_booking.id)
    return new_booking.id

def find_best_parking(available_parkings, start_time, end_time):
    """
    Finds the best available slot based on minimizing gaps between bookings.
    """
    best_parking_id = -1
    min_gap = float('inf')

    for parking in available_parkings:
        # Calculate the gap before and after the requested time
        pre_free_time = (start_time - parking.start_time).total_seconds()
        post_free_time = (parking.end_time - end_time).total_seconds()
        gap = pre_free_time + post_free_time
        # Update the best slot based on the smallest gap
        if gap < min_gap:
            best_parking_id = parking.parking_id
            min_gap = gap
    return best_parking_id


def allocate_and_book_parking(resident_id, guest_name, guest_car_number, start_time, end_time):
    # Step 1: Fetch the resident's building ID
    resident = session.query(User).filter_by(id=resident_id).first()

    if not resident:
        return (-1, -1)
    
    building_id = resident.building_id

    # Step 2: Join ParkingAvailability and Parking tables to filter by building_id
    available_parkings = session.query(ParkingAvailability).join(
        Parking, ParkingAvailability.parking_id == Parking.parking_id
    ).filter(
        and_(
            ParkingAvailability.status == 'Available',
            ParkingAvailability.start_time <= start_time,
            ParkingAvailability.end_time >= end_time,
            Parking.building_id == building_id,
            Parking.is_permanently_blocked == False
        )
    ).all()

    if not available_parkings:
        return (-5, -1)  # Return -5 if no available parkings found

    best_parking = find_best_parking(available_parkings, start_time, end_time)

    if best_parking != -1:
        new_booking_id = create_booking(resident_id, guest_name, guest_car_number, start_time, end_time, best_parking)
        return (new_booking_id, best_parking) 
    else:
        return (-1, -1)

def update_booking(booking_id, resident_id, guest_name, guest_car_number, start_time, end_time):
    try:
        # Fetch the existing booking
        existing_booking = session.query(Booking).filter_by(id=booking_id).one()
        start_time += datetime.timedelta(hours=TIMEZONE_HOURS_OFFSET)
        end_time += datetime.timedelta(hours=TIMEZONE_HOURS_OFFSET)
        # Check if start_time or end_time has changed
        if existing_booking.booking_start != start_time or existing_booking.booking_end != end_time:
            # Delete the existing booking
            remove_booking(booking_id)

            # Create a new booking with the updated details
            new_booking_id = allocate_and_book_parking(
                resident_id=resident_id,
                guest_name=guest_name,
                guest_car_number=guest_car_number,
                start_time=start_time,
                end_time=end_time
            )
            return new_booking_id
        else:
            # Update the existing booking details without changing times
            existing_booking.resident_id = resident_id
            existing_booking.guest_name = guest_name
            existing_booking.guest_car_number = guest_car_number
            session.commit()
            return existing_booking.id
    except NoResultFound:
        return -1

def remove_bookings_by_user_id(user_id):
    try:
        # Fetch all bookings associated with the given user ID
        existing_bookings = session.query(Booking).filter_by(resident_id=user_id).all()
        
        # Iterate over the bookings and remove each one
        for booking in existing_bookings:
            remove_booking(booking.id)
        
        session.commit()  # Commit the transaction
        logging.info(f"All bookings for user ID {user_id} have been removed.")
    
    except Exception as e:
        session.rollback()  # Roll back the transaction in case of error
        logging.info(f"An error occurred while removing bookings for user ID {user_id}: {e}")

def remove_bookings_by_parking_id(parking_id):
    try:
        # Fetch all bookings associated with the given parking ID
        existing_bookings = session.query(Booking).filter_by(parking_id=parking_id).all()
        
        # Iterate over the bookings and remove each one
        for booking in existing_bookings:
            remove_booking(booking.id)
            
        session.commit()  # Commit the transaction
        print(f"All bookings for parking ID {parking_id} have been removed.")
    
    except Exception as e:
        session.rollback()  # Roll back the transaction in case of error
        print(f"An error occurred while removing bookings for parking ID {parking_id}: {e}")


def remove_booking(booking_id):
    try:
        # Fetch the existing booking
        existing_booking = session.query(Booking).filter_by(id=booking_id).one()

        existing_booking_parking_id = existing_booking.parking_id
        existing_booking_start_time = existing_booking.booking_start
        existing_booking_end_time = existing_booking.booking_end   

        # Delete the existing booking
        session.delete(existing_booking)
        session.commit()

        # Update ParkingAvailability table
        update_parking_availability_after_delete(
            parking_id=existing_booking_parking_id,
            start_time=existing_booking_start_time,
            end_time=existing_booking_end_time,
            booking_id=booking_id
        )

        return True
    except NoResultFound:
        return False


def get_bookings_details(resident_id):
    try:
        existing_bookings = session.query(
            Booking.id,
            Booking.guest_car_number,
            Booking.guest_name,
            Booking.booking_start,
            Booking.booking_end,
            Parking.parking_number,
            Parking.parking_id
            ).join(Parking, Booking.parking_id == Parking.parking_id).filter(
            and_(Booking.resident_id == resident_id)).all()
        bookings_list = [
            {
                "guest_name": booking.guest_name,
                "id": booking.id,
                "vehicle_number": booking.guest_car_number,
                "start_date_time": booking.booking_start.isoformat(),
                "end_date_time": booking.booking_end.isoformat(),
                "parking_number": booking.parking_number,
                "parking_id":booking.parking_id
            }
            for booking in existing_bookings
        ]
        return bookings_list
    except Exception as e:
        return None
    
def delete_past_bookings():
    current_time = datetime.datetime.now() + datetime.timedelta(hours=TIMEZONE_HOURS_OFFSET)  # Adjust for your timezone
    logging.info(f"Current time: {current_time}")

    try:
        past_bookings = session.query(Booking).filter(Booking.booking_end < current_time).all()
        logging.info(f"Past bookings found: {len(past_bookings)}")

        if past_bookings:
            for booking in past_bookings:
                remove_booking(booking_id=booking.id)  # Assuming remove_booking is another function
                logging.info(f"Deleted booking with ID: {booking.id} - End time was {booking.booking_end}")
        else:
            logging.info("No past bookings found.")
    except Exception as e:
        logging.error(f"Error querying or deleting past bookings: {e}")
    
    

if __name__ == "__main__":
    allocate_and_book_parking(
        resident_id=1,
        guest_name="Elad2",
        guest_car_number="1234XYZ",
        start_time=datetime.datetime.now() + datetime.timedelta(days=1),
        end_time=datetime.datetime.now() + datetime.timedelta(days=1) + datetime.timedelta(hours=TIMEZONE_HOURS_OFFSET)

    )

def search_booking_by_license_plate(license_plate):
    current_time = datetime.now() + datetime.timedelta(hours=TIMEZONE_HOURS_OFFSET)
    booking = session.query(Booking).filter_by(guest_car_number=license_plate).filter(
        Booking.booking_start <= current_time,
        Booking.booking_end >= current_time
    ).first()
    return booking

def remove_bookings_by_parking_id(parking_id):
    try:
        # Fetch all bookings associated with the given parking ID
        existing_bookings = session.query(Booking).filter_by(parking_id=parking_id).all()
       
        # Iterate over the bookings and remove each one
        for booking in existing_bookings:
            remove_booking(booking.id)
           
        session.commit()  # Commit the transaction
        print(f"All bookings for parking ID {parking_id} have been removed.")
   
    except Exception as e:
        session.rollback()  # Roll back the transaction in case of error
        print(f"An error occurred while removing bookings for parking ID {parking_id}: {e}")
