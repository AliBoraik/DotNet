const multer = require('multer');
import fs from 'fs';
import path from 'path';

const uploadPathCovers = 'assets/uploads/covers'
const uploadPathSongs = 'assets/uploads/songs'

function createDirectories(pathname: string) {
    const __dirname = path.resolve();
    pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
    fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, e => {
        if (e) {
            console.error(e);
        }
    });
}

createDirectories(uploadPathSongs)
createDirectories(uploadPathCovers)

const filenameSetter = (req: any, file: any, cb: any) => {
    cb(
        null,
        new Date().valueOf() +
        '_' +
        file.originalname
    );
}

const storageCovers = multer.diskStorage({
    destination: function(req: any, file: any, cb: any) {
        cb(null, uploadPathCovers);
    },
    filename: filenameSetter
})

const storageSongs = multer.diskStorage({
    destination: function(req: any, file: any, cb: any) {
        cb(null, uploadPathSongs);
    },
    filename: filenameSetter
})

const imageUpload = multer({ storage: storageCovers }).single("cover");
const songUpload = multer({ storage: storageSongs }).single("song");

export {
    imageUpload,
    songUpload,
    uploadPathCovers,
    uploadPathSongs,
}