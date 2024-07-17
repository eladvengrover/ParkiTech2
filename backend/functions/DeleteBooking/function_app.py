import azure.functions as func
import logging
from ..db.operations import delete_booking

# Configure logging
logging.basicConfig(level=logging.INFO)

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="DeleteBooking")
def DeleteBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing request to DeleteBooking.')

    try:
        req_body = req.get_json()
        delete_booking(req_body['booking_id'])
        logging.info(f"Booking deleted successfully: {req_body}")
        return func.HttpResponse("Booking deleted successfully.", status_code=200)
    except Exception as e:
        logging.error(f"Error in DeleteBooking: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
