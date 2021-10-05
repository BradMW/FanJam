var artist = '';
var title = '';

function lyricsApi() {
    var lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    fetch(lyricsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          console.log(data);
      });
  }
//  submit.on("click, lyricsApi());
// subit.on("click", attractions());

  function attractions() {
      var attractionsURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=2AXpKaz2osoCIVl9Uly7i4JgRllUmxfL`
      fetch(attractionsURL)
        .then(function (response) {
            return response.json();
        })
        .then (function(data) {
            console.log(data);

        // capitalize all letters from input
        //   if (attractions.name.toUpperCase() === artist.toUpperCase && data.attractions.upcomingEvents._total > 0) {
                // events(artist)};
            // else{
                // append the "this artist has no upcoming events" to html}
        
        })
  }

  function events() {
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
    //     // } else {
    //         // append the "this artist has no upcoming events" to html}
    
    // })
    });
  }
