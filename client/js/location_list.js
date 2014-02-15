
$(document).ready(function(){
  filepicker.setKey('Py0NB_yvTwGdkp6cz2Ee');
  init_view_model();
  setTimeout(load_locations, 10);
});


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
      },
      import_csv: function(){
        window.ladda_csv = Ladda.create(document.querySelector('#csvbutton'));
        ladda_csv.start();
        show_upload_dialog()     
      }
  }});
}


var load_locations  = function(){
  console.log('get locations');
  var opts = {}
  opts.limit = getParameterByName('limit') || 50;
  opts.skip = getParameterByName('skip') || 0;
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


var upload_complete = function(fp_blob){
    console.log("upload complete", fp_blob);
    $.getJSON("/api/location/import_csv", {source: fp_blob[0].url}, 
        function(data){
          console.log(data);
          ladda_csv.stop();
        });
};

var upload_error = function(err){
  if (err.code == 101) return;
  alert("There was error uplaoding!\n"+err);
  console.log(err);
};

var show_upload_dialog = function(){
  var fp_storage = {
    'location': 'S3'
  };
  var fp_options = {
    'services': [ 'COMPUTER', 'GOOGLE_DRIVE', 'GMAIL', 'URL', 'DROPBOX', 
                  'BOX','SKYDRIVE', 'FTP', 'WEBDAV' ],
    'extension': '.csv',
    'folders': false,
    'multiple': false,
    'container': 'modal'
  };
  filepicker.pickAndStore(fp_options, fp_storage, upload_complete, upload_error);
};



