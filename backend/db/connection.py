from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus

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

encoded_connection_string = quote_plus(connection_string)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={encoded_connection_string}")
Session = sessionmaker(bind=engine)
session = Session()
