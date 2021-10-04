<<<<<<< HEAD
var ticketMasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=machinegunkelly&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;

var artist = 'linkin park';
var title = 'breaking habits';
var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;

fetch(lyricsUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
=======
var artist = '';
var title = '';

function lyricsApi() {
    var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          console.log(data);
      });
  }
  lyricsApi();
>>>>>>> 66041e51b30e817678c611be33549d1526abd481
