#feeds-video-api

## parameters

- Uuids: a comma separated list of uuids to lookup
- Playlist: a playlist name
- Count: Number of videos to return, only used with playlist, defaults to 10

## endpoints

The Video API endpoints used are:

### /api/v1/ansvideos/findByUuids

Returns videos with the given UUIDs parameters or an empty list.
A sample query: video-api.demo.arcpublishing.com/api/v1/ansvideos/findByUuids?uuids=db9862d6-be50-11e7-9294-705f80164f6e&uuids=4594b2c0-6cc1-11e7-abbc-a53480672286

This returns an array, not an obect. The feed block might need to be modified to handle it. Only mrss currently supports an array.

### /api/v1/ans/playlists/findByPlaylist

Returns videos from a playlist up to count (10)
A sample query: video-api.demo.arcpublishing.com/api/v1/ans/playlists/findByPlaylist?name=animals

This returns an object with the videos in playlistItems. The feed block might meed to be modified to handle it. Only mrss currently supports playlistItems.
