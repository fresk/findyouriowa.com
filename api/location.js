var restful = require('node-restful');
var mongoose = restful.mongoose;
mongoose.connect("mongodb://localhost/restful");


var locationSchema = mongoose.Schema({
    'title': String,
    'public': String,
    'categories': [String],
    'tags': [String],
    'description': String,
    'images': [{
      'url': String, 
      'filename': String, 
      'mimetype': String, 
      'size': Number,
      'key': String
    }],
    'email': String,
    'phone': String,
    'website': String,
    'address1': String,
    'address2': String, 
    'city': String, 
    'state': String, 
    'zip': String, 
    'county': String, 
    'loc': { type: [Number], index: '2dsphere'},
    'facebook': String, 
    'twitter': String,
    'youtube': String,
    'instagram': String, 
    'featured': String, 
    'featured_text': String
});

locationSchema.virtual('longitude').get(function () {
  return this.loc[0] || 0.0;
});
locationSchema.virtual('longitude').set(function (lon) {
  this.loc = [parseFloat(lon), this.latitude];
});

locationSchema.virtual('latitude').get(function () {
  return this.loc[1] || 0.0;
});
locationSchema.virtual('latitude').set(function (lat) {
  this.loc = [this.longitude, parseFloat(lat)];
});






var parse_location = function(req, res, next){
  if (req.body.featured == 'false')
    req.body.featured = false;
  if (req.body.featured == 'true')
    req.body.featured = true;
  if (req.body.public == 'false')
    req.body.public = false;
  if (req.body.public == 'true')
    req.body.public = true;
  return next();
};

var output_location = function(req, res, next){
  if (res.locals.bundle.latlon)
    res.locals.bundle.latlon = ""+res.locals.bundle.latlon.join(',')
  next();
};

var Location = restful.model( "location", locationSchema)
Location.methods(['get', 'put', 'delete', 'post']);
Location.before('post', parse_location);
Location.before('put', parse_location);
//Location.after('get', output_location);

module.exports = Location;
