from database import execute_update_params, query_many

PLAYER_TYPE = 1
PET_TYPE = 3

def get_realm_ids(new_events):
    realm_names = set()  # Remove duplicates
    for event in new_events:
        realm_names.add(event['realm'])

    # Make sure new there is an entry for all of our stuff
    for name in realm_names:
        execute_update_params("INSERT IGNORE INTO realm (`name`) VALUES (:name)", {'name': name})

    # Now that we know that there are records, grab them out and hold them in memory
    realm_name_and_id = query_many("SELECT id, name FROM realm")
    realm_name_to_id = {}
    for entry in realm_name_and_id:
        realm_name_to_id[entry['name']] = entry['id']

    return realm_name_to_id


