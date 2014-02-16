import requests
import pymongo
import json

## SETUP MONGO CONNECTION
mongo_client = pymongo.MongoClient('saskavi.com', 27017)
db = mongo_client.findyouriowa_com


url = "http://labs.silverbiology.com/countylookup/lookup.php?cmd=findCounty&DecimalLatitude={0}&DecimalLongitude={1}"

for r in db.locations.find():
    print "\n", r['title']

    #skip records that already have county assigned
    if r['county'] and len(r['county']) > 2:
        print "..county :", r['county']
        continue

    #get county based on lat/lon
    try:
        print ".. finding county... ",
        lat, lon = r['loc']['coordinates']
        resp = requests.get(url.format(lon, lat))
        r['county'] = resp.json()['County']
        db.locations.save(r)
        print r['county']
    except Error as e:
        print "..error:", e




