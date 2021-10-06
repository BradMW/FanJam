var artist = '';
var title = '';
var searchHistory = [];

$('#formContainer').on("click", '#rockOnBtn', function(event) {
    event.preventDefault();
    
    // take input value 
    artist = $(".artistInput").val();
    title = $(".titleInput").val();

    searchHistory.push(title);

    // convert object to JSON string
    const jsonSongArr = JSON.stringify(searchHistory);

    // save to local storage
    localStorage.setItem("title", jsonSongArr);
    
    lyricsApi();
    attractions(artist);
});


function lyricsApi() {
  // console.log("Starting lyrics functions.");
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        
          // console.log(data);
          // var lyrics = data.lyrics
          // lyrics = lyrics.replace('Paroles de la chanson', '')
          // var lyricsContainer = $("#artist-lyrics");
          // var artistName = $("<p id='artistName'></p>").text(artist.toUpperCase());
          // var songTitle = $("<p id='lyrics'></p>").html(lyrics.replace(new RegExp("\n", "g"), "<br>"));
          // lyricsContainer.append(artistName);
          // lyricsContainer.append(songTitle);
          generateLyrics(data)
          getHistory(data);
      });
      // console.log("Ending lyrics functions.");
  }


function generateLyrics(data){
    var lyricsContainer = $("#artist-lyrics");
    lyricsContainer.html('');
    var lyrics = data.lyrics
    // console.log(lyrics);
    lyrics = lyrics.replace('Paroles de la chanson', '')
    var artistName = $("<p id='artistName'></p>").text(artist.toUpperCase());
    var songTitle = $("<p id='lyrics'></p>").html(lyrics.replace(new RegExp("\n", "g"), "<br>"));
    lyricsContainer.append(artistName);
    lyricsContainer.append(songTitle);
}



function getHistory(){
    // console.log("Starting getHistory");
    // var searchHistoryDiv = $("#resultsArea");
    var searchHistoryDiv = $("#searchedDiv");
    searchHistoryDiv.html('');
    if(localStorage.getItem("title")) { 
        // get string from local storage
        searchHistory = JSON.parse(localStorage.getItem("title"));
        // console.log(searchHistory);

        
        // for loop to create buttons of history of songs searches
        for (var i = 0; i < searchHistory.length; i++) {
            var newBtns = $("<button class='waves-effect waves-light btn-large concertBtn'><i class='material-icons left'>cloud</i>Concerts</button>")
            // console.log(newBtns);
            newBtns.text(searchHistory[i]);
            // searchHistoryDiv.append(newBtns);//
            searchHistoryDiv.append(newBtns)
            newBtns.click(function(event) {
                event.preventDefault();
                var searchedTitle = $(event.target);
                var prevTitle = searchedTitle.text();
                // console.log(prevTitle);
                lyricsApi(prevTitle);
                attractions(prevTitle);
            })
        }
    }
    // console.log('Ending getHistory');
}

function matchArtist(artist){

}

function attractions() {
  // console.log('Starting attractions');  
  var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
    fetch(attractionsURL)
        .then(function (response) {
            return response.json();
        })
        .then (function(data) {
            // console.log(data);
            matchArtist(data._embedded.attractions);
        // capitalize all letters from input
        // if (data.attractions[].name.toUpperCase() === artist.toUpperCase && data.attractions.upcomingEvents._total > 0) {
            // make all the variables for the buttons(if statement for if the artist has a link to their fb, youtube, etc)
            // prepend photo to lyrics side of columns
            // append social media buttons
            // call events function
            events(artist);
            // else{
                // append the "this artist has no upcoming events" to html}
        
        // })
  })
  // console.log('Ending attractions');
}


  function events(artist) {
      var eventsURL = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=2auLbJzQE7PGFSioWJ1GEiuTpEw12S1r`
      fetch(eventsURL)
      .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        // console.log(data);
        // console.log(data._embedded.events[0].name);
        // console.log(data._embedded.events[0]._embedded.venues[0].city.name);
        var concertsDiv = $("#concertsDiv"); //div
        var artistName = data._embedded.events[0].name
        concertsDiv.html("");
        for (var i=0; i < data._embedded.events.length; i++) {
            if (data._embedded.events[i].name.toUpperCase() === artist.toUpperCase()) {
                var concertURL = data._embedded.events[i].url;
                var concertCity = data._embedded.events[i]._embedded.venues[0].city.name
                // console.log(concertURL);
                var concertBtns = $("<button class='waves-effect waves-light btn-large concertBtn'><i class='material-icons left'>cloud</i>Concerts</button>")
                var concertLink = $("<a class=concertLink id='concerts'></a>");
                concertLink.attr("href", concertURL);
                concertLink.text(artistName + " in " + concertCity);
                // console.log(concertLink);
                concertsDiv.append(concertBtns);
                concertBtns.append(concertLink);
                 //just to test in temp div
            }else {
            concertsDiv.append($("<p>This artist has no upcoming events</p>"));
            }
        }
    })
  }
  



// function for "search new artist" button at the bottom of both columns that scrolls user back to the top of the page
// clear html inner.HTML("")
// append buttons to the bottom of the lyrics with title of the song. Create an array in local storage to do this
