var pagePos = 3;
var amountPages = 1;
var allResults = "";
var searchType = "movie";

$(function(){


  $('#searchform').submit(function() {

    var searchterms = $("#searchterms").val();
    getResultsFromTMDB(searchterms);
    return false;
  });

  // var movieButton = document.getElementById('movieButton');
  // movieButton.onClick = function(){
  //   changeToMovie();
  // };
  //
  // var seriesButton = document.getElementById('seriesButton');
  // movieButton.onClick = function(){
  //   changeToSeries();
  // };

});

$(document).ready(function () {

    $("#submit").click(function (e) {
        closeSide();
        mainBody.style.paddingTop = "100px";


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

              console.log("Amount Of Pages Inside CallAPI = " + amountPages);
              console.log("Total Pages According to actual API: " + result["total_pages"]);

                // var allResults = $('<div class="resultDiv container">');
                allResults = $('<div class="resultDiv container">');
                  for (i = 0; i < result["results"].length; i++) {
                      var movieid = result["results"][i]["id"];
                      var movieLocation = i;
                      console.log(movieid);
                      var image = result["results"][i]["poster_path"] == null ? "assets/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

                      allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openSide()' id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
                  }

                if (amountPages == 1){
                  allResults.append("</div>");
                  console.log("Pages = 1      Amount Pages: " + amountPages);
                  printResults();
                } else {
                  loadAllPages(amountPages);
                }
            },
            error: function (xhr, status, error) {
                $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        });
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

  // TV
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
                console.log("Total Pages: " + result["total_pages"])
                for (i = 0; i < result["results"].length; i++) {
                    var movieid = result["results"][i]["id"];
                    var movieLocation = i;
                    console.log(movieid);
                    var image = result["results"][i]["poster_path"] == null ? "assets/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

                    allResults.append("<div id=" + movieid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openSide()' id=" + movieLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
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
                    var image = result["results"][i]["poster_path"] == null ? "assets/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

                    allResults.append("<div id=" + tvid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["title"] + "\">" + "<img onClick='openSide()' id=" + tvLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
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
                      var image = result["results"][i]["poster_path"] == null ? "assets/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["results"][i]["poster_path"];

                      allResults.append("<div id=" + tvid + " class=\"result\" resourceId=\" titleText=\"" + result["results"][i]["name"] + "\">" + "<img onClick='openSide()' id=" + tvLocation + " class ='imageClick' src=\"" + image + "\"/>" + "</div>")
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


function closeSide(){
  var bar = document.getElementById("sideBar");
  bar.style.width = "0%";
  bar.style.visibility = "hidden";

  var main = document.getElementById("movieBar");
  main.style.width = "100%";
};

function changeToMovie(){
  searchType = "movie";
  console.log("Movie");
  document.getElementById('movieContainer').style.backgroundColor = "#ed5f25";
  document.getElementById('seriesContainer').style.backgroundColor = "transparent";
  document.getElementById('mainBody').style.paddingTop = "170px";
  $("#message").html("");
}

function changeToSeries(){
  searchType = "series";
  console.log("Series");
  document.getElementById('seriesContainer').style.backgroundColor = "#ed5f25";
  document.getElementById('movieContainer').style.backgroundColor = "transparent";
  document.getElementById('mainBody').style.paddingTop = "170px";
  $("#message").html("");
}

function openSide(){
  // console.log(event);
  //       var bar = document.getElementById("sideBar");
  //       bar.style.width = "30%";
  //       bar.style.visibility = "visible";
  //
  //       var main = document.getElementById("movieBar");
  //       main.style.width = "70%";
  //
  //       var movieLocation = event.path[0].id;
  //       console.log(movieLocation);
  //
  //       var movieid = event.path[1].id;
  //       console.log(movieid);
  //
  //       $.ajax({
  //           url: "https://api.themoviedb.org/3/movie/" + movieid,
  //           data: { "api_key": "58a54ae83bf16e590e2ef91a25247707" },
  //           dataType: "json",
  //           success: function (result, status, xhr) {
  //                   var resultHtml = $('<div class="sideText">');
  //                   console.log(movieLocation);
  //
  //
  //                   var image = result["poster_path"] == null ? "assets/image unavailable sized.png" : "https://image.tmdb.org/t/p/w154/" + result["poster_path"];
  //
  //                   resultHtml.append("<div class='thumbnailImage'> <img src=\"" + image + "\"/>" + "</div> <div class='sideInfo'>" + result["title"] + "<br><br>" + "Description: " + result["overview"])
  //
  //               resultHtml.append("</div>");
  //               $("#moreDetails").html(resultHtml);
  //
  //           },
  //           error: function (xhr, status, error) {
  //               $("#message").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
  //           }
  //       });

  app.get('/', function(req, res){
    var movieid = event.path[1].id;
    console.log(movieid);

    res.render('mediaMovies', {
      movieid: movieid
    });
  });



};
