import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/uncertaintext.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'uncertaintext.js',
    library: {
      type: 'module'
    },
  },
  experiments: {
    outputModule: true,
  }
};
