//variables to hold user current search request
var artist = '';
var title = '';
//variables to hold user past searches for later quick search
var searchSongHistory = [];
var searchArtistHistory = [];

//An enevent listener in jquery for to click a search button called rock on
$('#formContainer').on("click", '#rockOnBtn', function(event) {
    event.preventDefault();

    $("section").addClass("hidden"); // keeps unneeded information from display when user searches nonexisting artist hides bottom of page

    // take input value from user search from artist and title input fields
    artist = $(".artistInput").val();
    title = $(".titleInput").val();

    //pushes current search to the search history for later quick search
    searchSongHistory.push(title);
    searchArtistHistory.push(artist);

    // convert object to JSON string
    const jsonSongArr = JSON.stringify(searchSongHistory);
    const jsonArtistArr = JSON.stringify(searchArtistHistory);

    // save song title to local storage
    localStorage.setItem("title", jsonSongArr);
    // save artist name to local storage
    localStorage.setItem("artist", jsonArtistArr);

    //calls an api function for the lyrics
    lyricsApi();

    //sets the input fields blank to prevent error when user searchs again
   $(".artistInput").val('');
   $(".titleInput").val('');
});

//calls an api function for the lyrics
function lyricsApi() {
  //creates the url for the api call to use grabbing value from variable the user entered
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    
  //an api call that generates lyrics
    fetch(lyricsUrl)
      .then(function (response) {
        //a conditional that prevents non exitisting artist search from running
        if(response.status !== 404){
          return response.json();
        }else{
          return false;
        }
      })
      .then(function (data) {
        //a continuation of the above conditional to prevent errors  
        if(data){
            // a function call to grab data from the api call and display lyrics to user
            generateLyrics(data);
            //an api call that uses artist the user searches and grabs information about the artist and shares to the user
            attractions();
            //a function call to store and display previously search song and artist for the user
            getHistory();
          }
          
          //a animation for scrolling down to generated content for a friendly user experiance
          $('html, body').animate({
            scrollTop: $('#resultsArea').offset().top
          }, 800, function(){
              window.location.href = '#resultsArea';
          });
      });
  }

//a function call to grab data from the api call and display lyrics to user
function generateLyrics(data){
  var lyricsContainer = $("#artist-lyrics");
  //clears the lyrics containter before show new lyrics
  lyricsContainer.html('');
  //display lyrics to the page
  var lyrics = data.lyrics;
  //displays hidden part of the page to user
  $("section").removeClass("hidden");
  //removes unneeded informations the api call gives
  lyrics = lyrics.replace('Paroles de la chanson', '');
  //displays song name as uppercase
  $('#songName').text(title.toUpperCase());
  //formats lyrics on the page
  var songTitle = $("<p id='lyrics'></p>").html(lyrics.replace(new RegExp("\n", "g"), "<br>"));
  lyricsContainer.append(songTitle);
}

//a function call to store and display previously search song and artist for the user
function getHistory(){
  //grabbing html element location
  var artistInput = $('.artistDiv');
  var songInput = $('.songDiv');
  var dataListEl = $('<datalist id="searchHistoryArtist"></datalist>');
  var songListEl = $('<datalist id="searchHistorySong"></datalist>');

  //clear html elements
  artistInput.html('');
  songInput.html('');
  dataListEl.html('');

  //grabbing local storage variables if exist
  if(localStorage.getItem("title") && localStorage.getItem("artist")) { 
      // get string from local storage
      searchSongHistory = JSON.parse(localStorage.getItem("title"));
      searchArtistHistory = JSON.parse(localStorage.getItem("artist"));

          // for loop to create items in the artist dropdown
        for (var j = 0; j < searchArtistHistory.length; j++) {
          var optionItem = $('<option></option>');
          optionItem.text(searchArtistHistory[j]);
          optionItem.attr('value', searchArtistHistory[j])
          artistInput.append(dataListEl);
          dataListEl.append(optionItem);
          artistInput.append(dataListEl);
          }

        //for loop to create items in the songs dropdown
        for (var i = 0; i < searchSongHistory.length; i++) {
          var optionItem = $('<option></option>');
          optionItem.text(searchSongHistory[i]);
          optionItem.attr('value', searchSongHistory[i]);
          songInput.append(songListEl);
          songListEl.append(optionItem);
          songInput.append(songListEl);
          }
        }
    }

//filtering the artist search by the user (if search drake filters out drake white)
function matchArtist(artistArray){
  for(let i = 0; i < artistArray.length; i++){
    if(artistArray[i].name.toUpperCase() === artist.toUpperCase()){
      return artistArray[i];
    }
  }
}

