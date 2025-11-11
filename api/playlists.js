import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  addTracktoPlaylist,
} from "#db/queries/playlists";
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
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

playlistsRouter.get("/:id", (req, res) => {
  res.send(req.playlist);
});

playlistsRouter.post("/:id/tracks", async (req, res) => {
  const playlistId = Number(req.params.id);
  const { trackId } = req.body;

  if (!Number.isInteger(playlistId) || playlistId <= 0) {
    return res.status(400).send("Invalid playlist id.");
  }
  if (!Number.isInteger(trackId) || trackId <= 0) {
    return res.status(400).send("Request body needs: trackId");
  }

  const link = await addTracktoPlaylist({ playlistId, trackId });
  if (!link) return res.status(200).send({ message: "Track already linked" });
  res.status(201).send(link);
});
