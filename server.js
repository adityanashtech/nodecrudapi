const { randomUUID } = require("crypto");
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const saveMovieData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("data/movies.json", stringifyData);
};

const getMovieData = () => {
  const jsonData = fs.readFileSync("data/movies.json");
  return JSON.parse(jsonData);
};

// METHOD TO GET ALL MOVIES

app.get("/movie/list", (req, res) => {
  const movies = getMovieData();
  res.send(movies);
});

// METHOD TO ADD A MOVIE

app.post("/movie/add", (req, res) => {
  const existMovie = getMovieData();
  let movieId = randomUUID();
  const movieData = req.body;
  movieData.id = movieId;
  if (
    movieData.title == null ||
    movieData.year == null ||
    movieData.genre == null ||
    movieData.rating == null
  ) {
    return res.status(401).send({ error: true, msg: "Movie data missing" });
  }
  const findExist = existMovie.find((movie) => movie.title === movieData.title);
  if (findExist) {
    return res.status(409).send({ error: true, msg: "movie already exist" });
  }
  existMovie.push(movieData);
  saveMovieData(existMovie);
  res.send({ success: true, msg: "Movie added successfully" });
});

// METHOD TO UPDATE A MOVIE

app.put("/movie/update/:id", (req, res) => {
  const id = req.params.id;
  const movieData = req.body;
  const existMovie = getMovieData();
  const findExist = existMovie.find((movie) => movie.id === id);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "Movie ID not exist" });
  }
  const updateMovie = existMovie.filter((movie) => movie.id !== id);
  updateMovie.push(movieData);
  saveMovieData(updateMovie);
  res.send({ success: true, msg: "Movie updated successfully" });
});

// METHOD TO DELETE A MOVIE

app.delete("/movie/delete/:id", (req, res) => {
  const id = req.params.id;
  const existMovie = getMovieData();
  const filterMovie = existMovie.filter((movie) => movie.id !== id);
  if (existMovie.length === filterMovie.length) {
    return res.status(409).send({ error: true, msg: "ID does not exist" });
  }
  saveMovieData(filterMovie);
  res.send({ success: true, msg: "Movie removed successfully" });
});

app.listen(3000, () => {
  console.log("Server runs on port 3000");
});
