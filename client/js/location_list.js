
Vue.filter('aslist', function (value) {
    console.log('lsut', value);
    if(value)
      return value.join(', ');
})


var init_view_model = function(){
  window.vm = new Vue({
    el: "#locationlist",
    data: {
      'locations': [],
      'title': 'location list'
    },
    methods: {
      new_location: function(loc){
        window.location = '/location/new';
      },
      edit_location: function(loc){
        window.location = '/location/edit/'+loc._id;
      }
  }});
}


var load_locations  = function(){
  console.log('get locations');
  var opts = {}
  opts.limit = getParameterByName('limit');
  opts.skip = getParameterByName('skip');
  $.getJSON('/api/location', opts, function(data){
    _.each(data, function(item){
      vm.locations.push(item);
    });
  });
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


$(document).ready(function(){
  init_view_model();
  setTimeout(load_locations, 10);
});
