var artist = '';
var title = '';
var searchHistory = [];


$('#formContainer').on("click", '#rockOnBtn', function(event) {
    event.preventDefault();
    console.log('Rock On! Clicked');
    // take input value 
    artist = $(".artistInput").val();
    title = $(".titleInput").val();
    console.log(artist);

    // need to add song name to buttons
    var searchedSong = $("<button class='btn btn-primary' type='button'>Search</button>");
    searchedSong.click(function(event){
            event.preventDefault();
    })

    // remove display none was search is completed?

    searchHistory.push(title);
    console.log(title);
    // convert object to JSON string
    const jsonSongArr = JSON.stringify(searchHistory);
    // save to local storage
    localStorage.setItem("title", jsonSongArr);
    searchedSong.text(title);
    lyricsApi(artist, title);
    //attractions(artist);
});


function lyricsApi() {
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
  fetch(lyricsUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
      //   append lyrics to maybe p tags in the first column
        //getHistory();
    });
}

function getHistory(){
    var searchHistoryDiv = //$("#historyBtns");
    searchHistoryDiv.html("");

    if(localStorage.getItem("title")) {
        // get string from local storage
        searchHistory = JSON.parse(localStorage.getItem("title"));
        console.log(searchHistory);

        
        // for loop to create buttons of history of songs searches
        for (var i = 0; i < searchHistory.length; i++) {
            var newBtns = //$("<button class='btn btn-primary' type='button'>Search</button>")
            console.log(newBtns);
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


function attractions() {
    var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
    fetch(attractionsURL)
        .then(function (response) {
            return response.json();
        })
        .then (function(data) {
            console.log(data);

        // capitalize all letters from input
        //   if (data.attractions.name.toUpperCase() === artist.toUpperCase && data.attractions.upcomingEvents._total > 0) {
            // make all the variables for the buttons(if statement for if the artist has a link to their fb, youtube, etc)
            // prepend photo to lyrics side of columns
            // append social media buttons
            // call events function
            // events(artist)};
            // else{
                // append the "this artist has no upcoming events" to html}
        
        })
  }

  function events(artist) {
      var eventsURL = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`
      fetch(eventsURL)
      .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        console.log(data);
        console.log(data.attractions.name);
        if (data.events.name.toUpperCase() === artist.toUpperCase) {
            for (var i=0; i < data.events.length; i++) {
                var concertURL = data.events[i].url;
                var concertLink = $("<a class='button'> </a>");
                concertLink.attr("href", concertURL);
                // cardDiv.append(concertLink);
            }       
    //     //else {
    //         // append the "this artist has no upcoming events" to html}
        }
    })
}

// function for "search new artist" button at the bottom of both columns that scrolls user back to the top of the page
// clear html inner.HTML("")
// append buttons to the bottom of the lyrics with title of the song. Create an array in local storage to do this.