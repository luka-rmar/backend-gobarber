import multer from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

const tmpPathDefault = resolve(__dirname, '..', '..', 'tmp');
export default {
  tmpPathDefault,
  uploadFolder: resolve(tmpPathDefault, 'upload'),
  storage: multer.diskStorage({
    destination: tmpPathDefault,
    filename: (req, file, callback) => {
      const fileHashed = randomBytes(10).toString('HEX');
      const fileName = `${fileHashed}-${file.originalname}`;

      callback(null, fileName);
    },
  }),
};
