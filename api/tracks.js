import express from "express";
const tracksRouter = express.Router();
export default tracksRouter;

import { getTracks, getTrackById } from "#db/queries/tracks";

tracksRouter.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

tracksRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).send("Id is not a number");
  const track = await getTrackById(id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});
