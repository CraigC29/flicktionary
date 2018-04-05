var pagePos = 3;
var amountPages = 1;
var allResults = "";
var searchType = "movie";
var numSeries = 0;
var numEpisodes = 0;
var seriesSelected = 1;
var episodeSelected = 1;

$(function(){


  $('#searchform').submit(function() {

    var searchterms = $("#searchterms").val();
    getResultsFromTMDB(searchterms);
    return false;
  });

});

$(document).ready(function () {
  // CallAPILoadPopularMovies();
  $("#submit").click(function (e) {
    var validate = Validate();
    if (validate.length == 0) {
      if (searchType == "movie"){
        CallAPI(1);
      } else {
        CallTVAPI(1);
      }
    }
  });

  function CallAPI(page) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false",
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
      dataType: "json",
      success: function (result, status, xhr) {
        pagePos = result["total_pages"];
        amountPages = result["total_pages"];

        allResults = $('<div class="resultDiv container" id="mainStuff">');
        for (i = 0; i < result["results"].length; i++) {
          var movieid = result["results"][i]["id"];
          var movieLocation = i;
          var image = result["results"][i]["poster_path"] == null ? "image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

          allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openPage()' id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
        }

        if (amountPages == 1){
          allResults.append("</div>");
          printResults();
        } else {
          loadAllPages(amountPages);
        }
      },
      error: function (xhr, status, error) {
        $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
      }
    });
    slowScroll();
  }

  function slowScroll(){
    window.setTimeout(scrollDown,500);
    function scrollDown(){
      $('html, body').animate({
        scrollTop: $("#button").offset().top
      }, 2000);
    }
  }

  function loadAllPages(numOfPages){
    var complete = false;
    if (numOfPages > 10) {numOfPages = 10;}
    for (i = 2; i <= numOfPages; i++){
      console.log("Running on loop: " + i);
      CallAPILoad(i);
      if (i == numOfPages){
        console.log("Complete = true");
        complete = true;
      }
    }
    if (complete = true){
      printResults();
    }

  }

  function loadAllPagesTV(numOfPages){
    var complete = false;
    if (numOfPages > 10) {numOfPages = 10;}
    for (i = 2; i <= numOfPages; i++){
      console.log("Running on loop: " + i);
      CallAPITVLoad(i);
      if (i == numOfPages){
        console.log("Complete = true");
        complete = true;
      }
    }
    if (complete = true){
      printResults();
    }

  }

  function printResults(){
    console.log("Printing All Results");
    $("#message").html(allResults);
  }

  function CallAPILoad(page) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false",
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
            var movieLocation = i;
            var image = result["results"][i]["poster_path"] == null ? "image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

            allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openPage()' id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
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

  function CallAPILoadPopularTV() {
        var page = 1;
        $.ajax({
          url: "https://api.themoviedb.org/3/tv/popular?&page=" + page,
          // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
          data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
          dataType: "json",
          success: function (result, status, xhr) {
            allResults = $('<div class="resultDiv container" id="mainStuff">');
            for (page = 1; page <= 8; page++){
              for (i = 0; i < result["results"].length; i++) {
                var movieid = result["results"][i]["id"];
                var movieLocation = i;
                var image = result["results"][i]["poster_path"] == null ? "image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

                allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openPage()' id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>");
              }
            }
            allResults.append("</div>")
            printResults();
          },
          error: function (xhr, status, error) {
            $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
          }
        });

      }

  function CallAPITVLoad(page) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv?&query=" + $("#searchInput").val() + "&page=" + page + "&include_adult=false",
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
      dataType: "json",
      success: function (result, status, xhr) {
        if (page <= result["total_pages"]){
          if (results["total_pages"] > 1){
            showLoadMore();
          }
          console.log("Total Pages: " + result["total_pages"])
          for (i = 0; i < result["results"].length; i++) {
            var tvid = result["results"][i]["id"];
            var tvLocation = i;
            console.log(tvid);
            var image = result["results"][i]["poster_path"] == null ? "image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

            allResults.append("<div id=" + tvid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openPage()' id=" + tvLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
          }

          if (amountPages == page){
            console.log("All Pages");
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


  // TV API
  function CallTVAPI(page) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv?&query=" + $("#searchInput").val() + "&page=" + page,
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
      dataType: "json",
      success: function (result, status, xhr) {
        pagePos = result["total_pages"];
        amountPages = result["total_pages"];

        console.log("Amount Of Pages Inside CallAPI = " + amountPages);
        console.log("Total Pages According to actual API: " + result["total_pages"]);

        // var allResults = $('<div class="resultDiv container">');
        allResults = $('<div class="resultDiv container">');
        for (i = 0; i < result["results"].length; i++) {
          var tvid = result["results"][i]["id"];
          var tvLocation = i;
          console.log(tvid);
          var image = result["results"][i]["poster_path"] == null ? "image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

          allResults.append("<div id=" + tvid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["name"] + "\">" + "<img onClick='openPage()' id=" + tvLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
        }

        if (amountPages == 1){
          allResults.append("</div>");
          console.log("Pages = 1      Amount Pages: " + amountPages);
          printResults();
        } else {
          loadAllPagesTV(amountPages);
        }
      },
      error: function (xhr, status, error) {
        $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
      }
    });
    slowScroll();
  }

  function Validate() {
    var errorMessage = "";
    if ($("#searchInput").val() == "") {
      errorMessage += "Please Enter Search Text";
    }
    return errorMessage;
  }


  $(document).ajaxStart(function () {
    $(".imageDiv img").show();
  });

  $(document).ajaxStop(function () {
    $(".imageDiv img").hide();
  });

});

