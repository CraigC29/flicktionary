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
        //if there is only one page
        if (amountPages == 1){
          allResults.append("</div>");
          printResults();
        } else {
          //load amount of pages and media attached to it
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

//outputs all results
  function printResults(){
    // console.log("Printing All Results");
    $("#message").html(allResults);
  }

//Calls the api to show all the movies that have been searched for
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
    //if there is nothing in the search bar comes back with error message
    if ($("#searchInput").val() == "") {
      errorMessage += "Please Enter Search Text";
    }
    return errorMessage;
  }

// shows classes imageDiv and image
  $(document).ajaxStart(function () {
    $(".imageDiv img").show();
  });
//hides classes imageDiv and image
  $(document).ajaxStop(function () {
    $(".imageDiv img").hide();
  });

});
