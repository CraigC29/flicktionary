// This is the list of variables being set. pagePos is set to 3,
//amountPages is set to 1, allResults is all possible results of a search,
//searchType is for searching movies, numSeries is setting the number of series to 0 and numEpisodes is setting the number of episodes to 0,
//seriesSelected and episodeSelected is set to 1, isDelving being set to false means that a user has no onger selected a media typer (movies or series)
//test

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


// Search terms are set so that the user gets resulsts for what they search
$(function(){
  $('#searchform').submit(function() {
    var searchterms = $("#searchterms").val();
    genreSelected = null;
    getResultsFromTMDB(searchterms);
    return false;
  });
});

$(document).ready(function () {

// favourite media function allows user to select favourite movies/series to save for later
  $(".favMedia").each(function() {
      $("#movieText").text("Favourite Movies");
      var movieid = $(this).attr('id');
      console.log("The id: " + movieid);
      $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + movieid,
        data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
        dataType: "json",
        success: function (result, status, xhr) {
          var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          image = "<img class='imageClick' src=\"" + image + "\"/>"
          var movieTitle = result["title"];
          var media = "movie";
          var movieMedia = "<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + movieTitle + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieid + " name='movie'>" + '<form action="/unFavourite" method="POST"> <input type="image" src="/public/images/unFavourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + image + "</div></div>"

          $("#" + movieid).html(movieMedia);
        },
        error: function (xhr, status, error) {
          $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
      });
  });

  $(".favSeries").each(function() {
      $("#seriesText").text("Favourite Series");
      var seriesid = $(this).attr('id');
      console.log("The id: " + seriesid);
      $.ajax({
        url: "https://api.themoviedb.org/3/tv/" + seriesid,
        data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
        dataType: "json",
        success: function (result, status, xhr) {
          var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          image = "<img class='imageClick' src=\"" + image + "\"/>"
          var seriesTitle = result["title"];
          var media = "series";
          var seriesMedia = "<div id=" + seriesid + " class=\"result\" resourceId=\" titleText=\"" + seriesTitle + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + seriesid + " name='series'>" + '<form action="/unFavourite" method="POST"> <input type="image" src="/public/images/unFavourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + seriesid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + image + "</div></div>"

          $("#" + seriesid).html(seriesMedia);
        },
        error: function (xhr, status, error) {
          $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
      });
  });

// genre button allows user to select genre
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

  // If the media type is movie it will search movies and if not it will search TV series
  // Request api key, page position of results set
  function CallAPI(page, media) {

    if(media == "movie"){
      var apiCall =  "https://api.themoviedb.org/3/search/movie?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    } else {
      var apiCall =  "https://api.themoviedb.org/3/search/tv?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    }
    $.ajax({
      url: apiCall,
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
      dataType: "json",
      success: function (result, status, xhr) {
        pagePos = result["total_pages"];
        amountPages = result["total_pages"];

        allResults = $('<div class="resultDiv container" id="mainStuff">');
        for (i = 0; i < result["results"].length; i++) {
          var movieid = result["results"][i]["id"];
          var movieLocation = movieid;
          var image = result["results"][i]["poster_path"] == null ? "/public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

          allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieLocation + " name=" + searchType + ">" + '<form action="/favourite" method="POST"> <input type="image" src="/public/images/favourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + "<img id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>"  + "</div></div>")
        }
// This sets which/where results appear and also inserts an image unavailable image
        if (amountPages == 1){
          allResults.append("</div>");
          printResults();
        } else {
          loadAllPages(amountPages, media);
        }
      },
      error: function (xhr, status, error) {
        $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
      }
    });
  }

// loads different genres
  function loadGenre(genre){
    genreSelected = genre;
    console.log(genreSelected);
  }
// allows favourites to be added
  function addFavourite(){
    console.log("adding favourite function called");
  }
// Sets all results to appear on the same page
  function loadAllPages(numOfPages, media){
    var complete = false;
    if (numOfPages > 10) {numOfPages = 10;}
    for (i = 2; i <= numOfPages; i++){
      // console.log("Running on loop: " + i);
      CallAPILoad(i, media);
      if (i == numOfPages){
        // console.log("Complete = true");
        complete = true;
      }
    }
    if (complete = true){
      printResults();
    }

  }

  function printResults(){
    // console.log("Printing All Results");
    $("#message").html(allResults);
  }

  function CallAPILoad(page, media) {
    if(media == "movie"){
      var apiCall =  "https://api.themoviedb.org/3/search/movie?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    } else {
      var apiCall =  "https://api.themoviedb.org/3/search/tv?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    }
    $.ajax({
      url: apiCall,
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
      dataType: "json",
      success: function (result, status, xhr) {
        if (page <= result["total_pages"]){
          if (results["total_pages"] > 1){
            showLoadMore();
          }
          for (i = 0; i < result["results"].length; i++) {
            var movieid = result["results"][i]["id"];
            var movieLocation = movieid;
            var image = result["results"][i]["poster_path"] == null ? "/public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];
            allResults.append("<div id=" + movieid + "  class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieLocation + " name=" + searchType + ">" + '<form action="/favourite" method="POST"> <input type="image" src="/public/images/favourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + "<img id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>"  + "</div></div>")
          }
          if (amountPages == page){
            allResults.append("</div>");
          }
        } else {
          hideLoadMore();
        }
      },
      error: function (xhr, status, error) {
        $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
      }
    });

  }
// validates to check there is a search input
  function Validate() {
    var errorMessage = "";
    if ($("#searchInput").val() == "") {
      errorMessage += "Please Enter Search Text";
    }
    return errorMessage;
  }

// shows classes imageDiv and image
  $(document).ajaxStart(function () {
    $(".imageDiv img").show();
  });

  $(document).ajaxStop(function () {
    $(".imageDiv img").hide();
  });

});
// changes results to movies only
function changeToMovie(){
  searchType = "movie";
  // console.log("Movie");
  document.getElementById('movieContainer').style.backgroundColor = "#ed5f25";
  // $("#searchInput").style.placeholder = "Search Movies";
  document.getElementById('seriesContainer').style.backgroundColor = "transparent";
  document.getElementById('mainBody').style.paddingTop = "170px";
  $("#message").html("");
  goHomeMovies();
}
// loads the sign up page
function loadSignUp(){
  var url = "/adduser";
  window.location.replace(url);
}
// changes results to series only
function changeToSeries(){
  searchType = "series";
  // console.log("Series");
  document.getElementById('seriesContainer').style.backgroundColor = "#ed5f25";
  document.getElementById('movieContainer').style.backgroundColor = "transparent";
  // document.getElementById('searchInput').style.placeholder = "Search Series";
  document.getElementById('mainBody').style.paddingTop = "170px";
  $("#message").html("");
  goHomeSeries();
}

// loads movies
function loadMovies(){
  var movieID = getUrlVars()["id"];
  loadAllMovieMedia(movieID);
  isDelving == true;
}
// loads series
function loadSeries(){
  var tvID = getUrlVars()["id"];
  loadAllTVMedia(tvID);
  isDelving == true;
}
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
// resizes window
$(window).resize(function(){
  if (searchType == "series" && isDelving == true){
    var imageHeight = $("#seriesMediaHeight").height();
    document.getElementById("blurredImage").height = imageHeight + 60;
    var blockHeight = ((imageHeight / 10) * 5.5);
    console.log("blockHeight: " + blockHeight);
    document.getElementById("blockSeries").setAttribute("style","max-height:" + (blockHeight * 0.8) + "px");
    document.getElementById("blockEp").setAttribute("style","max-height:" + (blockHeight * 0.8) + "px");
    document.getElementById("seriesEpisodeInfoContainer").setAttribute("style","max-height:" + (blockHeight * 0.8) + "px");
  } else if(searchType == "movie" && isDelving == true){
    var windowHeight = $(window).height() - 40;
    console.log("window height: " + windowHeight);
    document.getElementById("movieMediaContainer").setAttribute("style","height:" + windowHeight + "px");
  }
});

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

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}
// opens IMDB url
function openIMDB(){
  var tmdbID = event.path[0].id;
  var link = "http://www.imdb.com/title/" + tmdbID;
  openInNewTab(link);
}
// opens IMDB in a new tab
function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}
// takes user to homepage from series
function goHomeSeries(){
  var urlHome = "/?id=Series";
  isDelving == false;
  window.location.replace(urlHome);
}
// takes user to homepage from movies
function goHomeMovies(){
  var urlHome = "/?id=Movies";
  isDelving == false;
  window.location.replace(urlHome);
}
// takes user to the login page
function login(){
  var urlHome = "/login";
  isDelving == false;
  window.location.replace(urlHome);
}
// takes user to the logout page
function logout(){
  var urlHome = "/logout";
  isDelving == false;
  window.location.replace(urlHome);
}
// takes user to the modify user page
function modifyUser(){
  var url = "/remUser";
  isDelving == false;
  window.location.replace(url);
}
// takes user the the account page
function openAccount(){
  var urlHome = "/profile";
  isDelving == false;
  window.location.replace(urlHome);
}
// loads the home page
// search for tv series
function loadHomepage(){
  var typeSearch = getUrlVars()["id"];
  if (typeSearch == "Series"){
    searchType = "series";
    // console.log("Series");
    document.getElementById('seriesContainer').style.backgroundColor = "#ed5f25";
    document.getElementById('movieContainer').style.backgroundColor = "transparent";
    document.getElementById('mainBody').style.paddingTop = "170px";
    $("#message").html("");
    $('#searchInput').attr('placeholder','Search Series');
    allResults = $('<div class="resultDiv container" id="mainStuff">');
    for(i = 1; i <= 8; i++){
      CallAPILoadPopularMedia("series", i);
    }
  } else {
    $('#searchInput').attr('placeholder','Search Movies');
    allResults = $('<div class="resultDiv container" id="mainStuff">');
    for(i = 1; i <= 8; i++){
      CallAPILoadPopularMedia("movie", i);
    }
  }
};
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

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
}

function showDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

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
