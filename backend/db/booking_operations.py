from .connection import session
from .db_types.booking_table_types import Booking

def add_booking_2(new_booking):
    session.add(new_booking)
    session.commit()
    print(f"Booking added with ID: {new_booking.id}")


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


if __name__ == "__main__":
    from datetime import datetime, timedelta

    add_booking(
        resident_id=1,
        guest_name="John Doe",
        guest_car_number="1234XYZ",
        booking_start=datetime.now(),
        booking_end=datetime.now() + timedelta(hours=2),
        status="confirmed"
    )

    delete_booking(6)

    update_booking(4, guest_name="Shahar")
