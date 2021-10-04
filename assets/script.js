var artist = '';
var title = '';

function getApi() {
    var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          console.log(data);
      });
  }
  getApi();