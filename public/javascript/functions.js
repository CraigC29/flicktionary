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
