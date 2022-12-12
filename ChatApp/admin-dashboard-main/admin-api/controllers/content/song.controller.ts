import { Request, Response } from 'express'
const {uploadPathSongs} = require("../../upload")
const db = require('../../db')

interface MulterRequest extends Request {
    file: any;
}

class SongController {
    async getSongs(req: Request, res: Response) {
        try {
            const offset = req.query.offset,
                limit = req.query.limit

            if (!offset)
                res.status(400).send({
                    message: "Offset query param is missing"
                })
            if (!limit)
                res.status(400).send({
                    message: "Limit query param is missing"
                })

            const content = await db.query(`
                SELECT * FROM song
                OFFSET $1 LIMIT $2
                `, [offset, limit])
            res.json(content.rows);
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async getSongByID(req: Request, res: Response) {
        try {
            const id = req.params.id
            const content = await db.query(`
                SELECT id, name, source
                FROM song
                WHERE id = $1
            `, [id])
            res.json(content.rows);
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async deleteSongByID(req: Request, res: Response) {
        try {
            const id = req.params.id
            const content = await db.query(`
                DELETE
                FROM song
                WHERE id = $1
                RETURNING *
            `, [id])
            res.json(content.rows);
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async addSong(req: Request, res: Response) {
        try {
            const multerReq = (req as MulterRequest)
            const filename = multerReq.file ? multerReq.file.filename : "";
            const { userId, name } = req.body
            const source = uploadPathSongs + `/${filename}`
            const content = await db.query(`
                INSERT INTO song
                (name, user_id, source)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [name, userId, source])

            res.json(content.rows[0]);
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async updateSong(req: Request, res: Response) {
        try {
            const multerReq = (req as MulterRequest)
            const filename = multerReq.file ? multerReq.file.filename : "";
            const { name, id } = req.body
            const source = uploadPathSongs + `/${filename}`
            let song;
            if (filename) {
                song = await db.query(`
                UPDATE song
                SET name = $1, source = $2
                WHERE id = $3
                RETURNING *
            `, [name, source, id])
            }
            else {
                song = await db.query(`
                UPDATE song 
                SET name = $1
                WHERE id = $2
                RETURNING *
            `, [name, id])
            }
            res.json(song.rows[0]);
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async addSongToPlaylistByID(req: Request, res: Response) {
        try {
            const { idS, idP } = req.params
            const song = await db.query(`
                INSERT
                INTO playlist_song (playlist_id, song_id)
                VALUES ($1, $2)
                RETURNING *
            `, [idP, idS])
            res.json(song.rows[0]);
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async getSongsByName(req: Request, res: Response) {
        try {
            const offset = req.query.offset,
                limit = req.query.limit,
                name = req.params.name

            if (!offset)
                res.status(400).send({
                    message: "Offset query param is missing"
                })
            if (!limit)
                res.status(400).send({
                    message: "Limit query param is missing"
                })

            const users = await db.query(`
                SELECT ps.song_id, ps.playlist_id, s.name, p.type FROM playlist_song as ps 
                JOIN (SELECT * from song where song.name ~* ('.*' || $1 || '.*')) as s 
                ON ps.song_id = s.id
                JOIN (SELECT * FROM playlist WHERE playlist.type <> 'user') as p 
                ON ps.playlist_id = p.id 
                OFFSET $2 LIMIT $3`, [name, offset, limit])
            res.json(users.rows)
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async getSongPlaylistID(req: Request, res: Response) {
        try {
            const id = req.params.id
            const idP = req.params.idP
            const playlistId = await db.query(`
                SELECT *
                FROM playlist_song
                WHERE song_id = $1 AND playlist_id = $2`, [id, idP])
            res.json(playlistId.rows)
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }
}

module.exports = new SongController();