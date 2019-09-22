from flask import Flask, make_response, jsonify, request

from data_read import read_kill_events, read_event_count, read_sources, read_realms, read_position_events
from database import db, init_db, query_many, execute_update, execute_update_params, query_first_row
from slpp import slpp as lua
import re

# Uncomment for SQL Logging
# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

from ingest_kills import ingest_kill_data
from ingest_position import ingest_position_data

app = Flask(__name__, static_folder='../website', static_url_path='')

init_db(app)
db.init_app(app)


@app.route('/api/kill-events')
def get_kill_events():
    map_id = request.args.get('mapId')
    is_instance = request.args.get('isInstance')
    source_player_id = request.args.get('sourcePlayerId')

    is_instance = True if is_instance == 'true' else False

    return jsonify(read_kill_events(map_id, is_instance, source_player_id))


@app.route('/api/position-events')
def get_position_events():
    map_id = request.args.get('mapId')
    source_player_id = request.args.get('sourcePlayerId')

    return jsonify(read_position_events(map_id, source_player_id))


@app.route('/api/sources')
def get_sources():
    realm_id = request.args.get('realmId')

    return jsonify(read_sources(realm_id))


@app.route('/api/sources/event-count')
def get_source_count():
    return jsonify(read_event_count())


@app.route('/api/realms')
def get_realms():
    return jsonify(read_realms())


@app.route('/api/ingest-data', methods=['POST'])
def add_event():
    lua_events = request.data

    kills_table_name = 'NewDataPoints3'
    position_table_name = 'NewPositionPoints'

    # The text file has 2 LUA arrays in it, one for kill events and one for positional events
    # The order isn't guaranteed, so we need to find the line number that they are on and divide them up
    first_table_name_index = lua_events.find(' =')
    if first_table_name_index == -1:
        print 'Data was sent, but contained no table!'
        return '', 200

    first_table_name = lua_events[:first_table_name_index].strip()

    # noinspection RegExpDuplicateAlternationBranch
    parts = re.split('{} = |{} = '.format(kills_table_name, position_table_name), lua_events)

    if len(parts) == 3:
        kill_events_index = 1 if first_table_name == kills_table_name else 2
        position_events_index = 2 if kill_events_index == 1 else 1
        kill_events = lua.decode(parts[kill_events_index])
        position_events = lua.decode(parts[position_events_index])

        ingest_kill_data(kill_events)
        ingest_position_data(position_events)

    if len(parts) == 2:
        if first_table_name == kills_table_name:
            ingest_kill_data(lua.decode(parts[1]))
        else:
            ingest_position_data(lua.decode(parts[1]))

    return '', 200


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))

    return d


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
