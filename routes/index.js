/*
 * GET home page.
 */

var CATEGORIES = {
  "museum"                       : "Museums",
  "zoo"                          : "Zoos",
  "art"                          : "Public Art",
  "art_museum"                   : "Art Museum",
  "history_museum"               : "History Museum",
  "historic_place"               : "Historic Place",
  "county_school"                : "County School",
  "pos_office_murals"            : "Post Office Murals",
  "monument_memorial"            : "Monuments and Memorials",
  "science"                      : "Science Center",
  "botany"                       : "Garden/Botanical Center ",
  "performance"                  : "Performance Venue/Concert Hall",
  "theater"                      : "Theater",
  "movie"                        : "Movie Theater",
  "arts_council"                 : "Arts Commission or Council",
  "cultural_district"            : "Cultural/Entertainment District",
  "national_historical_register" : "National Historical Register",
  "national_historic_landmark"   : "National Historical Landmark",
  "local_landmark"               : "Local Landmark",
  "historic_site"                : "State Historic Site",
  "historic_district"            : "Historic Districts",
  "honored_iowan"                : "Honored Iowan Birthplace",
  "famous_iowan"                 : "Famous Iowan Birthplace",
  "iowa_award"                   : "Iowa Award Recipient Birthplace",
  "medal_of_honor"               : "Medal of Honor Recipient Birthplace",
  "local_government"             : "Certified Local Government",
  "iowa_great_place"             : "Iowa Great Place",
  "underground_railroad"         : "Underground Railroad Site",
  "scenic_byway"                 : "Scenic Byway",
  "barn"                         : "Historic Barn",
  "historical_society"           : "Historical Society or Commission",
  "amphitheater"                 : "Amphitheater or Riverwalk",
  "university"                   : "College or University",
  "other"                        : "Other"
};



exports.index = function(req, res){
  res.render('index', {});
};

exports.new_location = function(req, res){
  res.render('location', {CATEGORIES: CATEGORIES});
};

exports.edit_location = function(req, res){
  res.render('location', {CATEGORIES: CATEGORIES});
};


exports.output_csv = function(req, res){
  var Location = require('./api/location');
};


