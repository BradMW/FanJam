var artist = '';
var title = '';
var searchSongHistory = [];
var searchArtistHistory = [];

$('#formContainer').on("click", '#rockOnBtn', function(event) {
    event.preventDefault();

    $("section").addClass("hidden");

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

   $(".artistInput").val('');
   $(".titleInput").val('');

});


function lyricsApi() {
  var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    
    fetch(lyricsUrl)
      .then(function (response) {
        console.log(response.status)
        if(response.status !== 404){
          return response.json();
        }else{
          return false;
        }
      })
      .then(function (data) {
          if(data){
            console.log("continue running");
            generateLyrics(data);
            attractions();
            getHistory();
          }
                
          $('html, body').animate({
            scrollTop: $('#resultsArea').offset().top
          }, 800, function(){
              window.location.href = '#resultsArea';
          });
      });
  }


function generateLyrics(data){
    var lyricsContainer = $("#artist-lyrics");
    lyricsContainer.html('');
    var lyrics = data.lyrics;
    $("section").removeClass("hidden");

    lyrics = lyrics.replace('Paroles de la chanson', '');
    $('#songName').text(title.toUpperCase());
    var songTitle = $("<p id='lyrics'></p>").html(lyrics.replace(new RegExp("\n", "g"), "<br>"));
    lyricsContainer.append(songTitle);
}

function getHistory(){
  var artistInput = $('.artistDiv');
  var songInput = $('.songDiv');
  var dataListEl = $('<datalist id="searchHistoryArtist"></datalist>');
  var songListEl = $('<datalist id="searchHistorySong"></datalist>');

  artistInput.html('');
  songInput.html('');
  dataListEl.html('');


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

function matchArtist(artistArray){
  for(let i = 0; i < artistArray.length; i++){
    if(artistArray[i].name.toUpperCase() === artist.toUpperCase()){
      return artistArray[i];
    }
  }
}

function visitPage(url) {
    window.open(url, '_blank');
  }
  
function attractions() {
  var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`;
  fetch(attractionsURL)
    .then(function (response) {
        return response.json();
    })
    .then (function (data) {
        let temp = matchArtist(data._embedded.attractions);
        
        var artistDiv = $(".artistImage");
        var concertsDiv = $("#concertsDiv"); //div to hold concert buttons
        var artistImg = $("<img>");
        artistDiv.html("");
        concertsDiv.html("");

        var goodImg = temp.images.filter(obj => {
          return obj.width > 1000
        })
        artistImg.attr("src", goodImg[0].url);
        artistDiv.append(artistImg);
        artistDiv.append($('<span class="card-title" id="artistName"></span>'));
        $('#artistName').text(artist.toUpperCase());

        if(temp.upcomingEvents._total != 0){
          events();
        }else{
          concertsDiv.append($("<p>This artist has no upcoming events</p>"));
        }

        if(temp.externalLinks.twitter){
          $('.twitterBtn').attr('onclick', "visitPage('"+temp.externalLinks.twitter[0].url+"');");
          $('.twitterBtn').removeClass('');
        } else {
          $('.twitterBtn').addClass("hidden");
        }
        if(temp.externalLinks.youtube){
          $('.youtubeBtn').attr('onclick', "visitPage('"+temp.externalLinks.youtube[0].url+"');");
          $('.youtubeBtn').removeClass('');
        } else {
          $('.youtubeBtn').addClass("hidden");
        }
        if(temp.externalLinks.facebook){
          $('.facebookBtn').attr('onclick', "visitPage('"+temp.externalLinks.facebook[0].url+"');");
          $('.facebookBtn').removeClass('');
        } else {
          $('.facebookBtn').addClass("hidden");
        }
        if(temp.externalLinks.homepage){
          $('.webpageBtn').attr('onclick', "visitPage('"+temp.externalLinks.homepage[0].url+"');");
          $('.webpageBtn').removeClass('');
        } else {
          $('.webpageBtn').addClass("hidden");
        }
      })
  }

var scrollToTopBtn = document.querySelector(".scrollToTopBtn");
var rootElement = document.documentElement;

  function events() {
    var eventsURL = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=2auLbJzQE7PGFSioWJ1GEiuTpEw12S1r`
    fetch(eventsURL)
    .then(function (response) {
      return response.json();
  })
  .then (function(data) {
    console.log("DATA" + data)
        var concertsDiv = $("#concertsDiv"); //div to hold concert buttons
        for (var i=0; i < data._embedded.events.length; i++) {
          if (data._embedded.events[i].name.toUpperCase() === artist.toUpperCase() || data._embedded.events[i].type === "event") {
              console.log(data);
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


// scroll to top button appears at bottom 80% of screen
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