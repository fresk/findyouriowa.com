/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', {});
};

exports.new_location = function(req, res){
  res.render('location', {});
};

exports.edit_location = function(req, res){
  res.render('location', {});
};