var restful = require('node-restful');
var mongoose = restful.mongoose;
mongoose.connect("mongodb://saskavi.com/findyouriowa_com");


var locationSchema = mongoose.Schema({
    'title': String,
    'public': String,
    'categories': [String],
    'tags': [String],
    'description': String,
    'images': [{url:String}],
    'email': String,
    'phone': String,
    'website': String,
    'address1': String,
    'address2': String, 
    'city': String, 
    'state': String, 
    'zip': String, 
    'county': String, 
    'loc': {
      'type': { 'type': String },
      'coordinates': [], 
    } ,
    'facebook': String, 
    'twitter': String,
    'youtube': String,
    'instagram': String, 
    'featured': String, 
    'featured_text': String
});

locationSchema.index({ loc: '2dsphere' });

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


var Location = restful.model( "location", locationSchema)
Location.methods(['get', 'put', 'delete', 'post']);
Location.before('post', parse_location);
Location.before('put', parse_location);

module.exports = Location;
