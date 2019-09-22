import os
import sys
from sqlalchemy import text
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_db(app):
    try:
        from ConfigParser import RawConfigParser

        cfg_parser = RawConfigParser()
        curr_dir = os.path.dirname(os.path.realpath(__file__))
        with open(curr_dir + '/config.ini', 'r+') as config:
            cfg_parser.readfp(config)
        mysql_url = cfg_parser.get('mysql', 'URL')
        mysql_port = cfg_parser.get('mysql', 'PORT')
        mysql_user = cfg_parser.get('mysql', 'USER')
        mysql_pass = cfg_parser.get('mysql', 'PASSWORD')
        mysql_schema = cfg_parser.get('mysql', 'SCHEMA')
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://{}:{}@{}:{}/{}'.format(mysql_user, mysql_pass,
                                                                                               mysql_url, mysql_port,
                                                                                               mysql_schema)
    except Exception as e:
        sys.stderr.write("MySQL DB URL not found. If you are running in a dev environment, please see instructions.\n")
        sys.stderr.flush()
        raise


def query_first_row(query, params):
    sql = text(query)
    result = db.engine.execute(sql, params).fetchall()

    result = map((lambda row: dict(zip(row.keys(), row))), result)
    if len(result) > 0:
        return result[0]
    return None


def query_many(query):
    return query_many_params(query, {})


def query_many_params(query, params):
    sql = text(query)
    result = db.engine.execute(sql, params).fetchall()

    result = map((lambda row: dict(zip(row.keys(), row))), result)
    if len(result) > 0:
        return result
    return []

def execute_update(query):
    sql = text(query)
    return db.engine.execute(sql)


def execute_update_params(query, params):
    sql = text(query)
    return db.engine.execute(sql, **params)
