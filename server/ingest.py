import warnings

from entity import InputEntity

from database import query_many, execute_update_params, query_first_row
import hashlib

PLAYER_TYPE = 1
PET_TYPE = 3

def ingest_events(events):
    # Despite us explicitly having "ignore' in our queries, MySQL thinks we want warnings for inserting duplicate rows
    # Suppress this because it's stupid and we don't care
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")

        realm_ids = get_realm_ids(events)
        kill_source_ids = get_kill_source_ids(events)
        get_entity_ids(events, realm_ids)

        enter_events(events, realm_ids, kill_source_ids)


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


def get_entity_ids(new_events, realm_name_to_id):
    entities = set()  # Remove duplicates

    # Each event has up to 5 entities. Source (player that is playing), killer, victim, and a possible pet owner if the victim or killer was a pet
    for event in new_events:
        # Source
        input_entity = InputEntity({
            'name': event['sourcePlayer'],
            'entityType': PLAYER_TYPE,
            'petOwner': None,
            'additionalData': event['sourcePlayerData'],
            'realm': event['realm'],
            'source_player': True
        })
        entities.add(input_entity)

        # Pet Owners (do them first so they are guaranteed created before we insert the pet's record)
        if 'killerPetOwner' in event:
            input_entity = InputEntity({
                'name': event['killerPetOwner'],
                'entityType': PLAYER_TYPE,
                'petOwner': None,
                'additionalData': event.get('killerPetOwnerPlayerData', None),
                'realm': event['realm']
            })
            entities.add(input_entity)

        if 'victimPetOwner' in event:
            input_entity = InputEntity({
                'name': event['victimPetOwner'],
                'entityType': PLAYER_TYPE,
                'petOwner': None,
                'additionalData': event.get('victimPetOwnerPlayerData', None),
                'realm': event['realm']
            })
            entities.add(input_entity)

        # Killer
        input_entity = InputEntity({
            'name': event['killerName'],
            'entityType': event['killerType'],
            'petOwner': event.get('killerPetOwner'),
            'additionalData': event.get('killerPlayerData'),
            'realm': event['realm']
        })
        entities.add(input_entity)

        # Victim
        input_entity = InputEntity({
            'name': event['victimName'],
            'entityType': event['victimType'],
            'petOwner': event.get('victimPetOwner'),
            'additionalData': event.get('victimPlayerData'),
            'realm': event['realm']
        })
        entities.add(input_entity)

    pets = set()
    non_pets = set()

    for entity in entities:
        if entity.pet_owner is None:
            non_pets.add(entity)
        else:
            pets.add(entity)

    for entity in non_pets:
        insert_entity(entity, realm_name_to_id)
    for entity in pets:
        insert_entity(entity, realm_name_to_id)


def insert_entity(entity, realm_name_to_id):
    realm_id = realm_name_to_id[entity.realm]
    # We only care about the realm ID if it's a player or a pet (aka entity_type 1 or 3). Otherwise it doesn't matter what realm something is on
    if entity.entity_type is not PLAYER_TYPE and entity.entity_type is not PET_TYPE:
        realm_id = 0

    owner_id = 0

    if entity.pet_owner is not None:
        owner = query_first_row(
            "SELECT * FROM game_entity WHERE name = :name AND entity_type = 1 AND realm_id = :realmId", {
                'name': entity.pet_owner,
                'realmId': realm_id
            })
        owner_id = owner['id']

    sql_args = {
        'name': entity.name,
        'entity_type': entity.entity_type,
        'realm_id': realm_id,
        'race': getattr(entity, 'race_id', 0),
        'gender': getattr(entity, 'gender_id', 0),
        'class': getattr(entity, 'class_id', 0),
        'owner_id': owner_id,
        'source_player': entity.source_player
    }

    execute_update_params("""
         INSERT INTO game_entity (`name`, `entity_type`, `realm_id`, `race`, `gender`, `class`, `owner_id`, `source_player`) 
           VALUES (:name, :entity_type, :realm_id, :race, :gender, :class, :owner_id, :source_player)
           ON DUPLICATE KEY UPDATE `source_player` = case when `source_player` = True then `source_player` else :source_player end
           """, sql_args)


def get_kill_source_ids(new_events):
    kill_source_names = set()  # Remove duplicates
    for event in new_events:
        kill_source_names.add(event['killSource'])

    # Make sure new there is an entry for all of our stuff
    for name in kill_source_names:
        execute_update_params("INSERT IGNORE INTO kill_source (`name`) VALUES (:name)", {'name': name})

    # Now that we know that there are records, grab them out and hold them in memory
    kill_source_and_id = query_many("SELECT id, name FROM kill_source")
    kill_source_to_id = {}
    for entry in kill_source_and_id:
        kill_source_to_id[entry['name']] = entry['id']

    return kill_source_to_id


