# Sioux.js

![Sioux image](https://d30y9cdsu7xlg0.cloudfront.net/png/4816-84.png)

### Introduction

Sioux is a simple bug watcher logging the exceptions that occur in your client's front app directly into your backend. Thus, you can take care of those issues, sending them to your developers by email, but also use some hooks of your own, as adding them to your Agile board, to only name a few.  

### What you'll receive in the server-side

- `message`: The error message. Basically.  
- `file`: The target file where the bug has been found.  
- `line`: The error's line number, only making sense when the script is not minified.  
- `column`: The column's number.  
- `date`: The date when the errors happened.  
- `ismobile`: Whether it happened on a mobile device.  
- `os`: The operating system on which the error was thrown.  
- `browser`: The target browser.  
- `version`: The browser's version.  
- `language`: The browser's main language.  
- `resolution`: The browser's resolution (widthxheight).  
- `orientation`: The browser's orientation.  
- `url`: The URL where the error happened.  

### How to settle it

```javascript
var options = {
  serverUrl: "http://domain.tld/errors",
  method: "POST",
  maxRequests: 10,
  token: {
    'key':'X-CSRF-Token',
    'value': document.querySelector('meta[name="csrf-token"]').content
  },
  shouldLog: true,
  cb: function (serverResponse) {
    console.info(serverResponse);
  }
};

new Sioux(options).watch();

// Now we throw a dumb exception
console.log(new UnknownObject());
```

### Available parameters

- `serverUrl`: Your server-side error API route.  
- `method`: The method to apply, default to POST.  
- `maxRequests`: The maximum number of error logs to send, avoiding spam.  
- `token`: If you have a CSRF token to add to the request's header, that's here.  
- `shouldLog`: Whether of not it should log the requests in the front-end console. Default to false.  
- `cb`: The callback function to run when we get an answer from the server.  

### Example

Take a look at the `/example` folder where you will find a basic Ruby on Rails app that uses the library. It will raise an error in front, log its parameters in backend and send back a json.  
__How to try it:__  
`$ cd example`  
`$ gem install`  
`$ rails s`  
From this point, you can do whatever you want with those errors. For instance you can send an email, add a [Trello](http://trello.com) card, a [Github](http://github.com) issue, use [IFTTT](http://ifft.com) to use thousand of hooks, actually the only limit is your imagination!

### Credits

Special thanks to [Simon Child](http://thenounproject.com/Simon%20Child/) for the visual.
