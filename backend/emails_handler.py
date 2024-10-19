import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from googleapiclient.errors import HttpError

from emails_auth import authenticate_gmail


def create_message(sender, to, subject, body):
    """Create a MIME message for sending."""
    message = MIMEMultipart()
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    message.attach(MIMEText(body, 'plain'))

    # Encode the message as base64
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw_message}


def send_email(service, sender, to, subject, body):
    """Send an email using the Gmail API."""
    try:
        message = create_message(sender, to, subject, body)
        message_sent = service.users().messages().send(userId="me", body=message).execute()
        print(f"Message sent successfully! Message ID: {message_sent['id']}")
    except HttpError as error:
        print(f"An error occurred: {error}")

def send_email_wrapper(to_email, message):
    try:
        # Authenticate with Gmail API
        service = authenticate_gmail()

        # Email details
        sender_email = 'parkitect7@gmail.com'
        recipient_email = to_email
        email_subject = 'Your guest has arrived!'
        email_body = message

        # Send the email
        send_email(service, sender_email, recipient_email, email_subject, email_body)

        return {"response": "ok"}

    except Exception as e:
        print(f"Error: {e}")
        return {"response": "error"}
