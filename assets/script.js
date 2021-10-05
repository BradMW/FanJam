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
  
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          
          //append lyrics to maybe p tags in the first column
          // var lyricsContainer = $("<div class='lyrics'></div>");

          var artistName = $("#artistName").text(artist.toUpperCase());
          // // a wrapper for the song title being searched
          var songTitle = $("#songLyrics").text(data.lyrics);

          //appending elements to the containers
          body.append(lyricsContainer);
          lyricsContainer.append(artistName);
          lyricsContainer.append(songTitle);
          getHistory();
      });
      
  }

function getHistory(){
    
    var searchHistoryDiv = $("#historyBtns");
    searchHistoryDiv.html("");

    if(localStorage.getItem("title")) {
        // get string from local storage
        searchHistory = JSON.parse(localStorage.getItem("title"));
        

        
        // for loop to create buttons of history of songs searches
        for (var i = 0; i < searchHistory.length; i++) {
            var newBtns = $("<button class='btn btn-primary' type='button'>Search</button>")
            
            newBtns.text(searchHistory[i]);
            searchHistoryDiv.append(newBtns);
           
            newBtns.click(function(event) {
                event.preventDefault();
                var searchedTitle = $(event.target);
                var prevTitle = searchedTitle.text();
                console.log(prevTitle);
                lyricsApi(prevTitle);
                attractions(prevTitle);
            })
        }
    }
    
}

function matchArtist(artistArray){
  
  for(let i = 0; i < artistArray.length; i++){
    console.log(artistArray[i]);
    if(artistArray[i].name === artist){
      return artistArray[i];
    }
  }
}

function attractions() {
    
  var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
    fetch(attractionsURL)
        .then(function (response) {
            return response.json();
        })
        .then (function(data) {
            
            let temp = matchArtist(data._embedded.attractions);
            console.log(temp.upcomingEvents._total);
            if(temp.upcomingEvents._total != 0){
              events(artist);
            }else{
              
            }
  })
  
}


  function events(artist) {
      var eventsURL = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=2auLbJzQE7PGFSioWJ1GEiuTpEw12S1r`
      fetch(eventsURL)
      .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        console.log(data);
        console.log(data._embedded.events[0].name);
        console.log(data._embedded.events[0]._embedded.venues[0].city.name);
        var concertsDiv = $("#concertBtns"); //div
        var artistName = data._embedded.events[0].name
        concertsDiv.html("");
        for (var i=0; i < data._embedded.events.length; i++) {
            if (data._embedded.events[i].name.toUpperCase() === artist.toUpperCase()) {
                var concertURL = data._embedded.events[i].url;
                var concertCity = data._embedded.events[i]._embedded.venues[0].city.name
                console.log(concertURL);
                var concertBtns = $("<button class='btn btn-primary' type='button'></button>")
                var concertLink = $("<a class=concertLink id='concerts'></a>");
                concertLink.attr("href", concertURL);
                concertLink.text(artistName + " in " + concertCity);
                console.log(concertLink);
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
