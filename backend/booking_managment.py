from db.connection import session
from db.db_types.booking_table_types import Booking
from db.db_types.users_table_types import User
from db.db_types.parking_table_types import Parking
from db.db_types.parking_availability_types import ParkingAvailability
from sqlalchemy import and_

def allocate_parking(resident_id, guest_name, guest_car_number, start_time, end_time, status):
    available_slots = session.query(ParkingAvailability).filter(
        and_(
            ParkingAvailability.status == 'Available',
            ParkingAvailability.start_time <= start_time,
            ParkingAvailability.end_time >= end_time
        )
    ).all()

    best_slot = None

    for slot in available_slots:
        # TODO - add logic to get the best slot. right now it returns the first one.
        best_slot = slot
        break

    if best_slot:
        # Create the new booking
        new_booking = Booking(
            resident_id=resident_id,
            guest_name=guest_name,
            guest_car_number=guest_car_number,
            booking_start=start_time,
            booking_end=end_time,
            status=status,
            parking_id=best_slot.parking_id,
        )
        
        session.add(new_booking)
        session.commit()
        print(f"Booking added with ID: {new_booking.id}")

        # Update the parking slot status
        session.query(ParkingAvailability).filter(ParkingAvailability.availability_id == best_slot.availability_id).update({
            ParkingAvailability.end_time: start_time
        })
        
        new_occupied_slot = ParkingAvailability(
            parking_id=best_slot.parking_id,
            start_time=start_time,
            end_time=end_time,
            status='Occupied',
            booking_id=new_booking.id
        )
        session.add(new_occupied_slot)
        
        # TODO - BUG! this code isnt working! it is not createing the third part :
        if best_slot.end_time > end_time:
            new_available_slot = ParkingAvailability(
                parking_id=best_slot.parking_id,
                start_time=end_time,
                end_time=best_slot.end_time,
                status='Available',
                booking_id=NU
            )
            session.add(new_available_slot)

        session.commit()

        return new_booking.id
    else:
        return None


if __name__ == "__main__":
    from datetime import datetime, timedelta

    allocate_parking(
        resident_id=1,
        guest_name="Elad2",
        guest_car_number="1234XYZ",
        start_time=datetime.now() - timedelta(days=10),
        end_time=datetime.now() - timedelta(days=10) + timedelta(hours=2),
        status="confirmed"
    )