def enter_events(new_events, realm_name_to_id, kill_source_name_to_id):
    for event in new_events:
        realm_id = realm_name_to_id[event['realm']]

        source_player = query_first_row(
            "SELECT * FROM game_entity WHERE `name` = :name AND entity_type = 1 AND realm_id = :realm_id", {
                'name': event['sourcePlayer'],
                'realm_id': realm_id
            })

        killer_owner_id = 0
        if 'killerPetOwner' in event:
            killer_owner = query_first_row(
                "SELECT * FROM game_entity WHERE name = :name AND entity_type = 1 AND realm_id = :realm_id AND owner_id = 0",
                {
                    'name': event['killerPetOwner'],
                    'realm_id': realm_id
                })
            killer_owner_id = killer_owner['id']

        killer = query_first_row(
            "SELECT * FROM game_entity WHERE name = :name AND entity_type = :entity_type AND realm_id = :realm_id AND owner_id = :owner_id",
            {
                'name': event['killerName'],
                'entity_type': event['killerType'],
                'realm_id': 0 if event['killerType'] is not PLAYER_TYPE and event[
                    'killerType'] is not PET_TYPE else realm_id,
                'owner_id': killer_owner_id
            })

        victim_owner_id = 0
        if 'victimPetOwner' in event:
            victim_owner = query_first_row(
                "SELECT * FROM game_entity WHERE name = :name AND entity_type = 1 AND realm_id = :realm_id AND owner_id = 0",
                {
                    'name': event['victimPetOwner'],
                    'realm_id': realm_id
                })
            victim_owner_id = victim_owner['id']

        victim = query_first_row(
            "SELECT * FROM game_entity WHERE name = :name AND entity_type = :entity_type AND realm_id = :realm_id AND owner_id = :owner_id",
            {
                'name': event['victimName'],
                'entity_type': event['victimType'],
                'realm_id': 0 if event['victimType'] is not PLAYER_TYPE and event[
                    'victimType'] is not PET_TYPE else realm_id,
                'owner_id': victim_owner_id
            })

        event_hash = hashlib.sha256(event['killerId'] + event['victimId'] + event['sourcePlayer'] + event['realm'] + str(event['timestamp']))

        # noinspection PyBroadException
        try:
            sql_args = {
                'source_player_id': source_player['id'],
                'source_player_level': event['sourceLevel'],
                'killer_id': killer['id'],
                'killer_level': event.get('killerLevel', -1),
                'victim_id': victim['id'],
                'victim_level': event.get('victimLevel', -1),
                'kill_source_id': kill_source_name_to_id[event['killSource']],
                'zone_id': event['mapId'],
                'is_instance': event['isInstance'],
                'event_time': event['timestamp'],
                'realm_id': realm_id,
                'event_hash': event_hash.hexdigest()
            }

            db_result = execute_update_params("""
            INSERT IGNORE INTO kill_event (`source_player_id`, `killer_id`, `victim_id`, `zone_id`, `is_instance`, `kill_source_id`, 
                                           `killer_level`, `victim_level`, `source_player_level`, `event_time`, `realm_id`, `event_hash`) 
                VALUES (:source_player_id, :killer_id, :victim_id, :zone_id, :is_instance, :kill_source_id, 
                                           :killer_level, :victim_level, :source_player_level, FROM_UNIXTIME(:event_time), :realm_id, :event_hash)
                                           """,
                                          sql_args)
        except Exception as e:
            print 'Failed to insert record. Storing in error table and continuing'
            print e
            print event

            execute_update_params("""INSERT INTO error_events (`event_data`, `reason`) VALUES (:event_data, :reason)""",
                                  { 'event_data': str(event), 'reason': str(e) })
            continue


        event_id = db_result.lastrowid

        # If it's 0 then we are inserting a row which already exists and need not insert coordinates
        if event_id == 0:
            print 'Duplicate row inserted from: ' + event['sourcePlayer'] + ' at event time: ' + str(event['timestamp'])
            continue

        insert_event_coordinates(event, event_id)


def insert_event_coordinates(event, event_id):
    # Could have been in a dungeon and not had any coordinates
    if 'coordinates' not in event:
        return

    for coordinates in event['coordinates']:
        sql_args = {
            'event_id': event_id,
            'zone_id': coordinates['mapId'],
            'x': coordinates['x'],
            'y': coordinates['y'],
        }
        execute_update_params("""
             INSERT INTO event_coordinates (`event_id`, `zone_id`, `x`, `y`) 
                 VALUES (:event_id, :zone_id, :x, :y)""", sql_args)
