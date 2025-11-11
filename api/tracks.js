import express from "express";
const tracksRouter = express.Router();
export default tracksRouter;

import { getTracks, getTrackById } from "#db/queries/tracks";

tracksRouter.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

tracksRouter.param("id", async (req, res, next, id) => {
  const track = await getTrackById(id);
  if (!track) return res.status(404).send("Track not found.");

  req.track = track;
  next();
});

tracksRouter.get("/:id", (req, res) => {
  res.send(req.track);
});
