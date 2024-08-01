import json
import azure.functions as func
import os
import requests
import logging
import time
import io
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
from db.booking_operations import add_booking
from booking_managment import allocate_and_book_parking, update_booking, remove_booking, get_bookings_details 
from db.users_operations import login, is_user_manager, create_new_user, remove_user
from datetime import datetime
from helpers import adjust_timezone_formatting


app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="CreateNewBooking", methods=['POST'], auth_level=func.AuthLevel.ANONYMOUS)
def CreateNewBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: CreateNewBooking.')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        start_time = adjust_timezone_formatting(req_body['booking_start'])
        end_time = adjust_timezone_formatting(req_body['booking_end'])

        new_booking_id, new_booking_id_parking = allocate_and_book_parking(
            resident_id=req_body['resident_id'],
            guest_name=req_body['guest_name'],
            guest_car_number=req_body['guest_car_number'],
            start_time=start_time,
            end_time=end_time,
            status=req_body['status']
        )

        if new_booking_id != -1:
            logging.info(f"Booking created successfully: {req_body}")
            return func.HttpResponse(
                json.dumps({"message": "Booking created successfully", "booking_id": new_booking_id, "parking_id": new_booking_id_parking}),
                status_code=201,
                mimetype="application/json"
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": "Failed to create booking. Please try again."}),
                status_code=500,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in CreateNewBooking: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )



@app.route(route="RemoveBooking", auth_level=func.AuthLevel.ANONYMOUS)
def RemoveBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: RemoveBooking.')

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
        booking_id = req_body['booking_id']
        
        if remove_booking(booking_id):
            logging.info(f"Booking removed successfully: {req_body}")
            return func.HttpResponse("Booking removed successfully.", status_code=200)
        else:
            return func.HttpResponse(f"Booking with ID {booking_id} not found.", status_code=404)
    except Exception as e:
        logging.error(f"Error in RemoveBooking: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)


@app.route(route="UpdateBooking", auth_level=func.AuthLevel.ANONYMOUS)
def UpdateBooking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: UpdateBooking.')

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
        booking_id = req_body['booking_id']
        start_time = adjust_timezone_formatting(req_body['booking_start'])
        end_time = adjust_timezone_formatting(req_body['booking_end'])

        updated_booking_id = update_booking(
            booking_id=booking_id,
            resident_id=req_body['resident_id'],
            guest_name=req_body['guest_name'],
            guest_car_number=req_body['guest_car_number'],
            start_time=start_time,
            end_time=end_time,
            status=req_body['status']
        )

        if updated_booking_id:
            logging.info(f"Booking updated successfully: {req_body}")
            return func.HttpResponse("Booking updated successfully.", status_code=200)
        else:
            return func.HttpResponse(f"Booking with ID {booking_id} not found.", status_code=404)
    except Exception as e:
        logging.error(f"Error in UpdateBooking: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)


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
        logging.error("Error in UserLogin, username and password required.")
        return func.HttpResponse(
            json.dumps({"error": "username and password required"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        login_result = login(username, password)
        if login_result != -1:
            return func.HttpResponse(
                body=json.dumps({"tenant_id": login_result, "is_manager": is_user_manager(username)}),
                status_code=200,
                mimetype="application/json"
            )
        else:
            logging.error("Error in UserLogin: username/password are incorrect.")
            return func.HttpResponse(
                json.dumps({"error": "username/password are incorrect"}),
                status_code=403,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in UserLogin: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
    

@app.route(route="CreateNewUser", auth_level=func.AuthLevel.ANONYMOUS)
def CreateNewUser(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: CreateNewUser')

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
    is_manager = req_body.get('is_manager')

    if not username or not password:
        logging.error("Error in CreateNewUser, username/password required.")
        return func.HttpResponse(
            json.dumps({"error": "username/password required"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        new_user_id = create_new_user(username, password, is_manager)
        if new_user_id != -1:
            return func.HttpResponse(
                body=json.dumps({"user_id": new_user_id, "password": password, "is_manager": is_manager}),
                status_code=200,
                mimetype="application/json"
            )
        else:
            logging.error("Error in CreateNewUser: username/password are incorrect.")
            return func.HttpResponse(
                json.dumps({"error": "username/password are incorrect"}),
                status_code=403,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in CreateNewUser: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
    


@app.route(route="RemoveUser", auth_level=func.AuthLevel.ANONYMOUS)
def RemoveUser(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: RemoveUser')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse("Invalid Request", status_code=404)

    username = req_body.get('username')

    if not username:
        logging.error("Error in RemoveUser, username required.")
        return func.HttpResponse("Username is required", status_code=404)

    try:
        removed_user_id = remove_user(username)
        if removed_user_id != -1:
            return func.HttpResponse("User removed successfully.", status_code=200)
        else:
            logging.error("Error in RemoveUser: username is incorrect.")
            return func.HttpResponse("Username is incorrect", status_code=404)
    except Exception as e:
        logging.error(f"Error in RemoveUser: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
    


@app.route(route="GetBookingsDetails", auth_level=func.AuthLevel.ANONYMOUS)
def GetBookingsDetails(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: GetBookingsDetails.')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )

    resident_id = req_body.get('resident_id')
    if not resident_id:
        return func.HttpResponse(
            json.dumps({"error": "resident_id required"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        bookings_details = get_bookings_details(resident_id)
        if bookings_details:
            logging.info(f"Bookings details fetched successfully for resident ID: {resident_id}")
            return func.HttpResponse(
                body=json.dumps(bookings_details),
                status_code=200,
                mimetype="application/json"
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": f"Bookings of resident ID {resident_id} not found."}),
                status_code=404,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in GetBookingsDetails: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
    
@app.route(route="ReadLicensePlate", methods=['POST'], auth_level=func.AuthLevel.ANONYMOUS)
def ReadLicensePlate(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: ReadLicensePlate.')

    try:
        req_body = req.get_json()
        logging.info(f"Request body: {req_body}")
    except ValueError:
        return func.HttpResponse("Invalid request body", status_code=400)

    image_url = req_body.get('image_url')
    if not image_url:
        return func.HttpResponse("Please pass an image URL in the request body", status_code=400)

    subscription_key = "1436a286283042e4bae9b93e90faf495"
    endpoint = "https://platerecognition.cognitiveservices.azure.com/"



    if not subscription_key or not endpoint:
        return func.HttpResponse("Computer Vision subscription key and endpoint must be set as environment variables.", status_code=500)

    computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image_data = io.BytesIO(response.content)  # Convert bytes to a file-like object
    except Exception as e:
        logging.error(f"Error fetching image from URL: {e}")
        return func.HttpResponse(f"Error fetching image from URL: {e}", status_code=500)

    try:
        read_response = computervision_client.read_in_stream(image_data, raw=True)
        read_operation_location = read_response.headers["Operation-Location"]
        operation_id = read_operation_location.split("/")[-1]

        while True:
            read_result = computervision_client.get_read_result(operation_id)
            if read_result.status not in ['notStarted', 'running']:
                break
            time.sleep(1)

        if read_result.status == OperationStatusCodes.succeeded:
            for text_result in read_result.analyze_result.read_results:
                for line in text_result.lines:
                    logging.info(f"Extracted text from image: {line.text}")
                    return func.HttpResponse(f"Extracted text from image: {line.text}", status_code=200)

    except Exception as e:
        logging.error(f"Error processing image: {e}")
        return func.HttpResponse(f"Error processing image: {e}", status_code=500)

    return func.HttpResponse("No license plate found", status_code=404)