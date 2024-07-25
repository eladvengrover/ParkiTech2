from datetime import datetime

def adjust_timezone_formatting(time_string):
    # Parse the datetime strings to datetime objects (with timezone awareness)
    start_time = datetime.fromisoformat(time_string.replace("Z", "+03:00"))

    # Convert to naive datetime by removing timezone info
    return start_time.replace(tzinfo=None)