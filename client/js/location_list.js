var DEFAULT_ITEMS_PER_PAGE = 1000;

Vue.filter('aslist', function (value) {
    if(value)
      return value.join(', ');
})



window.Page = PageController(function(){
  this.el = "#locationlist";
  
  this.data = {
    'locations': [],
    'title': 'location list'
  }
  
  this.methods.document_ready = function(){
    var self = this;
    filepicker.setKey('Py0NB_yvTwGdkp6cz2Ee');
    /* $('#pager').bootstrapPaginator({
        bootstrapMajorVersion: 3,
        currentPage: 1,
        numberOfPages:5,
        totalPages: 34,
        size: 'small',
        onPageChanged: function(ev, oldPage, newPage){
          self.page_change(oldPage, newPage);
        }
    });*/
    //this.load_locations(DEFAULT_ITEMS_PER_PAGE,0,false);
    $.getJSON('/api/location').done(build_data_table);
  }

  this.methods.page_change = function(oldPage, newPage){
    //alert("page change " +oldPage+" "+newPage);
    //this.load_locations(DEFAULT_ITEMS_PER_PAGE, (newPage-1)*DEFAULT_ITEMS_PER_PAGE)
  
  }


  this.methods.new_location = function(loc){
      window.location = '/location/new';
  }

  this.methods.edit_location = function(loc){
      window.location = '/location/edit/'+loc._id;
  }

  this.methods.import_csv = function(){
      window.ladda_csv = Ladda.create(document.querySelector('#csvbutton'));
      ladda_csv.start();
      show_upload_dialog()     
  }

  /*
  this.methods.load_locations = function(limit, skip, animate){
    var self = this;
    if (animate !== false)
      $('.spinkit-wrap').fadeIn();

    console.log("load");
    $.getJSON('/api/location', {
      limit: limit || this.getParameter('limit') || DEFAULT_ITEMS_PER_PAGE,
      skip: skip || this.getParameter('skip') || 0 
    })
    .done(function(data){

      console.log("data");
      if (animate !== false)
        $('.spinkit-wrap').fadeOut();
      self.add_items(data);
    });
  }
  */

  this.methods.add_items = function(items){
    //this.locations = items
    //setTimeout(build_data_table
   //}, 1000)
   build_data_table(items);
  }
});


function build_data_table(data){
  for (var i=0;i<data.length;i++){
  
    cat_names = [];
    for (var j=0;j<data[i].categories.length; j++){
      cat_names.push(CATEGORIES[data[i].categories[j]]);
    }
    data[i]["_category_display"]  = cat_names.join(',')
  }


  $('table').DataTable({
    data: data,
    searching: true,
    ordering:  true,
    lengthMenu: [ 15, 30, 60, 100 ],
    pageLength: 15,
    order: [0, 'asc'],
    columns: [
      { data: 'title' },
      { data: '_category_display' },
      { data: 'city' },
      { data: 'county' },
    ],
    rowCallback: function( row, data ) {
      $(row).on('click', function(){
        window.location = '/location/edit/'+data['_id'];
      });
  }

  })

  //setTimeout(function(){
    //.order([0,'asc'])
    .columns.adjust()
    .draw();
    $('.table-wrap').css('opacity', 1.0);
    $('.spinkit').css('opacity', 0.0);
  //}, 500);


}



var upload_complete = function(fp_blob){
    console.log("upload complete", fp_blob);
    $.getJSON("/api/location/import_csv", {source: fp_blob[0].url}, 
        function(data){
          console.log(data);
          ladda_csv.stop();
          location.reload();
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





function PageController(fn){
  fn.prototype.methods = { 
    documentReady: function(){}, 
    getParameter: function (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  };

  var controller =  new Vue(new fn());
  document.addEventListener('DOMContentLoaded', function(ev){
    controller.document_ready(ev);
  });
  return controller;
}






