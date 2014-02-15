var _ = require('lodash');
var http = require('http');
var https = require('https');
var csv = require('csv');
var restful = require('node-restful');
var mongoose = restful.mongoose;

mongoose.connect("mongodb://saskavi.com/findyouriowa_com");

/*
 * Location Schema
 */
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


/*
 * DB Indexes
 */
locationSchema.index({ loc: '2dsphere' });


/*
 * Virtual Schema Properties
 */
locationSchema.virtual('longitude').get(function () {
  return this.loc.coordinates[0] || 0.0;
});
locationSchema.virtual('longitude').set(function (lon) {
  this.loc = {type:'Point', coordinates: [parseFloat(lon), this.latitude]};
});

locationSchema.virtual('latitude').get(function () {
  return this.loc.coordinates[1] || 0.0;
});
locationSchema.virtual('latitude').set(function (lat) {
  this.loc = {type:"Point", coordinates: [this.longitude, parseFloat(lat)]};
});


/*
 * Instance Methods
 */
locationSchema.methods.get_csv_safe_data = function () {
  var simple_fields = ["title", "email", "phone", "website", "address1", 
    "address2", "city", "state", "zip", "county", "longitude", "latitude",
    "facebook", "twitter", "youtube", "instagram", "public", "featured", 
    "featured_text"];
    
  var csv_safe = _.pick(this, simple_fields);
  csv_safe.tags = _(this.tags).compact().join(', ');
  csv_safe.categories = _(this.categories).compact().join(', ');
  console.log(this.images);
  csv_safe.images = _(this.images).map(function(img){return img.url}).join(', ');
  return csv_safe;
}


/*
 * Setup default REST / CRUD routes.
 */
var Location = restful.model( "location", locationSchema);
Location.methods(['get', 'put', 'delete', 'post']);


/*
 * Parse incoming data on create/update / post/put
 */
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
Location.before('post', parse_location);
Location.before('put', parse_location);



/*
 * Export to CSV
 */
Location.route('export_csv', function(req, res, next){
    res.setHeader('Content-disposition', 
      'attachment; filename=locations.csv');
    var fields;
    var locations = _(res.locals.bundle)
      .map(function(loc){ return loc.get_csv_safe_data() })
      .tap(function(array){ fields = _.keys(array[0]) })
      .map(function(loc){ return _.values(loc) });
    csv().from.array(locations.value())
      .to.options({ quoted:true, columns: fields, header:true, 
        lineBreaks:'windows' })
      .to.string(function(data, count){
        res.send(data);
      })
});

Location.before('csv', ['get'], function(req, res, next){
  var query = Location.filter(req, Location.find());
  query.exec(function(err, list){
    res.locals.bundle = list;
    next();
  });
});



/*
 * Import CSV
 */
Location.route('import_csv', ['get'], function(req, res, next){
  var source = req.query.source;
  console.log("source:", source, "XXX");
  https.get(source, function(response) {
    var items = []
    csv()
      .from.stream(response, {columns:true})
      .on('record', function(row){
        var specials = ['images', 'categories', 'tags', 
                        'longitude', 'latitude'];
        loc = new Location(_.omit(row, specials));
        loc.longitude = row.longitude;
        loc.latitude = row.latitude;
        loc.images = _.map(row.images.split(/\s*,\s*/), function(img){
          return {url:img};
        });
        loc.tags = _.compact(row.tags.split(/\s*,\s*/));
        loc.categories = _.compact(row.categories.split(/\s*,\s*/));
        loc.save(console.log);
        items.push(loc);
      }).on('end', function(count){
        console.log("DONE", count)
        res.send(items);
      });
      
  })
});



module.exports = Location;

