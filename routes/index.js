/*
 * GET home page.
 */

var CATEGORIES = {
    "art_museum"                 : "Art Museums",
    "art_performing"             : "Performing Arts Centers",
    "art_public"                 : "Public Art",
    "barn"                       : "Barns",
    "country_school"             : "Country Schools",
    "historic_ballrooms"         : "Historic Ballrooms",
    "historic_district"          : "Historic Districts",
    "historic_hotel"             : "Historic Hotels",
    "history_museum"             : "History Museums",
    "historic_site"              : "Historic Sites",
    "historic_marker"            : "Historic Marker",
    "state_historic_site"        : "State Historic Sites",
    "theater"                    : "Historic Theaters",
    "national_historic_landmark" : "National Historic Landmarks",
    "national_historic_register" : "National Register of Historic Places",
    "notable_iowan"              : "Notable Iowans",
    "gov_gravesite"              : "Iowa Governor Gravesites",
    "historic_unique"            : "Uniquely Iowa",
    "botany"                     : "Gardens and Nature Centers",
    "science"                    : "Science Centers",
    "zoo"                        : "Zoos and Wildlife",
    "arts_council"               : "Arts Commission or Council",
    "local_government"           : "Certified Local Government",
    "university"                 : "College or University",
    "cultural_district"          : "Cultural/Entertainment District",
    "famous_iowan"               : "Famous Iowan Birthplace",
    "historical_society"         : "Historical Society or Commission",
    "honored_iowan"              : "Honored Iowan Birthplace",
    "iowa_award"                 : "Iowa Award Recipient Birthplace",
    "iowa_great_place"           : "Iowa Great Place",
    "local_landmark"             : "Local Landmark",
    "medal_of_honor"             : "Medal of Honor Recipient Birthplace",
    "movie"                      : "Movie Theater",
    "monument_memorial"          : "Monuments and Memorials",
    "post_office_murals"         : "Post Office Murals",
    "scenic_byway"               : "Scenic Byway",
    "underground_railroad"       : "Underground Railroad Site",

    "heritage_area"              : "Heritage Area"
}


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


