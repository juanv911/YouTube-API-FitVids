(function($) {
  $.fn.youtube = function(options) {
    //Default values
    var defaults = {
      key: '',
      username: ''
    };
    var settings = $.extend({}, defaults, options);

    //First Ajax Call
    $.ajax({
      url:'https://www.googleapis.com/youtube/v3/channels',
      type:'GET',
      dataType:'json',
      data: {
        'part':'contentDetails',
        'forUsername': settings.username,
        'key': settings.key   
      },
      success: function(data){
        var uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
        getVideos(uploads);  
      }
    });

    //Use "uploads" value from previous ajax call to retrieve videos
    function getVideos(uploads) {
      var limit = 1;
      //Second Ajax call
      $.ajax({
        url:'https://www.googleapis.com/youtube/v3/playlistItems',
        type:'GET',
        dataType:'json',
        data: {
          'part':'snippet',
          'playlistId': uploads,
          'maxResults': limit,
          'key': settings.key   
        },
        success: function(data){
          for(var i = 0; i<limit; i++){
            var title = $("<h3>").append(data.items[i].snippet.title);
            var thumb = $("<img>").attr("src",data.items[i].snippet.thumbnails.medium.url);
            var video_id = data.items[i].snippet.resourceId.videoId;
            var video_url = 'https://www.youtube.com/watch?v='+video_id;
            var video_url_embed = 'https://www.youtube.com/embed/'+video_id;
            var link = $("<a target='_blank'>").attr("href",video_url).append(thumb);
            var holder = $("<div class='item'>").append(link,title);

            //HTML Player
            var player = $("<iframe frameborder='0' allowfullscreen=''>").attr("src",video_url_embed);
            $("#youtube").append(player).fitVids();        
          }        
        }  
      });    
    }
  };
}(jQuery));