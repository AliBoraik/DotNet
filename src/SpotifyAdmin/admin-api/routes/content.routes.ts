export {}
const Router = require('express');
const router = new Router();
const playlistController = require('../controllers/content/playlist.controller');
const songController = require('../controllers/content/song.controller')
const {imageUpload, songUpload} = require('../upload');

router.get('/playlist', playlistController.getPlaylists)
router.get('/playlist/:id', playlistController.getPlaylistByID)
router.post('/playlist', imageUpload, playlistController.addPlaylist) // TODO: swagger docs for upload/get files
router.put('/playlist', imageUpload, playlistController.updatePlaylist)
router.delete('/playlist/:id', playlistController.deletePlaylistByID)
router.get('/playlist/:id/songs', playlistController.getSongsFromPlaylistByID)
router.delete('/playlist/:idP/song/', playlistController.removeSongsFromPlaylistByID)
router.get('/playlist/title/:title', playlistController.getPlaylistsByTitle)

router.get('/song', songController.getSongs)
router.get('/song/:id/playlist/:idP', songController.getSongPlaylistID)
router.get('/song/:id', songController.getSongByID)
router.post('/song', songUpload, songController.addSong)
router.put('/song', songUpload, songController.updateSong)
router.delete('/song/:id', songController.deleteSongByID)
router.post('/song/:idS/playlist/:idP', songController.addSongToPlaylistByID)
router.get('/song/name/:name', songController.getSongsByName)

module.exports = router;