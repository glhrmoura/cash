import packageJson from '../../package.json';

export function useAppVersion() {
  return packageJson.version;
}
