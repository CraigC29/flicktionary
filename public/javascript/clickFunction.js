$(document).on('click', ".genreSelectButton", function() {
  var genre = $(this).attr('id');
  if (genre != "clear"){
    var genreText = $(this).text();
    $("#genreButtonMain").text("Genre: " + genreText);
    genreSelected = genre;
    console.log(genreSelected);

  } else {
    $("#genreButtonMain").text("Genre");
    genreSelected = null;
  }
  $("#message").html("");
  loadHomepage();
  // loadFavourites();
  });

  // Search bar is set up and can type in it
    $("#searchInput").keyup(function() {
      if (event.keyCode === 13) {
        document.getElementById("submit").click();
      }
    });

    // CallAPILoadPopularMovies();
    $("#submit").click(function (e) {
      var validate = Validate();
      if (validate.length == 0) {
        if (searchType == "movie" || searchType == ""){
          CallAPI(1, "movie");
        } else {
          CallAPI(1, "series");
        }
      }
    });

    // When a series block is seleceted it runs that code
    $(document).on('click', ".seriesBlock", function() {
      for(i = 1; i <= numSeries; i++){
        var location = i;
        $("#" + location).attr('style',  'background-color:#2f2833');
      }
      $(this).attr('style',  'background-color:#fc804e');
      var series = $(this).attr('id');
      seriesSelected = series;
      loadEpisodeData(seriesSelected);
    });


    // When a poster is selected it runs that code
    $(document).on('click', ".posterOverlay", function(event) {
      console.log("poster clicked");
      var path = $(this).attr('id');
      var type = $(this).attr('name');
      if(type == "movie"){
        var movieid = path;
        var urlMediaMovies = "/mediaMovies?id=" + movieid;
        window.location.replace(urlMediaMovies);
      } else {
        var tvid = path;
        var urlMediaSeries = "/mediaSeries?id=" + tvid;
        window.location.replace(urlMediaSeries);
      }

    });

    //function selectNameBlock
    $(document).on('click', ".episodeBlock", function() {
      console.log("working");
      for(i = 0; i < numEpisodes; i++){
        var location = i + 100;
        $("#" + location).attr('style',  'background-color:#2f2833');
      }
      $(this).attr('style',  'background-color:#fc804e');
      var episode = $(this).attr('id');
      console.log(episode);
      episodeSelected = episode;
      loadIndividualEpisodeData();

    });



    // submit button
    $("#submit").click(function() {
      $('html, body').animate({
        scrollTop: $("#mainStuff").offset().top
      }, 2000);
    });

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
      if (!event.target.matches('.genreButton')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
