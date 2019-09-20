from database import query_many, query_many_params, execute_update_params, query_first_row

def read_events(map_id, is_instance, source_player_id):
    print source_player_id
    source_filter = ""
    args = { 'zone_id': map_id }

    if source_player_id is not None:
        args['source_player_id'] = source_player_id
        source_filter = "AND source_player_id = :source_player_id"

    if is_instance:
        return query_many_params("""
             SELECT * 
             FROM kill_event
             WHERE zone_id = :zone_id
             {}
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
         """.format(source_filter), args)


def read_sources(realm_id):
    return query_many("SELECT * FROM game_entity WHERE source_player = TRUE")


def read_event_count():
    return query_many("""SELECT source_player_id, count(*) as count FROM kill_event WHERE source_player_id IN (
                      SELECT id FROM game_entity WHERE source_player = TRUE
                      )""")


def read_realms():
    return query_many("SELECT * FROM realm")
