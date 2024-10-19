import os
import base64
import json
import logging
from google.oauth2.credentials import Credentials
from google_auth_httplib2 import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# The Gmail API scopes required to send an email
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# Path to your credentials.json file
CREDENTIALS_FILE = 'cred.json'

# Token file for storing access tokens
TOKEN_FILE = 'token.json'


def authenticate_gmail():
    """Authenticate and create a Gmail API service object."""
    creds = None
    # Check if the token file exists and is valid
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # If no valid credentials are found, authenticate with OAuth2
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials for future use
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

