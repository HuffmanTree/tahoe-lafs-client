export function buildPath(dircap: string, subdirs: Array<string> = [], filename: string) {
  return subdirs.length ? `${dircap}/${subdirs.join('/')}/${filename}` : `${dircap}/${filename}`;
}
