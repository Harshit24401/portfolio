# Spotify setup

The Spotify card on the home page shows what you're playing now (or last
played), your top 3 tracks from the last few weeks, and a link to your
playlist. It needs three environment variables. You only do this once.

Until they're set, the card shows just the playlist link (or nothing, if
`spotifyPlaylist` in `data/site.ts` is also empty). The site never breaks
because of Spotify.

## 1. Create a Spotify app

1. Go to https://developer.spotify.com/dashboard and log in.
2. **Create app**. Name: "Portfolio". Description: anything.
3. **Redirect URI**: `http://127.0.0.1:3000/callback`. It's only used once,
   in step 2, and nothing needs to be running there.
4. Tick **Web API**, agree to the terms, and save.
5. Open the app's **Settings**. Copy the **Client ID**, then click
   **View client secret** and copy that too.

## 2. Get a refresh token

The refresh token lets the site ask Spotify for fresh access on your behalf.
It's tied to these permissions (scopes):
`user-read-currently-playing user-read-recently-played user-top-read`.

1. Open this URL in your browser, with your Client ID pasted in:

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
   ```

2. Approve. The browser goes to `http://127.0.0.1:3000/callback?code=...`.
   The page won't load, and that's fine. Copy the `code` value from the
   address bar.

3. Swap the code for a refresh token in your terminal, filling in your three
   values (the code expires after a few minutes):

   ```bash
   curl -s -X POST https://accounts.spotify.com/api/token \
     -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
     -d grant_type=authorization_code \
     -d code=THE_CODE \
     -d redirect_uri=http://127.0.0.1:3000/callback
   ```

4. The JSON response has a `refresh_token`. That's the one to keep.

## 3. Add the environment variables

In Vercel, open the project, then **Settings → Environment Variables**, and
add these for Production and Preview:

| Name | Value |
|---|---|
| `SPOTIFY_CLIENT_ID` | from step 1 |
| `SPOTIFY_CLIENT_SECRET` | from step 1 |
| `SPOTIFY_REFRESH_TOKEN` | from step 2 |

For local development, put the same three lines in `.env.local`, which git
ignores:

```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

Never commit these values. If the secret leaks, rotate it in the Spotify
dashboard and repeat step 2.

## 4. Add your playlist link

Set `spotifyPlaylist` in `data/site.ts` to your playlist's share URL
(`https://open.spotify.com/playlist/...`).

## Check it

Run `npm run dev` and open http://localhost:3000/api/spotify. You should see
`"mode": "playing"` or `"mode": "last"`. If it says `"fallback"`, one of the
three values is wrong.
