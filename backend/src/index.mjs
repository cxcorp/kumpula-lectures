import express from "express";
import helmet from "helmet";
import compression from "compression";

import { events, eventsByOrganisation } from "./events.mjs";
import config from "./config.mjs";
import * as Response from "./response.mjs";

const app = express();

app.use(
  helmet({
    hsts: false,
  })
);

app.use(compression());

const api = express.Router();
api.get("/events", (req, res) => {
  res.json(Response.ok(events));
});

api.get("/events-by-organisation", (req, res) => {
  res.json(Response.ok(eventsByOrganisation()));
});

api.use("*", (req, res) => {
  res.status(404).json(Response.error("not found"));
});

api.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json(Response.error(err.message));
});

app.use("/api", api);

app.use("*", (req, res) => {
  res.status(404).type("html").send(`<h1>Not Found</h1>`);
});

api.use((err, req, res, next) => {
  console.error(err);
  res.status(500).type("html").send(`<h1>Internal Server Error</h1>`);
});

app.listen(config.PORT, config.HOSTNAME, () => {
  console.log(`> Listening on http://${config.HOSTNAME}:${config.PORT}/api`);
});
