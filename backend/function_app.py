import azure.functions as func
import logging
from db.operations import add_booking
from db.users_operations import login
from datetime import datetime


app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="CreateNewBooking")
def CreateNewBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: CreateNewBooking.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
            logging.info(req_body)
        except ValueError:
            pass
    else:
        name = req_body.get('name')

    try:
        add_booking(
            resident_id=req_body['resident_id'],
            guest_name=req_body['guest_name'],
            guest_car_number=req_body['guest_car_number'],
            booking_start=datetime.fromisoformat(req_body['booking_start']),
            booking_end=datetime.fromisoformat(req_body['booking_end']),
            status=req_body['status']
        )
        logging.info(f"Booking created successfully: {req_body}")
        return func.HttpResponse("Booking created successfully.", status_code=201)
    except Exception as e:
        logging.error(f"Error in CreateNewBooking: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)


@app.route(route="RemoveBooking", auth_level=func.AuthLevel.ANONYMOUS)
def RemoveBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="UpdateBooking", auth_level=func.AuthLevel.ANONYMOUS)
def UpdateBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="UserLogin", auth_level=func.AuthLevel.ANONYMOUS)
def UserLogin(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: UserLogin')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )

    username = req_body.get('username')
    password = req_body.get('password')

    if not username or not password:
        logging.info("case 1")
        logging.error(f"Error in UserLogin, username and password required: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=400)

    if login(username, password):
        logging.info("case 2")
        return func.HttpResponse("Login successfully.", status_code=200)
    else:
        logging.info("case 3")
        logging.error(f"Error in UserLogin: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)