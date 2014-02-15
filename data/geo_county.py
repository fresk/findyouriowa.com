import requests
import pymongo
import json

## SETUP MONGO CONNECTION
mongo_client = pymongo.MongoClient('saskavi.com', 27017)
db = mongo_client.findyouriowa_com


url = "http://labs.silverbiology.com/countylookup/lookup.php?cmd=findCounty&DecimalLatitude={0}&DecimalLongitude={1}"

for r in db.locations.find():
    tag_list = []
    for t in r['tags']:
        tag_list.append(t.split(',').strip())
    r['images'] = image_list
    db.locations.save(r)
    #if r['county'] and len(r['county']) > 2:
    #    #print "...skipping"
    #    continue
    #try:
    #    lat, lon = r['loc']['coordinates']
    #    resp = requests.get(url.format(lon, lat))
    #    r['county'] = resp.json()['County']
    #    #r['county']  = resp['County']
    #    db.locations.save(r)
    #except:
    #    print r['title']
    #    print "..error:"
    #    print resp.text
    #    print



