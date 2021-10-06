var artist = '';
var title = '';
var searchSongHistory = [];
var searchArtistHistory = [];
$('#formContainer').on("click", '#rockOnBtn', function(event) {
    event.preventDefault();
    
    // take input value 
    artist = $(".artistInput").val();
    title = $(".titleInput").val();

    searchSongHistory.push(title);
    searchArtistHistory.push(artist);
    // convert object to JSON string

    const jsonSongArr = JSON.stringify(searchSongHistory);
    const jsonArtistArr = JSON.stringify(searchArtistHistory);
    // save song title to local storage
    localStorage.setItem("title", jsonSongArr);
    
    // save artist name to local storage
    localStorage.setItem("artist", jsonArtistArr);

    lyricsApi();
    // attractions();
});


function lyricsApi() {
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        
          generateLyrics(data)
          getHistory();
      });
  }


function generateLyrics(data){
    var lyricsContainer = $("#artist-lyrics");
    lyricsContainer.html('');
    var lyrics = data.lyrics;
    // console.log(lyrics);
    lyrics = lyrics.replace('Paroles de la chanson', '');
    $('#artistName').text(artist.toUpperCase());
    $('#songName').text(title.toUpperCase());
    var songTitle = $("<p id='lyrics'></p>").html(lyrics.replace(new RegExp("\n", "g"), "<br>"));
    lyricsContainer.append(songTitle);
}


function getHistory(){
  var searchHistoryList = $("#searchHistoryArtist");
  // console.log(searchHistoryList);
  if(localStorage.getItem("title")) { 
      // get string from local storage
      searchHistory = JSON.parse(localStorage.getItem("title"));
      // console.log(searchHistory);

      // for loop to create buttons of history of songs searches
      for (var i = 0; i < searchHistory.length; i++) {
          // var newBtns = $("<button class='waves-effect waves-light btn-large concertBtn'><i class='material-icons left'>cloud</i>Concerts</button>")
          var optionItem = $('<option></option>');
          optionItem.text(searchHistory[i]);


          searchHistoryList.append(optionItem);
          // searchHistoryDiv.append(newBtns);//
          // searchHistoryDiv.append(newBtns)
          // newBtns.click(function(event) {
          //     event.preventDefault();
          //     var searchedTitle = $(event.target);
          //     var prevTitle = searchedTitle.text();
          //     // console.log(prevTitle);
          //     lyricsApi(prevTitle);
          //     attractions(prevTitle);
          }
      }
  }





// function getHistory(){
//     // console.log("Starting getHistory");
//     // var searchHistoryDiv = $("#resultsArea");
//     var searchHistoryDiv = $("#searchedDiv");
//     searchHistoryDiv.html('');
//     if(localStorage.getItem("title")) { 
//         // get string from local storage
//         searchHistory = JSON.parse(localStorage.getItem("title"));
//         // console.log(searchHistory);

        
//         // for loop to create buttons of history of songs searches
//         for (var i = 0; i < searchHistory.length; i++) {
//             var newBtns = $("<button class='waves-effect waves-light btn-large concertBtn'><i class='material-icons left'>cloud</i>Concerts</button>")
//             // console.log(newBtns);
//             newBtns.text(searchHistory[i]);
//             // searchHistoryDiv.append(newBtns);//
//             searchHistoryDiv.append(newBtns)
//             newBtns.click(function(event) {
//                 event.preventDefault();
//                 var searchedTitle = $(event.target);
//                 var prevTitle = searchedTitle.text();
//                 // console.log(prevTitle);
//                 lyricsApi(prevTitle);
//                 attractions(prevTitle);
//             })
//         }
//     }
// }

function matchArtist(artistArray){
  for(let i = 0; i < artistArray.length; i++){
    if(artistArray[i].name === artist){
      return artistArray[i];
    }
  }
}

function visitPage(url) {
  console.log(url);
  window.open(url, '_blank');
}

// function attractions() {
//   var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
//   fetch(attractionsURL)
//     .then(function (response) {
//         return response.json();
//     })
//     .then (function(data) {
//         let temp = matchArtist(data._embedded.attractions);
//         console.log(temp.externalLinks.homepage[0]);
//         $('.twitterBtn').append($('<a>').attr('href', temp.externalLinks.twitter[0].url));
//         $('.youtubeBtn').append($('<a>').attr('href', temp.externalLinks.youtube[0].url));
//         $('.facebookBtn').append($('<a>').attr('href', temp.externalLinks.facebook[0].url));
//         $('.webpageBtn').attr('onclick', "visitPage('"+temp.externalLinks.homepage[0].url+"');");
//         if(temp.upcomingEvents._total != 0){
//           events();
//         }else{
          
//         }
//     })
// }


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
// $('.dropdown-trigger').dropdown();


// function for "search new artist" button at the bottom of both columns that scrolls user back to the top of the page
// clear html inner.HTML("")
// append buttons to the bottom of the lyrics with title of the song. Create an array in local storage to do this
