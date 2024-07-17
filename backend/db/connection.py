from sqlalchemy import create_engine
from urllib.parse import quote_plus

# Replace with your actual connection string and password
connection_string = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=tcp:parkitechserver.database.windows.net,1433;"
    "DATABASE=ParkiTechDB;"
    "UID=parkitechserveradmin;"
    "PWD=Yahel1210;"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
    "Connection Timeout=30;"
)

# URL-encode the connection string
encoded_connection_string = quote_plus(connection_string)

# Create the engine
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={encoded_connection_string}")

def get_engine():
    return engine

# Test the connection
def test_connection():
    try:
        with get_engine().connect() as connection:
            print("Connection to the database was successful!")
    except Exception as e:
        print(f"An error occurred: {e}")

# Test the connection
if __name__ == "__main__":
    test_connection()
