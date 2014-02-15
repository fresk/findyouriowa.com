import os
import json
import sqlite3
import time

## SETUP MONGO CONNECTION
import pymongo
import bson
from bson.objectid import ObjectId
class ObjectIDFieldRenamer(pymongo.son_manipulator.SONManipulator):

    def transform_incoming(self, son, collection):
        if "id" in son:
            son["_id"] = ObjectId(son['id'])
        return son

    def transform_outgoing(self, son, collection):
        if "_id" in son:
            son['id'] = str(son['_id'])
        if self.will_copy():
            return bson.son.SON(son)
        return son

mongo_client = pymongo.MongoClient('findyouriowa.com', 27017)
db = mongo_client.find_your_iowa
manipulator = ObjectIDFieldRenamer()
pymongo.database.Database.add_son_manipulator(db, manipulator)
db.locations.ensure_index([('location', pymongo.GEOSPHERE)])



target_client = pymongo.MongoClient('saskavi.com', 27017)
target_db = target_client.findyouriowa_com.locations


location_default = {
    'title': '',
    'public': True,
    'categories': [],
    'tags': [],
    'description': '',
    'images': [],
    'email': '',
    'phone': '',
    'website': '',
    'address1': '',
    'address2': '',
    'city': '',
    'state': '',
    'zip': '',
    'county': '',
    'loc': {'type': 'Point', 'coordinates':[0,0]},
    'facebook': '',
    'twitter': '',
    'youtube': '',
    'instagram': '',
    'featured': False,
    'featured_text': ''
}

for r in db.locations.find():
    loc = dict(**location_default)
    loc['loc'] = r['location']
    loc['title'] = r['name']
    loc['city'] = r['address']['city']
    loc['categories'] = r['category']
    loc['address1'] = r['address']['street']
    loc['city'] = r['address']['city']
    loc['zip'] = r['address']['zip']
    loc['description'] = r['description']
    loc['website'] = r['website']
    loc['phone'] = r['contact']['phone']
    loc['email'] = r['contact']['email']
    loc['youtube'] = r['social']['youtube']
    loc['twitter'] = r['social']['twitter']
    loc['facebook'] = r['social']['facebook']
    loc['instagram'] = r['social']['instagram']

    loc['images'] = []
    for img in r['images']:
        loc['images'].append({'url': img})

    tags = r['keywords']
    if type(r['keywords']) in [type("x"), type(u"x")]:
        r['keywords'].split(',')
    loc['tags'] = [t.strip() for t in tags if len(t)>2]



    print "insert", loc['title']
    target_db.insert(loc)



'''

## CREATE SQLITE DB
try:
    os.remove("locations.db")
except:
    pass

conn = sqlite3.connect('locations.db')
c = conn.cursor()

c.execute("""
CREATE VIRTUAL TABLE locations using fts3 (
  id varchar PRIMARY KEY NOT NULL,
  lat float,
  lng float,
  name varchar,
  city varchar,
  images varchar,
  categories varchar,
  popularity float,
  last_update integer,
  search_text varchar

);
""")

c.execute("""
CREATE TABLE location_categories(
    category_id varchar NOT NULL,
    location_id varchar NOT NULL,
    PRIMARY KEY (category_id, location_id)
);
""")



## CACHE IMPORTANT VALUES AND INSERT INTO SQLLITE
for r in db.locations.find():
    r['last_update'] = int(time.time())
    r['popularity'] = 0.0
    #id, lat, lon, name, city, image_list, popularity, last_update

    row = [
        r['id'],
        float(r['location']['coordinates'][1]), #lat
        float(r['location']['coordinates'][0]), #lng
        r['name'],
        r['address']['city'],
        ",".join(r['images']),
        ",".join(r['category']),
        r['popularity'], #popularity,
        r['last_update'],
        "%s  %s  %s %s %s" % (r['name'],  r['address']['city'], r['description'], r['keywords'], ",".join(r['category']))
    ]

    c.execute("INSERT INTO locations VALUES (?,?,?,?,?,?,?,?,?,?)", row)
    for cat in r['category']:
        c.execute("INSERT INTO location_categories VALUES (?,?)", [cat, r['id']] )

conn.commit()
c.close()

'''
