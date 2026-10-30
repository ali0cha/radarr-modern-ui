export default function getPathWithUrlBase(path: string) {
  return `${window.Radarr.urlBase}${path}`;
}
