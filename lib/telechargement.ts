/**
 * Venant de :
 * https://stackoverflow.com/questions/55374755/node-js-axios-download-file-stream-and-writefile
 */
import Axios from 'axios';
import fs, { createWriteStream } from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';

export async function downloadFile(url: string, path: string) {
  const fsPromises = fs.promises;

  const fileResponse = await Axios({
    url: url,
    method: 'GET',
    responseType: 'stream',
  });

  // Write file to disk (here I use fs.promise but you can use writeFileSync it's equal
  await fsPromises.writeFile(path, fileResponse.data);
}
