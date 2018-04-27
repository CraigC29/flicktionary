//Declare variables used
var allResults = "";
var searchType = "movie";
var numSeries = 0;
var numEpisodes = 0;
var seriesSelected = 1;
var episodeSelected = 1;
var genreSelected = null;

// loads both movies and series
function loadAllMovieMedia(movieid) {
  //calls ajax
  $.ajax({
    url: "https://api.themoviedb.org/3/movie/" + movieid, //sets url to API call + movie id
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, //sets api key
    dataType: "json", //sets type
    success: function (result, status, xhr) { //on success run
      //sets image var to api call
      var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w342/" + result["poster_path"];
      var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w780/" + result["poster_path"];
      image = "<img id='largeImage' src=\"" + image + "\"/>"
      //sets movie title, imdb result, description, genre and info
      var movieTitle = result["title"];
      var imdbID = result["imdb_id"];
      var description = result["overview"];
      var genres = result["genres"][0]["name"];
      var littleInfoMovie = result["runtime"] + 'mins' + ' &#9679 ' + result["release_date"] + ' &#9679 ' + genres +  '<div id="' + imdbID + '"class="imdbLink" onClick="openIMDB()">IMDB</div>';

      //Sets elements to correct html based on API
      $("#mainImage").html(image);
      $("#mainTitle").html(movieTitle);
      $("#favouriteBig").attr("value", movieid);
      $("#typeMedia").attr("value", "movie");
      $("#littleMovieInfo").html(littleInfoMovie);
      $("#mainDesc").html(description);

      //sets background image
      document.getElementById("blurredImageMovie").src = imageSRC;
      console.log(imageSRC);
      // sets height of window
      var windowHeight = $(window).height() - 40;
      console.log("window height: " + windowHeight);
      document.getElementById("movieMediaContainer").setAttribute("style","height:" + windowHeight + "px");
    },
    error: function (xhr, status, error) { //on error run message
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

// loads all information about tv series
function loadAllTVMedia(tvID) {
  $.ajax({ //on ajax call
    url: "https://api.themoviedb.org/3/tv/" + tvID, //sets url to api + tvid
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, //sets api key
    dataType: "json", //sets typeMedia
    success: function (result, status, xhr) { //on success runtime
      //sets image to api result for image
      var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
      var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w780/" + result["poster_path"];
      //sets image variable again
      image = "<img src=\"" + image + "\"/>"
      //sets seriesTitle
      var seriesTitle = result["name"];
      //sets description
      var description = result["overview"];
      //sets numseries
      numSeries = result["number_of_seasons"];
      // sets the area information about series is stored
      $("#seriesInfo").html(numSeries + " Season");
      //checks if series > 1 if so add an s for plural
      if (numSeries > 1){$("#seriesInfo").append("s");}

      //creates series/series ep variables
      var seriesDiv = "";
      var seriesEpDiv = "";
      //for loop to add series blocks to variable
      for (i = 1; i <= numSeries; i++){
        seriesDiv += '<div id="' + i + '" class="seriesBlock">Season ' + i + '</div>';
      }


      //sets elements to correct html
      $("#mainSeriesImage").html(image);
      $("#favouriteBig").attr("value", tvID);
      $("#typeMedia").attr("value", "series");
      $("#mainTitle").html(seriesTitle);
      $("#mainDesc").html(description);
      $("#blockSeries").html(seriesDiv);

      //sets background image
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

      //sets blockSeries attributes
      document.getElementById("blockSeries").setAttribute("style","max-height:" + blockHeight + "px");

      //sets blockEp attributes
      document.getElementById("blockEp").setAttribute("style","height:" + blockHeight + "px");
      // document.getElementById("seriesEpisodeInfoContainer").setAttribute("style","max-height:" + blockHeight + "px");
    },
    error: function (xhr, status, error) { //on error run error message
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

// loads all information about individual episodes
function loadEpisodeData(season){
  var tvID = getUrlVars()["id"]; //sets tvID to url variable id
  $.ajax({ //cals AJAX
    url: "https://api.themoviedb.org/3/tv/" + tvID + "/season/" + season, //sets url to tvID and Season
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, //sets api key
    dataType: "json", //sets type
    success: function (result, status, xhr) { //on success run
      var numEps = result["episodes"].length; //sets numEps
      // console.log("numEps:  " + numEps);
      var allEpisodes = "<div id='allEpisodesContainer'>" //sets allEpisodes

      //for loop to set episode blocks
      for(i = 100; i < (numEps + 100); i++){
        //declaring episode variables
        var realI = i - 100;
        var epName = result["episodes"][realI]["name"];
        var epNum = parseInt(realI) + 101
        numEpisodes = numEps;
        var epNumText = (parseInt(epNum) - 100);
        // console.log(epNumText);
        //if condition to add spaces if < 10 for indentation
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
    error: function (xhr, status, error) { //on error run message
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}


// loads information about movies
function loadIndividualEpisodeData(){
  var tvID = getUrlVars()["id"]; //sets tvID to url var id
  var actualEpisode = episodeSelected - 100; //removes 100 to get real ep num
  $.ajax({ //calls AJAX
    //sets url to tvID, season, selected and episode
    url: "https://api.themoviedb.org/3/tv/" + tvID + "/season/" + seriesSelected + "/episode/" + actualEpisode,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707"}, //sets api key
    dataType: "json", //sets type
    success: function (result, status, xhr) { //on success
      var epName = result["name"]; //sets epName
      // console.log(epName);
      var airDate = result["air_date"]; //sets airDate
      var epDescription = result["overview"]; //sets epDescription
      if (epDescription == ""){epDescription = "No Description is Available";} //if no description set to default
      var allEpisodes = '<div>' + epName + '</div>'; //sets allEpisodes var
      //adds data to allEpisodes variable
      allEpisodes += '\n<div class="moreLittleInfo"> Season ' + seriesSelected + ', Episode ' + actualEpisode + '</div>';
      allEpisodes += '\n<div class="moreLittleInfo"> Air Date: ' + airDate + '</div>';
      allEpisodes += '\n<div class="episodeDescription">' + epDescription + '</div>';

      // console.log(allEpisodes);
      //sets element html
      $("#seriesEpisodeInfoContainer").html(allEpisodes);
      // console.log("loadEpisodeData INDIVIDUAL");

    },
    error: function (xhr, status, error) { //on error run error message
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

// calls the API of most popular genres, films and tv
function CallAPILoadPopularMedia(media, page) {
  //checks if genreSelected
  if (genreSelected !== null){
    console.log("genre has been selected: " + genreSelected);
    //checks if media type is movie
    if(media == "movie"){
      //calls api including genre for movie
      var apiCall =  "https://api.themoviedb.org/3/genre/" + genreSelected + "/movies?&page=" + page
    } else {
      //calls api including genre for tv
      var apiCall =  "https://api.themoviedb.org/3/discover/tv?&sort_by=popularity.desc&page=" + page + "&with_genres=" + genreSelected
    }
  } else{
    //calls api for popular movies
    if(media == "movie"){
      var apiCall =  "https://api.themoviedb.org/3/movie/popular?&page=" + page
    } else {
      //calls api for popular tv shows
      var apiCall =  "https://api.themoviedb.org/3/tv/popular?&page=" + page
    }
  }
  $.ajax({ //calls AJAX
    url: apiCall, //cals ajax on url var previously set
    // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
    data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" }, //sets api key
    dataType: "json", //sets type
    success: function (result, status, xhr) { //on success run

      //for loop to run for each result
      for (i = 0; i < result["results"].length; i++) {
        //sets variables
        var movieid = result["results"][i]["id"];
        var movieLocation = movieid;
        var image = result["results"][i]["poster_path"] == null ? "/public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

        //sets allResults to new html for movie posters
        allResults.append("<div id=" + movieid + "  class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieLocation + " name=" + searchType + ">" + '<form action="/favourite" method="POST"> <input type="image" src="/public/images/favourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + "<img id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>"  + "</div></div>");
      }
      if (page == 10){ //if last page close divs
        allResults.append("</div>");
      }
      //sets elements to html
      $("#message").append(allResults);
    },
    error: function (xhr, status, error) { //on error run error message
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}
