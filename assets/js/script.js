var ticketMasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=machinegunkelly&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;

var artist = '';
var title = '';
var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;

fetch()
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
