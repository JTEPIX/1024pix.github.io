
var hash;

function getBase() {
  var path = window.location.pathname;
  return path.split("/").pop();
}

function decode(value, base) {
  var result = "";
  if (typeof base === "undefined") {
    base = getBase();
  }
  i = 0;
  j = 0;
  while (i<value.length) {
    result = result + String.fromCharCode(parseInt(value.substring(i,i+2),16) ^ base.charCodeAt(j));
    i+=2;
    j = (j+1) % base.length;
  }
  return result;
}

function init() {
  hash = window.location.hash.substr(1);
  if (hash === "config" && window.self !== window.top && typeof window.secret !== "undefined") {
    window.top.postMessage({secret:window.secret}, "*");
  }
}

function getWord() {
  return decode(decode(hash, window.secret));
}

document.addEventListener("DOMContentLoaded", init);
