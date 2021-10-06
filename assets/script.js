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
        
          generateLyrics(data)
          getHistory(data);
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
          $('.twitterBtn').attr('onclick', "visitPage('"+temp.externalLinks.twitter[0].url+"');");
          $('.youtubeBtn').attr('onclick', "visitPage('"+temp.externalLinks.youtube[0].url+"');");
          $('.facebookBtn').attr('onclick', "visitPage('"+temp.externalLinks.facebook[0].url+"');");
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


var scrollToTopBtn = document.querySelector(".scrollToTopBtn");
var rootElement = document.documentElement;

function handleScroll() {
  // Do something on scroll
  var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
  if (rootElement.scrollTop / scrollTotal > 0.8) {
    // Show button
    scrollToTopBtn.classList.add("showBtn");
  } else {
    // Hide button
    scrollToTopBtn.classList.remove("showBtn");
  }
}

function scrollToTop() {
  // Scroll to top logic
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
scrollToTopBtn.addEventListener("click", scrollToTop);
document.addEventListener("scroll", handleScroll);

// $(function() {
//     var header = $("header");
//     var backgrounds = new Array(
//     "url(assets/images/concert2.jpg)",
//     "url(assets/images/concert3.jpg)",
//     "url(assets/images/concerthands.jpg)",
//     "url(assets/images/concertyellow615h.jpg)"
//     );
//     var current = 0;
    
//     function nextBackground() {
//     header.css(
//     "background",
//     backgrounds[current = ++current % backgrounds.length]
//     );
    
//     setTimeout(nextBackground, 10000);
//     }
//     setTimeout(nextBackground, 10000);
//     body.css("background", backgrounds[0]);
//     });
// function for "search new artist" button at the bottom of both columns that scrolls user back to the top of the page
// clear html inner.HTML("")
// append buttons to the bottom of the lyrics with title of the song. Create an array in local storage to do this