function changeToMovie(){
  searchType = "movie";
  console.log("Movie");
  document.getElementById('movieContainer').style.backgroundColor = "#ed5f25";
  // $("#searchInput").style.placeholder = "Search Movies";
  document.getElementById('seriesContainer').style.backgroundColor = "transparent";
  document.getElementById('mainBody').style.paddingTop = "170px";
  $("#message").html("");
  goHomeMovies();
}

function changeToSeries(){
  searchType = "series";
  console.log("Series");
  document.getElementById('seriesContainer').style.backgroundColor = "#ed5f25";
  document.getElementById('movieContainer').style.backgroundColor = "transparent";
  // document.getElementById('searchInput').style.placeholder = "Search Series";
  document.getElementById('mainBody').style.paddingTop = "170px";
  $("#message").html("");
  goHomeSeries();
}

function loadMovies(){
  var movieID = getUrlVars()["id"];
  loadAllMovieMedia(movieID);
}
function loadSeries(){
  var tvID = getUrlVars()["id"];
  loadAllTVMedia(tvID);
}

function loadAllMovieMedia(movieid) {
  $.ajax({
    url: "https://api.themoviedb.org/3/movie/" + movieid,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
    dataType: "json",
    success: function (result, status, xhr) {
      var image = result["poster_path"] == null ? "assets/image unavailable sized.png" : "https://image.tmdb.org/t/p/w342/" + result["poster_path"];
      image = "<img id='largeImage' src=\"" + image + "\"/>"
      var movieTitle = result["title"];
      var imdbID = result["imdb_id"];
      var description = result["overview"];
      var genres = result["genres"][0]["name"];
      var littleInfoMovie = result["runtime"] + 'mins' + ' &#9679 ' + result["release_date"] + ' &#9679 ' + genres +  '<div id="' + imdbID + '"class="imdbLink" onClick="openIMDB()">IMDB</div>';
      console.log("Test");
      $("#mainImage").html(image);
      $("#mainTitle").html(movieTitle);
      $("#littleMovieInfo").html(littleInfoMovie);
      $("#mainDesc").html(description);

    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

function loadAllTVMedia(tvID) {
  $.ajax({
    url: "https://api.themoviedb.org/3/tv/" + tvID,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
    dataType: "json",
    success: function (result, status, xhr) {
      var image = result["poster_path"] == null ? "assets/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
      image = "<img src=\"" + image + "\"/>"
      var seriesTitle = result["name"];
      var description = result["overview"];
      numSeries = result["number_of_seasons"];

      console.log("Test");

      $("#seriesInfo").html(numSeries + " Season");
      if (numSeries > 1){$("#seriesInfo").append("s");}
      var seriesDiv = "";
      var seriesEpDiv = "";
      for (i = 1; i <= numSeries; i++){
        seriesDiv += '<div id="' + i + '" class="seriesBlock" onClick="selectBlock()" onmouseover="hoverBlock()" onmouseout="unHoverBlock()">Season ' + i + '</div>';
      }

      $("#mainSeriesImage").html(image);
      $("#mainTitle").html(seriesTitle);
      $("#mainDesc").html(description);
      $("#seriesBlockContainer").html(seriesDiv);
      document.getElementById("1").click();
    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

function loadEpisodeData(season){
  var tvID = getUrlVars()["id"];
  $.ajax({
    url: "https://api.themoviedb.org/3/tv/" + tvID + "/season/" + season,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
    dataType: "json",
    success: function (result, status, xhr) {
      var numEps = result["episodes"].length;
      console.log("numEps:  " + numEps);
      var allEpisodes = "<div id='allEpisodesContainer'>"
      for(i = 100; i < (numEps + 100); i++){
        var realI = i - 100;
        var epName = result["episodes"][realI]["name"];
        var epNum = parseInt(realI) + 101
        numEpisodes = numEps;
        allEpisodes += '<div id="' + epNum + '" class="seriesBlock" onClick="selectNameBlock()" onmouseover="hoverBlock()" onmouseout="unHoverBlock()">' + epName + '</div>';
        console.log("Test: " + result["episodes"][realI]["name"]);
      }
      allEpisodes += "</div>"
      $("#seriesEpisodeContainer").html(allEpisodes);
      document.getElementById("101").click();
      console.log("loadEpisodeData");

    },
    error: function (xhr, status, error) {
      $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });
}

function loadIndividualEpisodeData(){
  var tvID = getUrlVars()["id"];
  var actualEpisode = episodeSelected - 100;
  $.ajax({
    url: "https://api.themoviedb.org/3/tv/" + tvID + "/season/" + seriesSelected + "/episode/" + actualEpisode,
    data: { "api_key": "58a54ae83bf16e590e2ef91a25247707"},
    dataType: "json",
    success: function (result, status, xhr) {
      var epName = result["name"];
      console.log(epName);
      var airDate = result["air_date"];
      var epDescription = result["overview"];
      if (epDescription == ""){epDescription = "No Description is Available";}
      var allEpisodes = '<div>' + epName + '</div>';
      allEpisodes += '\n<div class="moreLittleInfo"> Season ' + seriesSelected + ', Episode ' + actualEpisode + '</div>';
      allEpisodes += '\n<div class="moreLittleInfo"> Air Date: ' + airDate + '</div>';
      allEpisodes += '\n<div class="episodeDescription">' + epDescription + '</div>';

      console.log(allEpisodes);
      $("#seriesEpisodeInfoContainer").html(allEpisodes);
      console.log("loadEpisodeData INDIVIDUAL");

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

function openIMDB(){
  var tmdbID = event.path[0].id;
  var link = "http://www.imdb.com/title/" + tmdbID;
  openInNewTab(link);
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function goHomeSeries(){
  var urlHome = "flicktionary.html?id=Series";
  window.location.replace(urlHome);
}
function goHomeMovies(){
  var urlHome = "flicktionary.html?id=Movies";
  window.location.replace(urlHome);
}

function loadHomepage(){
  var typeSearch = getUrlVars()["id"];
  if (typeSearch == "Series"){
    searchType = "series";
    console.log("Series");
    document.getElementById('seriesContainer').style.backgroundColor = "#ed5f25";
    document.getElementById('movieContainer').style.backgroundColor = "transparent";
    document.getElementById('mainBody').style.paddingTop = "170px";
    $("#message").html("");
    $('#searchInput').attr('placeholder','Search Series');
    CallAPILoadPopularMovies("series");
  } else {
    $('#searchInput').attr('placeholder','Search Movies');
    CallAPILoadPopularMovies("movie");
  }
};

function CallAPILoadPopularMovies(media) {
    var page = 1;
    if(media == "movie"){
      var apiCall =  "https://api.themoviedb.org/3/movie/popular?&page=" + page
    } else {
      var apiCall =  "https://api.themoviedb.org/3/tv/popular?&page=" + page
    }
    $.ajax({
      url: apiCall,
      // data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" }, MY KEY REQUESTED TOO MANY TIMES
      data: { "api_key": "c12b3a760b89eacb9d0da39c84baa696" },
      dataType: "json",
      success: function (result, status, xhr) {
        allResults = $('<div class="resultDiv container" id="mainStuff">');
        for (page = 1; page <= 8; page++){
          for (i = 0; i < result["results"].length; i++) {
            var movieid = result["results"][i]["id"];
            var movieLocation = i;
            var image = result["results"][i]["poster_path"] == null ? "image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

            allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openPage()' id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>");
          }
        }
        allResults.append("</div>")
        $("#message").html(allResults);
      },
      error: function (xhr, status, error) {
        $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
      }
    });

  }

function selectBlock(){
  // console.log(event);
  for(i = 0; i < numSeries; i++){
    event.path[1].children[i].style.backgroundColor = "#2f2833";
  }
  event.path[0].style.backgroundColor = "#fc804e";
  var series = event.path[0].id;
  seriesSelected = series;
  loadEpisodeData(seriesSelected);
};

function selectNameBlock(){
  console.log(event);
  for(i = 0; i < numEpisodes; i++){
    console.log("Num episodes: " + numEpisodes);
    event.path[1].children[i].style.backgroundColor = "#2f2833";
  }
  event.path[0].style.backgroundColor = "#fc804e";
  var episode = event.path[0].id;
  episodeSelected = episode;
  loadIndividualEpisodeData();

};

function hoverBlock(){
  if (event.path[0].style.backgroundColor !== "rgb(252, 128, 78)"){
    event.path[0].style.backgroundColor = "#3a363d";
  }
};
function unHoverBlock(){
  if (event.path[0].style.backgroundColor !== "rgb(252, 128, 78)"){
    event.path[0].style.backgroundColor = "#2f2833";
  }
};

function openPage(){
  if(searchType == "movie"){
    var movieid = event.path[1].id;
    console.log(movieid);
    var urlMediaMovies = "mediaMovies.html?id=" + movieid;
    window.location.replace(urlMediaMovies);
  } else {
    var tvid = event.path[1].id;
    console.log(tvid);
    var urlMediaSeries = "mediaSeries.html?id=" + tvid;
    window.location.replace(urlMediaSeries);
  }

};

$("#submit").click(function() {
    $('html, body').animate({
        scrollTop: $("#mainStuff").offset().top
    }, 2000);
});
