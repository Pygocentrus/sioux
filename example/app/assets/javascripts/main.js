var options = {
  serverUrl: "http://localhost:3000/errors",
  method: "POST",
  maxRequests: 10,
  token: {
    'key':'X-CSRF-Token',
    'value': document.querySelector('meta[name="csrf-token"]').content
  },
  shouldLog: true,
  cb: function(data){
    console.info(data);
  }
};
new Sioux(options).watch();

// Now we throw a dumb exception
console.log(new UnknownObject());
