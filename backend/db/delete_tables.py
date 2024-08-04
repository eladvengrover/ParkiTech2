from sqlalchemy import create_engine, MetaData
from urllib.parse import quote_plus

# Define connection string and encode it
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
encoded_connection_string = quote_plus(connection_string)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={encoded_connection_string}")

# Drop all tables
metadata = MetaData()
metadata.reflect(bind=engine)
metadata.drop_all(bind=engine)

print("All tables dropped successfully!")
