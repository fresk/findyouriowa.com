var location_default = {
  'title': '',
  'public': 'true',
  'categories': [],
  'tags': [],
  'description': '',
  'images': [{url:''}],
  'email': '',
  'phone': '',
  'website': '',
  'address1': '',
  'address2': '', 
  'city': '', 
  'state': '', 
  'zip': '', 
  'county': '', 
  'loc': {'type':'Point', 'coordinates':[0, 0]}, 
  'facebook': '', 
  'twitter': '',
  'youtube': '',
  'instagram': '', 
  'featured': 'false', 
  'featured_text': ''
};


$(document).ready(function() {
  if (!store.enabled)
    alert('Local storage is not supported by your browser. Please ' + 
    'disabled "Private Mode", or upgrade to a modern browser');

  // initialization for plgins and other 3rd party code
  vendor_init();



  // initialize view bindings

  if ( _.str.startsWith(window.location.pathname,"/location/edit/") ){
    var location_id = _.str.strRightBack(window.location.pathname, "/");
    $.getJSON('/api/location/'+location_id, function(data){
      init_view_models(data);
    })
  }
  else {
    init_view_models(store.get('location_data') || location_default);
  }

  // attach event handlers for buttons etc.

  // start saving progress every seconds
  setTimeout(save_progress, 1000);
});


var vendor_init = function(){
  // vuejs.com
  Vue.config('debug', true);
  // filepicker.io 
  filepicker.setKey('Py0NB_yvTwGdkp6cz2Ee');
  // bootstrap-multiselect 
  $('#categories').multiselect({maxHeight: 400});
  // bootstrap-tagsinput
  $('#tags').tagsinput({
    tagClass: function(item) {return 'label label-primary'; },
    confirmKeys: [44, 13, 32]
  });
}


var attach_event_handlers = function(){
  // Event Handlers
  $('#btn_upload').on('click', show_upload_dialog);
  $('#btn_save').on('click', save_location);
  $('#categories').on('change', function(){
    location_view.categories = $(this).val();
  });
  $('#tags').on('change', function(){
    location_view.tags = $(this).val();
  });

  var location_id = _.str.strRightBack(window.location.pathname, "/");

  if (location_id == "new"){
    hide_delete_btn();
    return
  }


  $('.confirm-delete').on('click', function(e) {
    e.preventDefault();
    console.log('go modal');
    $('#myModal').modal();
  });

  $('#btnYes').click(function() {
    // handle deletion here
    console.log('yes');
    $.ajax({
      url: '/api/location/'+location_view.$data._id,
      type: 'DELETE',
      success: function(result) {
        window.location = "/";
      }
    });
  });



}


function hide_delete_btn(){

$("#deletefields").hide();
}


var init_multi_selects  = function() {




  attach_event_handlers();
  var _categories = $("#categories");
  _categories.val(location_view.categories);
  _categories.multiselect('refresh');
  var _tags = $("#tags");
  if (!location_view.tags || location_view.tags.length == 0)
    _tags.tagsinput('removeAll');
  else
  _.each(location_view.tags, function(val){ 
    _tags.tagsinput('add', val) 
  });
};



var init_view_models = function(data){
  // View - Data bindinga 
  location_view = new Vue({
    el: '#locationform',
    data: data,
    computed:{
      lon: {
        $get: function(){ return this.loc.coordinates[0];},
        $set: function(val){this.loc.coordinates[0] = parseFloat(val);}
      },
      lat: {
        $get: function(){ return this.loc.coordinates[1];},
        $set: function(val){this.loc.coordinates[1] = parseFloat(val);}
      },
    }
  });

  // vue doesnt work for select with multiple='multiple'
  setTimeout(init_multi_selects, 10);
}


var save_progress = function(){
  if (location_view.$data._id)
    return;
  store.set('location_data', location_view.$data);
  setTimeout(save_progress, 5000);
};


var save_new_location = function(){
  $.postJSON('/api/location', _.clone(location_view.$data), function(data){
    store.remove('location_data');
    window.location = "/";
    event.preventDefault();
  }, function(res){
    alert(res.responseJSON['message']);
  });
}

var save_location = function(event){
  if (!location_view.tags)
    location_view.tags = [];

  console.log(location_view);
  if (location_view.$data._id == undefined)
    return save_new_location();

  var loc_url = '/api/location/' + location_view.$data._id;
  console.log("POSTING", loc_url, _.clone(location_view.$data));
  $.putJSON(loc_url, location_view.$data, function(data){
    store.remove('location_data');
    window.location = "/";
    event.preventDefault();
  }, function(res){
    alert(res.responseJSON['message']);
  });
};


var upload_complete = function(fp_blobs){
  _.each(fp_blobs, function(blob){
    console.log("upload complete", blob);
    location_view.images.push(blob)
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
    'services': [
      'COMPUTER', 'IMAGE_SEARCH', 'URL', 'GOOGLE_DRIVE', 'GMAIL', 'FACEBOOK', 
    'INSTAGRAM', 'DROPBOX', 'BOX', 'FLICKR', 'SKYDRIVE', 'FTP', 'WEBDAV' ],
    'mimetype':'image/*', 
    'folders': false,
    'multiple': true,
    'container': 'modal'
  };
  filepicker.pickAndStore(fp_options, fp_storage, upload_complete, upload_error);
};


jQuery.extend({
  postJSON: function(url, data, cb, err_cb) {
    return jQuery.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data),
      success: cb,
      error: err_cb,
      dataType: "json",
      contentType: "application/json",
      processData: false
    });
  },
  putJSON: function(url, data, cb, err_cb) {
    return jQuery.ajax({
      type: "PUT",
      url: url,
      data: JSON.stringify(data),
      success: cb,
      error: err_cb,
      dataType: "json",
      contentType: "application/json",
      processData: false
    });
  }
});
