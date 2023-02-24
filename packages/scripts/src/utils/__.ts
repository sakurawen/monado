import url from 'url';
import path from 'path';
export const dirname = () => {
  const u = import.meta.url;
  return path.dirname(url.fileURLToPath(u));
};

export const filename = () => {
  const u = import.meta.url;
  return url.fileURLToPath(u);
};
