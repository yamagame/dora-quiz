export const getHost = function(host, photo) {
  if (host) {
    return host ? host+photo : photo;
  } else {
    if (photo.trim().indexOf('http') == 0) return photo;
    const port = (window.location.port == 3000) ? 3090 : window.location.port;
    const host = `${window.location.protocol}//${window.location.hostname}:${port}/`;
    const pmatch = photo.match('(.+)\:/\/\(.*?)\/(.+)');
    if (pmatch) {
      var photourl = pmatch[3];
    } else {
      var photourl = photo;
    }
    return host ? host+photourl : photourl;
  }
}
