import azure.functions as func
import logging
from db.booking_operations import add_booking
from booking_managment import allocate_parking
from db.users_operations import login
from datetime import datetime
from helpers import adjust_timezone_formatting


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
        start_time = adjust_timezone_formatting(req_body['booking_start'])
        end_time = adjust_timezone_formatting(req_body['booking_end'])

        allocate_parking(
            resident_id=req_body['resident_id'],
            guest_name=req_body['guest_name'],
            guest_car_number=req_body['guest_car_number'],
            start_time=start_time,
            end_time=end_time,
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
        logging.error(f"Error in UserLogin, username and password required.")
        return func.HttpResponse(f"Error: username and password required", status_code=400)

    try:
        login_result = login(username, password) 
        if login_result:
            return func.HttpResponse("Login successfully.", status_code=200)
        else:
            logging.error(f"Error in UserLogin: username/password are incorrect.")
            return func.HttpResponse(f"Error: username/password are incorrect.", status_code=403)
    except Exception as e:
        logging.error(f"Error in UserLogin: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)