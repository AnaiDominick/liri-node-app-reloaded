//Grab Packages
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

var inputString = process.argv;
var operand = inputString[2];

if (operand === "concert-this") {
  var band = inputString[3];
  searchBandsInTown(band);
}
else if (operand === "movie-this") {
  var movie = inputString[3];
  searchMovie(movie);
}
else if (operand === "spotify-this-song") {
  var track = inputString[3];
  searchSong(track);
}
else if (operand === "do-what-it-says") {
  searchRandom();
}


//BandsinTown URL
//concert-this <artist/band name here>
function searchBandsInTown(band) {

  var divider = "\n---------------------------------------------------\n";

  axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=99ba5a2274cf279df970ff5b9976febf").then(
    function (response) {
      var data = response.data[0];
      var showData = [
        "The band's name is: " + data.lineup,
        "The next concert is in : " + data.venue.city + ", " + data.venue.country,
        "The date of the concert is on : " + moment(data.datetime).format("MM/DD/YYYY")
      ].join("\n\n");

      fs.appendFile("log.txt", showData + divider, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(showData)
        }
      });

    })
    .catch(function (error) {
      console.log(error);
    });
};


//OMDb 
//movie-this '<movie name here>'`
function searchMovie(movie) {

  var divider = "\n---------------------------------------------------\n";

  //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  if (!movie) {
    axios.get("http://www.omdbapi.com/?t=" + "Mr.Nobody" + "&y=&plot=short&apikey=15fd16a6").then(
      function (response) {

        var response = response.data;
        var showData = [
          "Name of the movie: " + response.Title,
          "Year the movie came out is: " + response.Year,
          "IMDB Rating of the movie is: " + response.imdbRating,
          "Rotten Tomatoes Rating of the movie is: " + response.Ratings[1].Value,
          "Country where the movie was produced: " + response.Country,
          "Language of the movie: " + response.Language,
          "Plot of the movie: " + response.Plot,
          "Actors in the movie: " + response.Actors
        ].join("\n\n");

        fs.appendFile("log.txt", showData + divider, function (err) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(showData)
          }
        });

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  else {

    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=15fd16a6").then(
      function (response) {

        var response = response.data;
        var showData = [
          "Name of the movie: " + response.Title,
          "Year the movie came out is: " + response.Year,
          "IMDB Rating of the movie is: " + response.imdbRating,
          "Rotten Tomatoes Rating of the movie is: " + response.Ratings[1].Value,
          "Country where the movie was produced: " + response.Country,
          "Language of the movie: " + response.Language,
          "Plot of the movie: " + response.Plot,
          "Actors in the movie: " + response.Actors
        ].join("\n\n");

        fs.appendFile("log.txt", showData + divider, function (err) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(showData)
          }
        });

      })
      .catch(function (error) {
        console.log(error);
      });
  }

};



//Spotify
//spotify-this-song '<song name here>'`
function searchSong(track) {

  var keys = require("./keys.js");
  var spotify = new Spotify(keys.spotify);

  var divider = "\n---------------------------------------------------\n";

  //If no song is provided then your program will default to "The Sign" by Ace of Base.
  if (!track) {

    spotify
      .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
      .then(function (data) {
        
        var showData = [
        "This song is played by: " + data.artists[0].name,
        "The name of the song is: " + data.name,
        "It belong's to the album: " + data.album.name,
        "Here is a preview link of the song: " + data.preview_url
      ].join("\n\n");

      fs.appendFile("log.txt", showData + divider, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(showData)
        }
      });

      })
      .catch(function (err) {
        console.error('Error occurred: ' + err);
      });
  }

  else {
    spotify.search({ type: 'track', query: track, limit: "4" }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      var response = data.tracks.items[0];
      var showData = [
        "This song is played by: " + response.artists[0].name,
        "The name of the song is: " + response.name,
        "It belong's to the album: " + response.album.name,
        "Here is a preview link of the song: " + response.preview_url
      ].join("\n\n");

      fs.appendFile("log.txt", showData + divider, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(showData)
        }
      });

    });
  }

}



//`node liri.js do-what-it-says`
//It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
function searchRandom() {

  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");

    var instruccion = dataArr[0];
    var argumento = dataArr[1];

    switch (instruccion) {
      case "concert-this":
        searchBandsInTown(argumento);
        break;
      case "movie-this":
        searchMovie(argumento)
        break;
      case "spotify-this-song":
        searchSong(argumento);
        break;
    }
  });
}


