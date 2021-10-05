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
          $('#artistName').text(artist);
          $('#lyricsTag').text(data.lyrics);

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
    
    var eventsURL = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`
    fetch(eventsURL)
      .then(function (response) {
        return response.json();
      })
      .then (function(data) {
          
          
          //var concertsDiv = //div
          //concertsDiv.html("");
          for (var i=0; i < data._embedded.events.length; i++) {
              if (data._embedded.events[i].name.toUpperCase() === artist.toUpperCase()) {
                  var concertURL = data._embedded.events[i].url;
                  //console.log(concertURL);
                  var concertBtns = $("<button class='btn btn-primary' id='concert' type='button'></button>")
                  var concertLink = $("<a class=concertLink></a>");
                  concertLink.attr("href", concertURL);
                  // concertLink.text(artist + [i]);
                  //console.log(concertLink);
                  $("#concerts").append(concertBtns);
                  concertBtns.append(concertLink);
                    //just to test in temp div
              }       
            //else {
                // append the "this artist has no upcoming events" to html}
            }
      })
      
}

// function for "search new artist" button at the bottom of both columns that scrolls user back to the top of the page
// clear html inner.HTML("")
// append buttons to the bottom of the lyrics with title of the song. Create an array in local storage to do this
