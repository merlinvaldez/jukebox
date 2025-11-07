import db from "#db/client";
import { faker } from "@faker-js/faker";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  const playlists = [];
  const tracks = [];
  const playlists_tracks = [];
  for (let i = 0; i < 10; i++) {
    const playlistName = `Playlist ${i}`;
    const playlistDescription = `This is a description for Playlist ${i}`;
    const { rows } = await db.query(
      ` INSERT INTO playlists(name, description)
        VALUES ($1,$2)
        RETURNING *`,
      [playlistName, playlistDescription]
    );
    playlists.push(rows[0]);
  }
  for (let i = 0; i < 20; i++) {
    const songName = faker.music.songName();
    const duration = faker.number.int({ max: 90 });
    const { rows } = await db.query(
      ` INSERT INTO tracks(name, duration_ms)
        VALUES ($1,$2)
        RETURNING *`,
      [songName, duration]
    );
    tracks.push(rows[0]);
  }
  for (let i = 0; i < 15; i++) {
    const randomPlaylistId = playlists[Math.floor(Math.random() * 10)].id;
    const randomTrackId = tracks[Math.floor(Math.random() * 20)].id;
    const { rows } = await db.query(
      ` INSERT INTO playlists_tracks(playlist_id, track_id)
        VALUES ($1,$2)
        RETURNING *`,
      [randomPlaylistId, randomTrackId]
    );
    playlists_tracks.push(rows[0]);
  }
}
