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
    attractions();
});


function lyricsApi() {
  
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          
          $("#artistName").text(artist.toUpperCase());
          // // a wrapper for the song title being searched
          $("#lyrics").text(data.lyrics);

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
    if(artistArray[i].name === artist){
      return artistArray[i];
    }
  }
}

function visitPage(url) {
  console.log(url);
  window.location = url;
}

function attractions() {
  var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
  fetch(attractionsURL)
    .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        let temp = matchArtist(data._embedded.attractions);
        console.log(temp.externalLinks.homepage[0]);
        $('.twitterBtn').append($('<a>').attr('href', temp.externalLinks.twitter[0].url));
        $('.youtubeBtn').append($('<a>').attr('href', temp.externalLinks.youtube[0].url));
        $('.facebookBtn').append($('<a>').attr('href', temp.externalLinks.facebook[0].url));
        $('.webpageBtn').attr('onclick', "visitPage('"+temp.externalLinks.homepage[0].url+"');");
        if(temp.upcomingEvents._total != 0){
          events();
        }else{
          
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
        let event = matchArtist(data._embedded.events);
        let concertsDiv = $("#concertBtns"); //div
        concertsDiv.html("");
        
        for(let i = 0; i < event.length; i++){
          let concertBtns = $("<button class='btn btn-primary' type='button'></button>");
          let concertLink = $("<a class=concertLink id='concerts'></a>");

          concertLink.attr("href", event.url);
          concertLink.text(artistName + " in " + event._embedded.venues[i].city.name);
          concertsDiv.append(concertBtns);
          concertBtns.append(concertLink);
        }
        
    })
  }
  



// function for "search new artist" button at the bottom of both columns that scrolls user back to the top of the page
// clear html inner.HTML("")
// append buttons to the bottom of the lyrics with title of the song. Create an array in local storage to do this
