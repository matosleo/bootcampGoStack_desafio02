const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateId(request, response, next) {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  request.repoIndex = repositoryIndex;

  return next();
}

app.use('/repositories/:id', validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[request.repoIndex].likes
  };

  repositories[request.repoIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repoIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  repositories[request.repoIndex].likes += 1;

  return response.status(200).json(repositories[request.repoIndex]);
});

module.exports = app;
