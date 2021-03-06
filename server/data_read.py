from database import query_many, query_many_params, execute_update_params, query_first_row

def read_kill_events(map_id, is_instance, source_player_id, event_limit):
    source_filter = ""
    args = {
        'zone_id': map_id,
        'limit': event_limit
    }

    if source_player_id is not None:
        args['source_player_id'] = source_player_id
        source_filter = "AND source_player_id = :source_player_id"

    if is_instance:
        return query_many_params("""
             SELECT * 
             FROM kill_event
             WHERE zone_id = :zone_id
             {}
             ORDER BY ke.event_time DESC
             LIMIT :limit
        """.format(source_filter), args)
    else:
        return query_many_params("""
              SELECT ec.*, ke.*, 
                ge1.name AS killer_name, ge1.entity_type AS killer_type, ge1.race AS killer_race, ge1.class AS killer_class, ge1.gender AS killer_gender,
                ge2.name AS victim_name, ge2.entity_type AS victim_type, ge2.race AS victim_race, ge2.class AS victim_class, ge2.gender AS victim_gender
              FROM event_coordinates ec 
              LEFT JOIN kill_event ke 
                ON ec.event_id = ke.id 
              LEFT JOIN game_entity ge1
                ON ke.killer_id = ge1.id
              LEFT JOIN game_entity ge2
                ON ke.victim_id = ge2.id
              WHERE ec.zone_id = :zone_id
              {}
              ORDER BY ke.event_time DESC
              LIMIT :limit
         """.format(source_filter), args)


def read_position_events(map_id, source_player_id, event_limit):
    source_filter = ""
    args = {
        'zone_id': map_id,
        'limit': event_limit
    }

    if source_player_id is not None:
        args['source_player_id'] = source_player_id
        source_filter = "AND source_player_id = :source_player_id"

    return query_many_params("""
        SELECT *
        FROM position_coordinates pc 
        LEFT JOIN position_event pe 
          ON pc.event_id = pe.id
        WHERE pc.zone_id = :zone_id
        {}
        ORDER BY pe.event_time DESC
        LIMIT :limit
        """.format(source_filter), args)


def read_sources(realm_id):
    return query_many_params("SELECT * FROM game_entity WHERE source_player = TRUE AND realm_id = :realm_id", { 'realm_id': realm_id })


def read_position_event_count(realm_id):
    return query_many_params("""SELECT source_player_id, count(*) as count FROM position_event WHERE source_player_id IN (
                      SELECT id FROM game_entity WHERE source_player = TRUE AND realm_id = :realm_id
                      ) GROUP BY source_player_id""", { 'realm_id': realm_id })

def read_kill_event_count(realm_id):
    return query_many_params("""SELECT source_player_id, count(*) as count FROM kill_event WHERE source_player_id IN (
                      SELECT id FROM game_entity WHERE source_player = TRUE AND realm_id = :realm_id
                      ) GROUP BY source_player_id""", { 'realm_id': realm_id })


def read_realms():
    return query_many("SELECT * FROM realm")
