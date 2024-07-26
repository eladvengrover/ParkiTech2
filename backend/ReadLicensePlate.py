import logging
import os
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
import azure.functions as func
import time

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    subscription_key = "1436a286283042e4bae9b93e90faf495"
    endpoint = "https://platerecognition.cognitiveservices.azure.com/"
    image_folder = os.path.join(os.path.dirname(__file__), '../images')

    computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

    # Iterate over images in the folder
    for image_name in os.listdir(image_folder):
        if image_name.endswith(".jpg") or image_name.endswith(".png"):
            image_path = os.path.join(image_folder, image_name)
            with open(image_path, "rb") as image_stream:
                read_response = computervision_client.read_in_stream(image_stream, raw=True)
            
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
                        logging.info(f"Extracted text from {image_name}: {line.text}")
                        return func.HttpResponse(f"Extracted text from {image_name}: {line.text}", status_code=200)

    return func.HttpResponse("No license plate found", status_code=404)
