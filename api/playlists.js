import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  getTracksByPlaylistId,
} from "#db/queries/playlists";

import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import express from "express";
const playlistsRouter = express.Router();
export default playlistsRouter;

playlistsRouter.get("/", async (req, res) => {
  const playlists = await getPlaylists();
  res.send(playlists);
});

playlistsRouter.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body required.");
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send("Request body needs: name and description");
  }
  const playlist = await createPlaylist({ name, description });
  res.status(201).send(playlist);
});

playlistsRouter.param("id", async (req, res, next, id) => {
  const intId = Number(id);
  if (!Number.isInteger(intId))
    return res.status(400).send("id is not a number");
  const playlist = await getPlaylistById(intId);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

playlistsRouter.get("/:id", (req, res) => {
  res.send(req.playlist);
});

playlistsRouter.get("/:id/tracks", async (req, res) => {
  const tracksOfPlaylist = await getTracksByPlaylistId(req.playlist.id);

  res.send(tracksOfPlaylist);
});

playlistsRouter.post("/:id/tracks", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { trackId } = req.body;

  if (!trackId) return res.status(400).send("Request body requires: trackId");
  console.log(req.body);
  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
