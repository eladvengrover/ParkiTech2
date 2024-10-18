import json
import azure.functions as func # type: ignore
import os
import logging
import time
import io
import re  # Import the regular expressions module
from azure.cognitiveservices.vision.computervision import ComputerVisionClient # type: ignore
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes # type: ignore
from msrest.authentication import CognitiveServicesCredentials # type: ignore
from booking_managment import allocate_and_book_parking, update_booking, remove_booking, get_bookings_details, delete_past_bookings
from db.users_operations import login, is_user_manager, create_new_user, remove_user
from db.booking_operations import search_booking_by_license_plate  # Import the new function
from db.buildings_operations import get_buildings_list, get_building_locations_list
from db.parkings_operations import create_new_parking, get_parkings_statuses, remove_parking, update_parking_details, get_parking_location_and_number, get_parking_building_id

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
            end_time=end_time
        )

        if new_booking_id > 0:
            logging.info(f"Booking created successfully: {req_body}")
            return func.HttpResponse(
                json.dumps({"message": "Booking created successfully", "booking_id": new_booking_id, "parking_id": new_booking_id_parking}),
                status_code=201,
                mimetype="application/json"
            )
        elif new_booking_id == -1:
            return func.HttpResponse(
                json.dumps({"error": "Failed to create booking. Please try again."}),
                status_code=500,
                mimetype="application/json"
            )
        elif new_booking_id == -5:
            return func.HttpResponse(
                json.dumps({"error": "Failed to create booking. No available parking slots."}),
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
            end_time=end_time
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
    building_id = req_body.get('building_id')

    if not username or not password:
        logging.error("Error in CreateNewUser, username/password required.")
        return func.HttpResponse(
            json.dumps({"error": "username/password required"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        new_user_id = create_new_user(username, password, is_manager, building_id)
        if new_user_id != -1:
            return func.HttpResponse(
                body=json.dumps({"user_id": new_user_id, "password": password, "is_manager": is_manager, "building_id": building_id}),
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
    
@app.route(route="GetParkingDirections", auth_level=func.AuthLevel.ANONYMOUS)
def GetParkingDirections(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: GetParkingDirections.')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )

    parking_id = req_body.get('parking_id')
    if not parking_id:
        return func.HttpResponse(
            json.dumps({"error": "parking_id required"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        parking_location_and_number = get_parking_location_and_number(parking_id)
        if parking_location_and_number:
            logging.info(f"Parking location fetched successfully for parking ID: {parking_id}")
            return func.HttpResponse(
                body=json.dumps({
                    "location": parking_location_and_number["location"],  # Access by key
                    "number": parking_location_and_number["parking_number"]  # Access by key
                }),
                status_code=200,
                mimetype="application/json"
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": f"Parking of parking ID {parking_id} not found."}),
                status_code=404,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in GetParkingDirections: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )



@app.route(route="ReadLicensePlate", methods=['POST'], auth_level=func.AuthLevel.ANONYMOUS)
def ReadLicensePlate(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: ReadLicensePlate.')

    try:
        # Get the uploaded image file
        image_file = req.files.get('image')
        if not image_file:
            return func.HttpResponse("Please upload an image file", status_code=400)
        image_data = image_file.stream.read()  # Read the file data

    except Exception as e:
        logging.error(f"Error reading uploaded file: {e}")
        return func.HttpResponse(f"Error reading uploaded file: {e}", status_code=400)

    subscription_key = os.getenv("COMPUTER_VISION_SUBSCRIPTION_KEY")
    endpoint = os.getenv("COMPUTER_VISION_ENDPOINT")

    if not subscription_key or not endpoint:
        return func.HttpResponse("Computer Vision subscription key and endpoint must be set as environment variables.", status_code=500)

    computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

    try:
        # Process the image data
        read_response = computervision_client.read_in_stream(io.BytesIO(image_data), raw=True)
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
                    # Extract only numeric characters
                    numeric_text = ''.join(re.findall(r'\d+', line.text))
                    if numeric_text:
                        booking = search_booking_by_license_plate(numeric_text)
                        if booking:
                            return func.HttpResponse(f"Booking found for license plate {numeric_text}. Parking ID is: {booking.parking_id}", status_code=200)
                        else:
                            return func.HttpResponse(f"No booking found for license plate {numeric_text}", status_code=404)

    except Exception as e:
        logging.error(f"Error processing image: {e}")
        return func.HttpResponse(f"Error processing image: {e}", status_code=500)

    return func.HttpResponse("No license plate found", status_code=404)


@app.route(route="GetParkingsStatuses", auth_level=func.AuthLevel.ANONYMOUS)
def GetParkingsStatuses(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: GetParkingsStatuses.')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )

    building_id = req_body.get('building_id')
    if not building_id:
        return func.HttpResponse(
            json.dumps({"error": "building_id required"}),
            status_code=400,
            mimetype="application/json"
        )
    
    try:
        parkings_statuses = get_parkings_statuses(building_id)
        if parkings_statuses:
            logging.info(f"parking statuses details fetched successfully")
            return func.HttpResponse(
                body=json.dumps(parkings_statuses),
                status_code=200,
                mimetype="application/json"
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": f"Parking statuses not found."}),
                status_code=404,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in GetParkingsStatuses: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
    

@app.route(route="GetBuildingList", auth_level=func.AuthLevel.ANONYMOUS)
def GetBuildingList(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: GetBuildingList.')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )

    manager_id = req_body.get('manager_id')
    if not manager_id:
        return func.HttpResponse(
            json.dumps({"error": "manager_id required"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        buildings_list = get_buildings_list(manager_id)
        if buildings_list:
            logging.info(f"buildings list fetched successfully for manager ID: {manager_id}")
            return func.HttpResponse(
                body=json.dumps(buildings_list),
                status_code=200,
                mimetype="application/json"
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": f"buildings list of manager ID {manager_id} not found."}),
                status_code=404,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in GetBuildingList: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
    
@app.route(route="GetBuildingLocationsList", methods=['GET'], auth_level=func.AuthLevel.ANONYMOUS)
def GetBuildingLocationsList(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: GetBuildingLocationsList.')

    try:
        buildings_list = get_building_locations_list()
        if buildings_list:
            logging.info(f"building locations list list fetched successfully")
            return func.HttpResponse(
                body=json.dumps(buildings_list),
                status_code=200,
                mimetype="application/json"
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": f"building locations list not found."}),
                status_code=404,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in GetBuildingLocationsList: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
    
@app.route(route="GetBuildingIdByParkingId", methods=['POST'], auth_level=func.AuthLevel.ANONYMOUS)
def GetBuildingIdByParkingId(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: GetBuildingIdByParkingId.')

    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )

    parking_id = req_body.get('parking_id')
    if not parking_id:
        return func.HttpResponse(
            json.dumps({"error": "parking_id required"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        building_id = get_parking_building_id(parking_id)
        if building_id:
            logging.info(f"building id fetched successfully for parking ID: {parking_id}")
            return func.HttpResponse(
                body=json.dumps(building_id),
                status_code=200,
                mimetype="application/json"
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": f"building id of parking ID {parking_id} not found."}),
                status_code=404,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in GetBuildingIdByParkingId: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
    
# Timer-triggered function that runs every hour to delete past bookings
@app.function_name(name="DeletePastBookings")
@app.schedule(schedule="0 0 * * * *", arg_name="mytimer", run_on_startup=False, use_monitor=True)
def timer_delete_past_bookings(mytimer: func.TimerRequest) -> None:
    logging.info('Python Timer trigger function ran at: %s', datetime.datetime.now())

    try:
        # Call the function from booking_management
        delete_past_bookings()  # This calls the imported function
    except Exception as e:
        logging.error(f"Error in timer_delete_past_bookings: {e}")


@app.route(route="CreateNewParking", auth_level=func.AuthLevel.ANONYMOUS)
def CreateNewParking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: CreateNewParking')


    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request"}),
            status_code=400,
            mimetype="application/json"
        )


    parking_number = req_body.get('parking_number')
    location = req_body.get('location')
    building_id = req_body.get('building_id')
    is_permanently_blocked = req_body.get('is_permanently_blocked')


    if not parking_number or not location or not building_id:
        logging.error("Error in CreateNewParking, all fields required.")
        return func.HttpResponse(
            json.dumps({"error": "all fields required"}),
            status_code=400,
            mimetype="application/json"
        )


    try:
        new_parking_id = create_new_parking(parking_number, location, building_id, is_permanently_blocked)
        if new_parking_id != -1:
            return func.HttpResponse(
                body=json.dumps({"parking_id": new_parking_id, "parking_number": parking_number, "location": location, "building_id": building_id, "is_permanently_blocked": is_permanently_blocked}),
                status_code=200,
                mimetype="application/json"
            )
        else:
            logging.error("Error in CreateNewParking: some fields are incorrect.")
            return func.HttpResponse(
                json.dumps({"error": "some fields are incorrect"}),
                status_code=403,
                mimetype="application/json"
            )
    except Exception as e:
        logging.error(f"Error in CreateNewParking: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )

@app.route(route="RemoveParking", auth_level=func.AuthLevel.ANONYMOUS)
def RemoveParking(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: RemoveParking.')
    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse("Invalid Request", status_code=404)
    parking_id = req_body.get('parking_id')


    if not parking_id:
        logging.error("Error in RemoveParking, parking id required.")
        return func.HttpResponse("parking id is required", status_code=404)


    try:
        res = remove_parking(parking_id)
        if res != -1:
            logging.info(f"Parking removed successfully: {req_body}")
            return func.HttpResponse("Parking removed successfully.", status_code=200)
        else:
            return func.HttpResponse(f"Parking with ID {parking_id} not found.", status_code=404)
    except Exception as e:
        logging.error(f"Error in RemoveParking: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)

@app.route(route="UpdateParkingDetails", auth_level=func.AuthLevel.ANONYMOUS)
def UpdateParkingDetails(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request: UpdateParkingDetails.')


    try:
        req_body = req.get_json()
        logging.info(req_body)
    except ValueError:
        return func.HttpResponse("Invalid Request", status_code=404)
       
    parking_id = req_body.get('parking_id')


    if not parking_id:
        logging.error("Error in RemoveParking, parking id required.")
        return func.HttpResponse("parking id is required", status_code=404)


    try:
        updated_parking_id = update_parking_details(
            parking_id=parking_id,
            parking_number=req_body['parking_number'],
            location=req_body['location'],
            building_id=req_body['building_id'],
            is_permanently_blocked=req_body['is_permanently_blocked']
        )


        if updated_parking_id:
            logging.info(f"Parking updated successfully: {req_body}")
            return func.HttpResponse("Parking updated successfully.", status_code=200)
        else:
            return func.HttpResponse(f"Parking with ID {parking_id} not found.", status_code=404)
    except Exception as e:
        logging.error(f"Error in UpdateParkingDetails: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
