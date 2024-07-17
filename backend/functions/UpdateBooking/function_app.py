import azure.functions as func
import logging
from datetime import datetime
from ..db.operations import update_booking

# Configure logging
logging.basicConfig(level=logging.INFO)

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="UpdateBooking")
def UpdateBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing request to UpdateBooking.')

    try:
        req_body = req.get_json()
        update_booking(
            booking_id=req_body['booking_id'],
            resident_id=req_body['resident_id'],
            guest_name=req_body['guest_name'],
            guest_car_number=req_body['guest_car_number'],
            booking_start=datetime.fromisoformat(req_body['booking_start']),
            booking_end=datetime.fromisoformat(req_body['booking_end']),
            status=req_body['status']
        )
        logging.info(f"Booking updated successfully: {req_body}")
        return func.HttpResponse("Booking updated successfully.", status_code=200)
    except Exception as e:
        logging.error(f"Error in UpdateBooking: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