//a function to open socail media link in need page
function visitPage(url) {
    window.open(url, '_blank');
  }

//an api call that uses artist the user searches and grabs information about the artist and shares to the user
function attractions() {
  //creates the url for the api call to use grabbing value from variable the user entered
  var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
  fetch(attractionsURL)
    .then(function (response) {
        return response.json();
    })
    .then (function (data) {
      //creates varibale that grabs correct artist  
      let temp = matchArtist(data._embedded.attractions);
      
      //preparing img div and clear previous things
      var artistDiv = $(".artistImage");
      var concertsDiv = $("#concertsDiv"); //div to hold concert buttons
      var artistImg = $("<img>");
      artistDiv.html("");
      concertsDiv.html("");

      //filters img to fit img display
      var goodImg = temp.images.filter(obj => {
        return obj.width > 1000
      })
      //appends img to the page
      artistImg.attr("src", goodImg[0].url);
      artistDiv.append(artistImg);
      artistDiv.append($('<span class="card-title" id="artistName"></span>'));
      $('#artistName').text(artist.toUpperCase());

      //runs event function if artist has upcomming events else lets user know
      if(temp.upcomingEvents._total != 0){
        events();
      }else{
        concertsDiv.append($("<p>This artist has no upcoming events</p>"));
      }

      //grabs link for social media if exist
      if(temp.externalLinks.twitter){
        $('.twitterBtn').attr('onclick', "visitPage('"+temp.externalLinks.twitter[0].url+"');");
        $('.twitterBtn').removeClass('disableBtn');
      } else {
        $('.twitterBtn').addClass("disableBtn");
        $('.twitterBtn').removeAttr('onclick');
      }
      if(temp.externalLinks.youtube){
        $('.youtubeBtn').attr('onclick', "visitPage('"+temp.externalLinks.youtube[0].url+"');");
        $('.youtubeBtn').removeClass('disableBtn');
      } else {
        $('.youtubeBtn').addClass("disableBtn");
        $('.youtubeBtn').removeAttr('onclick');
      }
      if(temp.externalLinks.facebook){
        $('.facebookBtn').attr('onclick', "visitPage('"+temp.externalLinks.facebook[0].url+"');");
        $('.facebookBtn').removeClass('disableBtn');
      } else {
        $('.facebookBtn').addClass("disableBtn");
        $('.facebookBtn').removeAttr('onclick');
      }
      if(temp.externalLinks.homepage){
        $('.webpageBtn').attr('onclick', "visitPage('"+temp.externalLinks.homepage[0].url+"');");
        $('.webpageBtn').removeClass('disableBtn');
      } else {
        $('.webpageBtn').addClass("disableBtn");
        $('.webpageBtn').removeAttr('onclick');
      }
      })
  }


function events() {
  //creates the url for the api call to use grabbing value from variable the user entered
  var eventsURL = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=2auLbJzQE7PGFSioWJ1GEiuTpEw12S1r`
  
  fetch(eventsURL)
  .then(function (response) {
    return response.json();
  })
  .then (function(data) {
    
    var concertsDiv = $("#concertsDiv"); //div to hold concert buttons
    for (var i=0; i < data._embedded.events.length; i++) {
      if (data._embedded.events[i].name.toUpperCase() === artist.toUpperCase() || data._embedded.events[i].type === "event") {
        //appending concert links for each city
        var concertBtns = $("<button class='waves-effect waves-light btn-large concertBtn'><i class='material-icons left'>music_note</i></button>")
        var concertLink = $("<a class='concertLink' id='concerts' target='_blank'></a>");

        concertLink.attr("href", data._embedded.events[i].url);
        concertLink.text(data._embedded.events[i].name + " in " + data._embedded.events[i]._embedded.venues[0].city.name);
        concertsDiv.append(concertBtns);
        concertBtns.append(concertLink);
      }
   }
  })
}

//variable use for next two functions
var scrollToTopBtn = document.querySelector(".scrollToTopBtn");
var rootElement = document.documentElement;

// scroll to top button appears at bottom 80% of screen
function handleScroll() {
  // Do something on scroll
  var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
  if (rootElement.scrollTop / scrollTotal > 0.5) {
    // Show button
    scrollToTopBtn.classList.add("showBtn");
  } else {
    // Hide button
    scrollToTopBtn.classList.remove("showBtn");
  }
}

//function for scrolling to top of screen
function scrollToTop() {
  // Scroll to top logic
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
scrollToTopBtn.addEventListener("click", scrollToTop);
document.addEventListener("scroll", handleScroll);