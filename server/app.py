from flask import Flask, make_response, jsonify, request

from data_read import read_events, read_event_count, read_sources, read_realms
from database import db, init_db, query_many, execute_update, execute_update_params, query_first_row
from slpp import slpp as lua

# Uncomment for SQL Logging
# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

from ingest import ingest_events

app = Flask(__name__, static_folder='../website', static_url_path='')

init_db(app)
db.init_app(app)


@app.route('/api/kill-events')
def get_events():
    map_id = request.args.get('mapId')
    is_instance = request.args.get('isInstance')
    source_player_id = request.args.get('sourcePlayerId')

    is_instance = True if is_instance == 'true' else False

    return jsonify(read_events(map_id, is_instance, source_player_id))


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


@app.route('/api/kill-data', methods=['POST'])
def add_event():
    lua_events = request.data

    python_events = lua.decode(lua_events)

    ingest_events(python_events)

    return '', 200


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))

    return d



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
