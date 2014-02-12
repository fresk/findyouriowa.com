
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
  $.getJSON('/api/location', function(data){
    _.each(data, function(item){
      vm.locations.push(item);
    });
  });
}


$(document).ready(function(){
  init_view_model();
  setTimeout(load_locations, 10);
});
