// Youtube videos
var YoutubeRandomVideos = function(options) {
  var self = this;

  /* Callbacks */
  self.callbackOnLoaded    = options.onLoaded;

  /* Options */
  self.channelId           = options.channelId;
  self.username            = options.user;
  self.countVideos         = options.count;
  self.appKey              = options.key;
  self.autostart           = options.autostart;
  
  /* Collection */
  self.allVideosCollection = [];

  /* call init */
  self.init();
};


/* declare init */
YoutubeRandomVideos.prototype.init = function() {
  var self = this;
  if(self.autostart) {
    self.updateData();
  }
};

/* all prototype methods below */
/*-------------------------------------------------------------*/

YoutubeRandomVideos.prototype.updateData = function(id, count) {
  var self = this;

  this.channelId = id ? id : this.channelId;
  this.countVideos = count ? count : this.countVideos;

  if(self.channelId) {
    this.getChannelData();
  }
  if(self.username) {
    this.getUserData();
  }
};

YoutubeRandomVideos.prototype.onLoaded = function(data) {
  this.callbackOnLoaded(data);
};

YoutubeRandomVideos.prototype.getUserData = function() {
  var self = this;
  jQuery.get(
    "https://www.googleapis.com/youtube/v3/channels",{
      part : 'contentDetails',
      forUsername: self.username,
      key: self.appKey },
      function(data) {
        jQuery.each(data.items, function(i, item) {
          self.allVideosCollection.push(item.contentDetails.relatedPlaylists.uploads);
        });
        jQuery.each(self.allVideosCollection, function(i, item) {
          self._getPlaylistVideos(item);
        })
      }
    );
  };

  YoutubeRandomVideos.prototype.getChannelData = function() {
    var self = this;
    jQuery.get(
      "https://www.googleapis.com/youtube/v3/channels",{
        part : 'contentDetails',
        id : self.channelId,
        key: self.appKey },
        function(data) {
          jQuery.each(data.items, function(i, item) {
            self.allVideosCollection.push(item.contentDetails.relatedPlaylists.uploads);
          });
          jQuery.each(self.allVideosCollection, function(i, item) {
            self._getPlaylistVideos(item);
          })
        }
      );
    };

    // Get videos from playlist
    YoutubeRandomVideos.prototype._getPlaylistVideos = function(playlistId) {
      var self= this;
      jQuery.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",{
          part : 'snippet',
          maxResults: 35,
          playlistId : playlistId,
          key: self.appKey },
          function(data) {
            var sortedVideosCollection = self._randomizeArrayItems(data.items, self.countVideos);
            self.onLoaded(sortedVideosCollection);
          }
        );
      };

      // Get random objects from an array
      YoutubeRandomVideos.prototype._randomizeArrayItems = function(data, count) {
        var sortedArray = [],
        dataArray = data,
        countToGet = count;

        while(0 != countToGet) {
          sortedArray.push(dataArray.splice(Math.floor(Math.random()*dataArray.length), 1)[0]);
          countToGet--;
        }
        return sortedArray;
      }

      /*-------------------------------------------------------------*/
