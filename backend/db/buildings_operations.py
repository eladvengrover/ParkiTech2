from .connection import session
from .db_types.building_table_types import Building

def get_buildings_list(manager_id):
    try:
        # Fetch all existing bookings for the given resident_id
        existing_buildings = session.query(Building).filter_by(manager_id=manager_id).all()
        buildings_list = [
            {
                "building_id": building.building_id,
                "building_name": building.building_name,
                "building_address": building.building_address
            }
            for building in existing_buildings
        ]
        return buildings_list
    except Exception as e:
        return None
    
def get_building_locations_list():
    try:
        # Fetch all existing bookings for the given resident_id
        existing_buildings = session.query(Building).all()
        buildings_list = [
            {
                "building_id": building.building_id,
                "building_name": building.building_name,
                "building_address": building.building_address,
                "building_address_latitude": building.building_address_latitude,
                "building_address_longitude": building.building_address_longitude
            }
            for building in existing_buildings
        ]
        return buildings_list
    except Exception as e:
        return None
    