var Sioux = function (options) {
  if (!options.serverUrl) {
    throw new Error("Sioux: Please add a server URL.");
  } else {
    this.serverUrl = options.serverUrl || "";
    this.cb = options.cb || function (){};
    this.token = options.token || null;
    this.method = this.getMethod(options);
    this.maxRequests = options.maxRequests || -1;
    this.pageUrl = window.location.href;
    this.shouldLog = options.shouldLog || null;
    this.getBrowserInfo();
    this.errors = [];
    return this;
  }
};

Sioux.prototype.watch = function () {
  var _this = this;
  window.onerror = function (message, url, line, column) {
    var err = {
      message: message,
      url: url,
      line: line,
      column: column
    };
    if (_this.maxRequests > 0 && _this.errors.length <= _this.maxRequests) {
      _this.report(err);
      _this.errors.push(err);
    }
  };
  return this;
};

Sioux.prototype.report = function (error) {
  var url = [
    "message=" + error.message,
    "&file=" + error.url,
    "&line=" + error.line,
    "&column=" + error.column,
    "&date=" + new Date(),
    "&ismobile=" + this.isMobile,
    "&os=" + this.os,
    "&browser=" + this.browser,
    "&version=" + this.version,
    "&url=" + this.pageUrl
  ].join("");
  if (this.shouldLog) {
    console.log("Sioux: ", url);
  }
  this.sendRequest(encodeURI(url));
};

Sioux.prototype.sendRequest = function (data) {
  var _this = this,
  xmlhttp = window.XMLHttpRequest
  ? new XMLHttpRequest()
  : new ActiveXObject('Microsoft.XMLHTTP');

  xmlhttp.onreadystatechange = function () {
    var response = xmlhttp.readyState === 4 && xmlhttp.status === 200
    ? xmlhttp.responseText
    : xmlhttp.status;

    if (typeof _this.cb === 'function' && xmlhttp.readyState === 4) {
      _this.cb(response);
    }
  };

  xmlhttp.open(this.method, this.serverUrl, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  if (this.token) {
    xmlhttp.setRequestHeader(this.token.key, this.token.value);
  }
  xmlhttp.send(data);
};

Sioux.prototype.getMethod = function (options) {
  var method = options.method;
  if (method) {
    return ["POST", "GET"].indexOf(method.toUpperCase()) != -1
    ? method.toUpperCase()
    : "POST";
  } else {
    return "POST";
  }
};

Sioux.prototype.isMobile = function () {
  return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) !== null;
};

Sioux.prototype.getOs = function () {
  if (navigator.appVersion.indexOf("Win") != -1) return "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) return "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) return "UNIX";
  if (navigator.appVersion.indexOf("Linux") != -1) return "Linux";
  return "Unknown OS";
};

/**
* I would like to thank hims056 on StackOverflow,
* see http://stackoverflow.com/a/11219680/3713038
*/
Sioux.prototype.getBrowserInfo = function () {
  var nAgt = navigator.userAgent,
  browserName,
  fullVersion,
  ix;

  if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      fullVersion = nAgt.substring(verOffset + 8);
    }
  }
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  else if ((verOffset=nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      fullVersion = nAgt.substring(verOffset + 8);
    }
  }
  else if ((verOffset=nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset+8);
  }
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1)
    < (verOffset = nAgt.lastIndexOf('/'))) {
    browserName = nAgt.substring(nameOffset,verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }

  if ((ix = fullVersion.indexOf(";")) != -1) {
    fullVersion = fullVersion.substring(0, ix);
  }
  if ((ix = fullVersion.indexOf(" ")) != -1) {
    fullVersion = fullVersion.substring(0, ix);
  }

  majorVersion = parseInt('' + fullVersion,10);
  if (isNaN(majorVersion)) {
    fullVersion  = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion,10);
  }

  this.browser = browserName;
  this.version = fullVersion;
  this.isMobile = this.isMobile();
  this.os = this.getOs();
};
