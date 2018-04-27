//Declaring variables used in documentReady js
var pagePos = 3;
var amountPages = 1;
var allResults = "";
var searchType = "movie";
var genreSelected = null;

$(document).ready(function () { //runs when document is ready

  $(".favMedia").each(function() { //runs on each favourite media for favMedia class
      $("#movieText").text("Favourite Movies"); //as one exists changes text to Favourite Movies
      var movieid = $(this).attr('id'); //sets variable to id of current item
      console.log("The id: " + movieid);
      $.ajax({ //calls AJAZ
        url: "https://api.themoviedb.org/3/movie/" + movieid, //sets url to API and movieid
        data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, //sets api key
        dataType: "json",  //sets type
        success: function (result, status, xhr) { //runs on success
          //sets image to api result for image
          var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          image = "<img class='imageClick' src=\"" + image + "\"/>"

          //sets movie title, type and html
          var movieTitle = result["title"];
          var media = "movie";
          var movieMedia = "<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + movieTitle + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieid + " name='movie'>" + '<form action="/unFavourite" method="POST"> <input type="image" src="/public/images/unFavourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + image + "</div></div>"

          //sets html of correct element
          $("#" + movieid).html(movieMedia);
        },
        error: function (xhr, status, error) { //error message on error
          $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
      });
  });

  $(".favSeries").each(function() { //runs on each favourite series for favSeries class
      $("#seriesText").text("Favourite Series"); //as one exists sets text to Favourite Series
      var seriesid = $(this).attr('id'); //sets variable to element id
      console.log("The id: " + seriesid);
      $.ajax({ //calls AJAX
        url: "https://api.themoviedb.org/3/tv/" + seriesid, //sets url to api + seriesid
        data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, //sets api key
        dataType: "json", //sets type
        success: function (result, status, xhr) { //runs on success
          //sets image to api result for image
          var image = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          var imageSRC  = result["poster_path"] == null ? "assets//public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
          image = "<img class='imageClick' src=\"" + image + "\"/>"

          //sets series title, type and html
          var seriesTitle = result["title"];
          var media = "series";
          var seriesMedia = "<div id=" + seriesid + " class=\"result\" resourceId=\" titleText=\"" + seriesTitle + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + seriesid + " name='series'>" + '<form action="/unFavourite" method="POST"> <input type="image" src="/public/images/unFavourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + seriesid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + image + "</div></div>"

          //sets html of element
          $("#" + seriesid).html(seriesMedia);
        },
        error: function (xhr, status, error) { //error message on error
          $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
      });
  });

// genre button allows user to select genre
  $(document).on('click', ".genreSelectButton", function() {
    var genre = $(this).attr('id'); //sets genre to correct id
    if (genre != "clear"){ //if selected anything but clear
      var genreText = $(this).text(); //set text to genre selected
      $("#genreButtonMain").text("Genre: " + genreText); //actually set text
      genreSelected = genre; //sets global genreSelected variable
      console.log(genreSelected); //print genre
    } else { //if selected clear
      $("#genreButtonMain").text("Genre"); //sets text to default
      genreSelected = null; //selected no genre
    }
    $("#message").html(""); //sets html of home to nothing
    loadHomepage(); //runs loadHomepage function
    });

  // Search bar when key clicked
  $("#searchInput").keyup(function() {
    if (event.keyCode === 13) { //if key is 13 (enter)
      document.getElementById("submit").click(); //run click event on submit element
    }
  });

  //on click of submit button
  $("#submit").click(function (e) {
    var validate = Validate(); //set validation variable
    if (validate.length == 0) { //checks validation
      if (searchType == "movie" || searchType == ""){ //if type is movie
        CallAPI(1, "movie"); //run CallAPI with movie
      } else { //if type isnt movie
        CallAPI(1, "series"); //run CallAPI with series
      }
    }
  });

  function CallAPI(page, media) {
    //If the media type is movie it will search movies and if not it will search TV series
    if(media == "movie"){
      var apiCall =  "https://api.themoviedb.org/3/search/movie?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    } else {
      var apiCall =  "https://api.themoviedb.org/3/search/tv?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    }
    $.ajax({ //call AJAX
      url: apiCall, //sets url to apiCall var
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" }, //sets api key
      dataType: "json", //sets type
      success: function (result, status, xhr) { //on success runs
        //set pagePos and amountPages global vars to api result
        pagePos = result["total_pages"];
        amountPages = result["total_pages"];

        //set allResults
        allResults = $('<div class="resultDiv container" id="mainStuff">');
        //for every result
        for (i = 0; i < result["results"].length; i++) {
          //set id, location and image to api results
          var movieid = result["results"][i]["id"];
          var movieLocation = movieid;
          var image = result["results"][i]["poster_path"] == null ? "/public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

          //add html to page
          allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieLocation + " name=" + searchType + ">" + '<form action="/favourite" method="POST"> <input type="image" src="/public/images/favourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + "<img id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>"  + "</div></div>")
        }
        // This sets which/where results appear and also inserts an image unavailable image
        //if there is only one page
        if (amountPages == 1){
          allResults.append("</div>"); //add closing div
          printResults(); //show results
        } else {
          //load amount of pages and media attached to it
          loadAllPages(amountPages, media);
        }
      },
      error: function (xhr, status, error) { //run on error
        $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
      }
    });
  }

// loads different genres
  function loadGenre(genre){
    genreSelected = genre;
    console.log(genreSelected);
  }
// shows console on addFavourite method call
  function addFavourite(){
    console.log("adding favourite function called");
  }

// Sets all results to appear on the same page
  function loadAllPages(numOfPages, media){
    var complete = false; //isnt complete if called
    if (numOfPages > 10) {numOfPages = 10;} //sets num pages to 10 max
    for (i = 2; i <= numOfPages; i++){ //run for extra pages
      // console.log("Running on loop: " + i);
      CallAPILoad(i, media); //call api load method with pageNum
      if (i == numOfPages){ //complete if on last page
        // console.log("Complete = true");
        complete = true; //set complete
      }
    }
    if (complete = true){ //if complete
      printResults(); //show results
    }

  }

//outputs all results
  function printResults(){
    // console.log("Printing All Results");
    $("#message").html(allResults); //show allResults var
  }

//Calls the api to show all the movies that have been searched for
  function CallAPILoad(page, media) {
    if(media == "movie"){ //if type = movie set apiCall to movie query
      var apiCall =  "https://api.themoviedb.org/3/search/movie?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    } else { //else set apiCall to series query
      var apiCall =  "https://api.themoviedb.org/3/search/tv?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false"
    }
    $.ajax({ //call AJAX
      url: apiCall, //set url to apiCall
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" }, //set api key
      dataType: "json", //set type
      success: function (result, status, xhr) { //on sucess run
        if (page <= result["total_pages"]){ //if page is not yet final page
          if (results["total_pages"] > 1){ //if total pages > 1
            showLoadMore(); //run showLoadMore function
          }
          //for every result
          for (i = 0; i < result["results"].length; i++) {
            //set id, location and image vars
            var movieid = result["results"][i]["id"];
            var movieLocation = movieid;
            var image = result["results"][i]["poster_path"] == null ? "/public/images/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];
            //add html to allResults
            allResults.append("<div id=" + movieid + "  class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<div class='imageOverlayPoster'> <div class='posterOverlay' id=" + movieLocation + " name=" + searchType + ">" + '<form action="/favourite" method="POST"> <input type="image" src="/public/images/favourite.png" class="favouriteIcon" name="favMed" id="favourite" value="' + movieid + '"> <input name="typeMedia" value="' + media +'" class="mediaTypePass"></form>' + "</div>" + "<img id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>"  + "</div></div>")
          }
          if (amountPages == page){ //if pages is amount pages
            allResults.append("</div>"); //add closing div
          }
        } else { //if not
          hideLoadMore(); //run hideLoadMore function
        }
      },
      error: function (xhr, status, error) { //on error show error message
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
