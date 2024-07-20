from sqlalchemy import create_engine
from urllib.parse import quote_plus
from models import Base

# Replace with your actual connection string and password
connection_string = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
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

# Create all tables
Base.metadata.create_all(engine)

print("Tables created successfully!")
