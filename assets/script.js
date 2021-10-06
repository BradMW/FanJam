var artist = '';
var title = '';
var searchSongHistory = [];

$('#formContainer').on("click", '#rockOnBtn', function(event) {
    event.preventDefault();
   
    $('html, body').animate({
       scrollTop: $('#resultsArea').offset().top
      }, 800, function(){

      window.location.href = '#resultsArea';
    });
    
    // take input value 
    artist = $(".artistInput").val();
    title = $(".titleInput").val();

    searchSongHistory.push(title);

    // convert object to JSON string
    const jsonSongArr = JSON.stringify(searchHistory);

    // save to local storage
    localStorage.setItem("title", jsonSongArr);
    
    lyricsApi();
    attractions();
});


function lyricsApi() {
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        
          generateLyrics(data)
          getHistory(data);
      });
  }


function generateLyrics(data){
    var lyricsContainer = $("#artist-lyrics");
    lyricsContainer.html('');
    var lyrics = data.lyrics;
    lyrics = lyrics.replace('Paroles de la chanson', '');
    $('#artistName').text(artist.toUpperCase());
    $('#songName').text(title.toUpperCase());
    var songTitle = $("<p id='lyrics'></p>").html(lyrics.replace(new RegExp("\n", "g"), "<br>"));
    lyricsContainer.append(songTitle);
}



function getHistory(){
  var searchArtistList = $("#searchHistoryArtist");
  var searchSongList = $("#searchHistoryTitle");

  searchArtistList.html('');
  searchSongList.html('');

  if(localStorage.getItem("title") && localStorage.getItem("artist")) { 
      // get string from local storage
      searchSongHistory = JSON.parse(localStorage.getItem("title"));
      searchArtistHistory = JSON.parse(localStorage.getItem("artist"));

        // for loop to create items in the songs dropdown
        for (var i = 0; i < searchSongHistory.length; i++) {
          var optionItem = $('<option></option>');
          optionItem.text(searchSongHistory[i]);

          searchSongList.append(optionItem);
          searchSongList.append(searchSongHistory);
          $(this).focus();

          }
          // for loop to create items in the artist dropdown
        for (var j = 0; j < searchArtistHistory.length; j++) {
          var optionItem = $('<option></option>');
          optionItem.text(searchArtistHistory[j]);

          // searchArtistList.append(optionItem);
          searchSongList.append(searchArtistHistory);

          }
        }
    }

function matchArtist(artistArray){
  for(let i = 0; i < artistArray.length; i++){
    if(artistArray[i].name.toUpperCase() === artist.toUpperCase()){
      return artistArray[i];
    }
  }
}

function visitPage(url) {
  console.log(url);
  window.open(url, '_blank');
}

function attractions() {
  var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
  fetch(attractionsURL)
    .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        let temp = matchArtist(data._embedded.attractions);
        console.log(temp.externalLinks);
        if(temp.externalLinks.twitter){
          $('.twitterBtn').attr('onclick', "visitPage('"+temp.externalLinks.twitter[0].url+"');");
          console.log(temp.externalLinks.twitter[0].url);
        }
        if(temp.externalLinks.youtube){
          $('.youtubeBtn').attr('onclick', "visitPage('"+temp.externalLinks.youtube[0].url+"');");
          console.log(temp.externalLinks.youtube[0].url);
        }
        if(temp.externalLinks.facebook){
          $('.facebookBtn').attr('onclick', "visitPage('"+temp.externalLinks.facebook[0].url+"');");
        }
        if(temp.externalLinks.homepage){
          $('.webpageBtn').attr('onclick', "visitPage('"+temp.externalLinks.homepage[0].url+"');");
        }
        if(temp.upcomingEvents._total != 0){
          events();
        }
    })
}


  function events() {
      var eventsURL = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=2auLbJzQE7PGFSioWJ1GEiuTpEw12S1r`
      fetch(eventsURL)
      .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        var concertsDiv = $("#concertsDiv"); //div to hold concert buttons
        concertsDiv.html("");
        for (var i=0; i < data._embedded.events.length; i++) {
            if (data._embedded.events[i].name.toUpperCase() === artist.toUpperCase()) {
                var concertBtns = $("<button class='waves-effect waves-light btn-large concertBtn'><i class='material-icons left'>cloud</i>Concerts</button>")
                var concertLink = $("<a class=concertLink id='concerts'></a>");

                concertLink.attr("href", data._embedded.events[i].url);
                concertLink.text(artist.toUpperCase() + " in " + data._embedded.events[i]._embedded.venues[0].city.name);
                concertsDiv.append(concertBtns);
                concertBtns.append(concertLink);
                 //just to test in temp div
            }else {
            concertsDiv.append($("<p>This artist has no upcoming events</p>"));
            }
        }
        
    })
  }
//   Ron added for dropdown menus for recent searches
$('.dropdown-trigger').dropdown();


// function for "search new artist" button at the bottom of both columns that scrolls user back to the top of the page
// clear html inner.HTML("")
// append buttons to the bottom of the lyrics with title of the song. Create an array in local storage to do this
