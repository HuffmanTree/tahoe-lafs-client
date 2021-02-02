export function buildPath(dircap: string, subdirs: Array<string> = [], filename: string) {
  return `${dircap}/${subdirs.join('/')}/${filename}`;
}
