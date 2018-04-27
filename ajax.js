var pagePos = 3;
var amountPages = 1;
var allResults = "";
var searchType = "movie";
var numSeries = 0;
var numEpisodes = 0;
var seriesSelected = 1;
var episodeSelected = 1;
var isDelving = false;
var genreSelected = null;
var loggedIn = false;
var moviesFavourited = "";
var seriesFavourited = "";
var hasMovies = false;
var hasSeries = false;

// loads both movies and series
function loadAllMovieMedia(movieid) {
  $.ajax({
    url: "https://api.themoviedb.org/3/movie/" + movieid,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
    dataType: "json",
    success: function (result, status, xhr) {
      var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w342/" + result["poster_path"];
      var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w780/" + result["poster_path"];
      image = "<img id='largeImage' src=\"" + image + "\"/>"
      var movieTitle = result["title"];
      var imdbID = result["imdb_id"];
      var description = result["overview"];
      var genres = result["genres"][0]["name"];
      var littleInfoMovie = result["runtime"] + 'mins' + ' &#9679 ' + result["release_date"] + ' &#9679 ' + genres +  '<div id="' + imdbID + '"class="imdbLink" onClick="openIMDB()">IMDB</div>';

      $("#mainImage").html(image);
      $("#mainTitle").html(movieTitle);
      $("#favouriteBig").attr("value", movieid);
      $("#typeMedia").attr("value", "movie");
      $("#littleMovieInfo").html(littleInfoMovie);
      $("#mainDesc").html(description);

      document.getElementById("blurredImageMovie").src = imageSRC;
      console.log(imageSRC);
// sets height of window
      var windowHeight = $(window).height() - 40;
      console.log("window height: " + windowHeight);
      document.getElementById("movieMediaContainer").setAttribute("style","height:" + windowHeight + "px");
    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}
// loads all information about tv series
function loadAllTVMedia(tvID) {
  $.ajax({
    url: "https://api.themoviedb.org/3/tv/" + tvID,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
    dataType: "json",
    success: function (result, status, xhr) {
      var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
      var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w780/" + result["poster_path"];
      // console.log(imageSRC);
      image = "<img src=\"" + image + "\"/>"
      var seriesTitle = result["name"];
      var description = result["overview"];
      numSeries = result["number_of_seasons"];
// sets the area information about series is stored
      $("#seriesInfo").html(numSeries + " Season");
      if (numSeries > 1){$("#seriesInfo").append("s");}


      var seriesDiv = "";
      var seriesEpDiv = "";
      for (i = 1; i <= numSeries; i++){
        seriesDiv += '<div id="' + i + '" class="seriesBlock">Season ' + i + '</div>';
      }

      $("#mainSeriesImage").html(image);
      $("#favouriteBig").attr("value", tvID);
      $("#typeMedia").attr("value", "series");
      $("#mainTitle").html(seriesTitle);
      $("#mainDesc").html(description);

      $("#blockSeries").html(seriesDiv);
      document.getElementById("blurredImage").src = imageSRC;
      document.getElementById("1").click();
// sets the height of image
      var heightImage = $("#seriesMediaHeight").height() + 60;
      console.log("height is: " + heightImage);
      document.getElementById("blurredImage").height = heightImage;
// sets the height of the window
      var windowHeight = $(window).height();
      console.log("window height: " + windowHeight);


// sets the size of the area the series information is stored
      var elementSize = (windowHeight - heightImage);
      document.getElementById("seriesInfoHolder").height = elementSize;
// sets height of the block
      var blockHeight = (elementSize * 0.6);
      console.log("blockHeight: " + blockHeight);

      document.getElementById("blockSeries").setAttribute("style","max-height:" + blockHeight + "px");

      document.getElementById("blockEp").setAttribute("style","height:" + blockHeight + "px");
      // document.getElementById("seriesEpisodeInfoContainer").setAttribute("style","max-height:" + blockHeight + "px");
    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

// loads all information about individual episodes
function loadEpisodeData(season){
  var tvID = getUrlVars()["id"];
  $.ajax({
    url: "https://api.themoviedb.org/3/tv/" + tvID + "/season/" + season,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
    dataType: "json",
    success: function (result, status, xhr) {
      var numEps = result["episodes"].length;
      // console.log("numEps:  " + numEps);
      var allEpisodes = "<div id='allEpisodesContainer'>"


      for(i = 100; i < (numEps + 100); i++){
        var realI = i - 100;
        var epName = result["episodes"][realI]["name"];
        var epNum = parseInt(realI) + 101
        numEpisodes = numEps;
        var epNumText = (parseInt(epNum) - 100);
        // console.log(epNumText);
        if (epNumText < 10){epNumText = epNumText + "&nbsp &nbsp";}
        allEpisodes += '<div id="' + epNum + '" class="episodeBlock">' + epNumText + " &nbsp" + epName + '</div>';
      }
      allEpisodes += "</div>"

// sets html of the block episodes to all episodes
      $("#blockEp").html(allEpisodes);
      $('#episodeNums').text("Episodes (" + numEps + ")");

      document.getElementById("101").click();
      // console.log("loadEpisodeData");

    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}
// loads information about movies
function loadIndividualEpisodeData(){
  var tvID = getUrlVars()["id"];
  var actualEpisode = episodeSelected - 100;
  $.ajax({
    url: "https://api.themoviedb.org/3/tv/" + tvID + "/season/" + seriesSelected + "/episode/" + actualEpisode,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707"},
    dataType: "json",
    success: function (result, status, xhr) {
      var epName = result["name"];
      // console.log(epName);
      var airDate = result["air_date"];
      var epDescription = result["overview"];
      if (epDescription == ""){epDescription = "No Description is Available";}
      var allEpisodes = '<div>' + epName + '</div>';
      allEpisodes += '\n<div class="moreLittleInfo"> Season ' + seriesSelected + ', Episode ' + actualEpisode + '</div>';
      allEpisodes += '\n<div class="moreLittleInfo"> Air Date: ' + airDate + '</div>';
      allEpisodes += '\n<div class="episodeDescription">' + epDescription + '</div>';

      // console.log(allEpisodes);
      $("#seriesEpisodeInfoContainer").html(allEpisodes);
      // console.log("loadEpisodeData INDIVIDUAL");

    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

// calls the API of most popular genres, films and tv
function CallAPILoadPopularMedia(media, page) {
  if (genreSelected !== null){
    console.log("genre has been selected: " + genreSelected);
    if(media == "movie"){
      var apiCall =  "https://api.themoviedb.org/3/genre/" + genreSelected + "/movies?&page=" + page
    } else {
      var apiCall =  "https://api.themoviedb.org/3/discover/tv?&sort_by=popularity.desc&page=" + page + "&with_genres=" + genreSelected
    }
  } else{
    if(media == "movie"){
      var apiCall =  "https://api.themoviedb.org/3/movie/popular?&page=" + page
    } else {
      var apiCall =  "https://api.themoviedb.org/3/tv/popular?&page=" + page
    }
  }
  $.ajax({
    url: apiCall,
    // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
    data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
    dataType: "json",
    success: function (result, status, xhr) {

      for (i = 0; i < result["results"].length; i++) {
        var movieid = result["results"][i]["id"];
        var movieLocation = movieid;
        var image = result["results"][i]["poster_path"] == null ? "/public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

        allResults.append("<div id=" + movieid + "  class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieLocation + " name=" + searchType + ">" + '<form action="/favourite" method="POST"> <input type="image" src="/public/images/favourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + "<img id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>"  + "</div></div>");
      }
      if (page == 10){
        allResults.append("</div>");
      }
      $("#message").append(allResults);
    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}
