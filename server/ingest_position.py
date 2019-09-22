import warnings

from entity import InputEntity

from database import execute_update_params, query_first_row

from ingest_common import get_realm_ids, PLAYER_TYPE


def ingest_position_data(events):
    # Despite us explicitly having "ignore' in our queries, MySQL thinks we want warnings for inserting duplicate rows
    # Suppress this because it's stupid and we don't care
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")

        realm_ids = get_realm_ids(events)

        enter_events(events, realm_ids)


def create_entities(new_events, realm_name_to_id):
    entities = set()  # Remove duplicates

    # Each event has up to 5 entities. Source (player that is playing), killer, victim, and a possible pet owner if the victim or killer was a pet
    for event in new_events:
        # Source
        input_entity = InputEntity({
            'name': event['sourcePlayer'],
            'entityType': PLAYER_TYPE,
            'additionalData': event['sourcePlayerData'],
            'realm': event['realm']
        })
        entities.add(input_entity)

    for entity in entities:
        insert_entity(entity, realm_name_to_id)


def insert_entity(entity, realm_name_to_id):
    realm_id = realm_name_to_id[entity.realm]

    sql_args = {
        'name': entity.name,
        'entity_type': PLAYER_TYPE,
        'realm_id': realm_id,
        'race': getattr(entity, 'race_id', 0),
        'gender': getattr(entity, 'gender_id', 0),
        'class': getattr(entity, 'class_id', 0),
        'source_player': True
    }

    execute_update_params("""
         INSERT INTO game_entity (`name`, `entity_type`, `realm_id`, `race`, `gender`, `class`, `owner_id`, `source_player`) 
           VALUES (:name, :entity_type, :realm_id, :race, :gender, :class, :owner_id, :source_player)
           ON DUPLICATE KEY UPDATE `source_player` = case when `source_player` = True then `source_player` else :source_player end
           """, sql_args)


def enter_events(new_events, realm_name_to_id):
    for event in new_events:
        realm_id = realm_name_to_id[event['realm']]

        source_player = query_first_row(
            "SELECT * FROM game_entity WHERE `name` = :name AND entity_type = 1 AND realm_id = :realm_id", {
                'name': event['sourcePlayer'],
                'realm_id': realm_id
            })

        sql_args = {
            'source_player_id': source_player['id'],
            'event_time': event['timestamp'],
            'movement_type': event['movementType'],
            'is_instance': event['isInstance'],
            'zone_id': event['mapId']
        }

        db_result = execute_update_params("""
            INSERT IGNORE INTO position_event (`source_player_id`, `event_time`, `movement_type`, `is_instance`) 
                VALUES (:source_player_id, FROM_UNIXTIME(:event_time), :movement_type, :is_instance)""", sql_args)

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
             INSERT INTO position_coordinates (`event_id`, `zone_id`, `x`, `y`) 
                 VALUES (:event_id, :zone_id, :x, :y)""", sql_args)
