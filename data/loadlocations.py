import json

location_default = {
    'title': '',
    'public': 'true',
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
    'lat': 0.0,
    'lon': 0.0,
    'facebook': '',
    'twitter': '',
    'youtube': '',
    'instagram': '',
    'featured': 'false',
    'featured_text': ''
}

locations = json.load(open('locations.json'))
loc_categories = json.load(open('location_categories.json'))


for l in locations:
    loc = dict(**location_default)
    loc['title'] = l['name']
    loc['lat'] = float(l['lat'])
    loc['lon'] = float(l['lon'])
