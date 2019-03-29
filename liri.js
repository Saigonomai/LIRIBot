require("dotenv").config();
var moment = require('moment');
var axios = require("axios");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case "concert-this":
            if (process.argv.length > 3) {
                var artist = process.argv.slice(3).join("");
                var concertURL= "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
                axios.get(concertURL).then(
                    function(response) {
                        console.log("Venue: " + response.data[0].venue.name + "\nLocation: " + response.data[0].venue.city + "\nDate: " + moment(response.data[0].datetime, moment.ISO_8601).format("MM/DD/YYYY"));
                    }
                )
            } else {
                console.log("No artist detected.\nPlease Try Again.")
            }
            break;

        case "spotify-this-song":
            var song = "The Sign Ace of Base"
            if (process.argv.length > 3) {
                song = process.argv.slice(3).join(" ");
            }
            spotify
            .search({ type: 'track', query: song })
            .then(function(response) {
              console.log("Artist: " + response.tracks.items[0].artists[0].name);
              console.log("Song: " + response.tracks.items[0].name);
              console.log("Album: " + response.tracks.items[0].album.name);
              console.log("Spotify Preview: " + response.tracks.items[0].preview_url);
            })
            .catch(function(err) {
              console.log(err);
            });            
            break;

        case "movie-this":
            if (process.argv.length > 3) {
                var movieName = process.argv.slice(3).join("+");
                var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
                axios.get(queryUrl).then(
                    function(response){
                        console.log("Title: " + response.data.Title);
                        console.log("Release Date: " + response.data.Year);
                        console.log("IMDB Rating: " + response.data.imdbRating);

                        var rating = response.data.Ratings;
                        var RTRating = "Unavailable"
                        for (let index = 0; index < rating.length; index++) {
                            if (rating[index].Source === "Rotten Tomatoes"){
                                RTRating = rating[index].Value;
                            }
                        }
                        console.log("Rotten Tomatoes Rating: " + RTRating);

                        console.log("Country of Production: " + response.data.Country);
                        console.log("Language: " + response.data.Language);
                        console.log("Plot: " + response.data.Plot);
                        console.log("Actors: " + response.data.Actors);            
                    },

                    function(error) {
                        if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        } else if (error.request) {
                        console.log(error.request);
                        } else {
                        console.log("Error", error.message);
                        }
                        console.log(error.config);
                    }
                )
            } else {
                console.log("No movie detected.\nPlease Try Again.")
            }

            break;

        case "do-what-it-says":
            fs.readFile('random.txt', "utf8", function(err, data) {
                data = data.split(",")
                data[1] = data[1].replace(/"/g, "");

                switch (data[0]) {
                    case "concert-this":
                        var artist = data[1];
                        var concertURL= "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
                        axios.get(concertURL).then(
                            function(response) {
                                console.log("Venue: " + response.data[0].venue.name + "\nLocation: " + response.data[0].venue.city + "\nDate: " + moment(response.data[0].datetime, moment.ISO_8601).format("MM/DD/YYYY"));
                            }
                        )
                        break;
            
                    case "spotify-this-song":
                        var song = "The Sign Ace of Base"
                        if (data.length > 1) {
                            song = data[1];
                        }
                        spotify
                        .search({ type: 'track', query: song })
                        .then(function(response) {
                          console.log("Artist: " + response.tracks.items[0].artists[0].name);
                          console.log("Song: " + response.tracks.items[0].name);
                          console.log("Album: " + response.tracks.items[0].album.name);
                          console.log("Spotify Preview: " + response.tracks.items[0].preview_url);
                        })
                        .catch(function(err) {
                          console.log(err);
                        });            
                        break;
            
                    case "movie-this":
                        var movieName = data[1];
                        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
                        axios.get(queryUrl).then(
                            function(response){
                                console.log("Title: " + response.data.Title);
                                console.log("Release Date: " + response.data.Year);
                                console.log("IMDB Rating: " + response.data.imdbRating);
            
                                var rating = response.data.Ratings;
                                var RTRating = "Unavailable"
                                for (let index = 0; index < rating.length; index++) {
                                    if (rating[index].Source === "Rotten Tomatoes"){
                                        RTRating = rating[index].Value;
                                    }
                                }
                                console.log("Rotten Tomatoes Rating: " + RTRating);
            
                                console.log("Country of Production: " + response.data.Country);
                                console.log("Language: " + response.data.Language);
                                console.log("Plot: " + response.data.Plot);
                                console.log("Actors: " + response.data.Actors);            
                            },
            
                            function(error) {
                                if (error.response) {
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                                } else if (error.request) {
                                console.log(error.request);
                                } else {
                                console.log("Error", error.message);
                                }
                                console.log(error.config);
                            }
                        )
            
                        break;
                }

            });
            break;
    
    }
    
} else {
    console.log("Not enough arguments.\nPlease Try Again.")
}
