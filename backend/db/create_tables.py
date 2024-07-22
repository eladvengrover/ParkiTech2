from sqlalchemy import create_engine, Column, Integer, Boolean, String, MetaData, Table
from urllib.parse import quote_plus
from .users_table_types import Base

# Define connection string and encode it
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

Base.metadata.create_all(engine)


print("Table created successfully!")
