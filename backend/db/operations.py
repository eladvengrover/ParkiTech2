from .connection import session
from .models import Booking

def add_booking(resident_id, guest_name, guest_car_number, booking_start, booking_end, status):
    new_booking = Booking(
        resident_id=resident_id,
        guest_name=guest_name,
        guest_car_number=guest_car_number,
        booking_start=booking_start,
        booking_end=booking_end,
        status=status
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

def delete_booking(booking_id):
    booking = session.query(Booking).filter_by(id=booking_id).first()
    if booking:
        session.delete(booking)
        session.commit()
        print(f"Booking with ID: {booking_id} deleted.")
    else:
        print(f"Booking with ID: {booking_id} not found.")
