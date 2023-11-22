export const getHost = function (host, photo) {
  if (host) {
    return host ? host + photo : photo;
  } else {
    if (photo.trim().indexOf("http") === 0) return photo;
    const port = window.location.port === 3000 ? 3090 : window.location.port;
    const host = `${window.location.protocol}//${window.location.hostname}:${port}/`;
    const pmatch = photo.match("(.+)://(.*?)/(.+)");
    let photourl = photo
    if (pmatch) {
      photourl = pmatch[3];
    }
    return host ? host + photourl : photourl;
  }
};
