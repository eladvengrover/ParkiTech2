from datetime import datetime, timedelta
from .connection import session
from .db_types.booking_table_types import Booking

def add_booking(resident_id, guest_name, guest_car_number, booking_start, booking_end):
    new_booking = Booking(
        resident_id=resident_id,
        guest_name=guest_name,
        guest_car_number=guest_car_number,
        booking_start=booking_start,
        booking_end=booking_end
    )
    session.add(new_booking)
    session.commit()
    print(f"Booking added with ID: {new_booking.id}")

def update_booking(booking_id, **kwargs):
    booking = session.query(Booking).filter_by(id=booking_id).first()
    if booking:
        for key, value in kwargs.items():
            setattr(booking, key, value)
        session.commit()
        print(f"Booking with ID: {booking_id} updated.")
    else:
        print(f"Booking with ID: {booking_id} not found.")

def search_booking_by_license_plate(license_plate):
    current_time = datetime.now() + timedelta(hours=3)
    booking = session.query(Booking).filter_by(guest_car_number=license_plate).filter(
        Booking.booking_start <= current_time,
        Booking.booking_end >= current_time
    ).first()
    return booking

def delete_booking(booking_id):
    booking = session.query(Booking).filter_by(id=booking_id).first()
    if booking:
        session.delete(booking)
        session.commit()
        print(f"Booking with ID: {booking_id} deleted.")
    else:
        print(f"Booking with ID: {booking_id} not found.")


if __name__ == "__main__":
    from datetime import datetime, timedelta

    add_booking(
        resident_id=1,
        guest_name="John Doe",
        guest_car_number="1234XYZ",
        booking_start=datetime.now(),
        booking_end=datetime.now() + timedelta(hours=2)
    )

    delete_booking(6)

    update_booking(4, guest_name="Shahar")
