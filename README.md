# Udacity Frontend Nanodegree Arcade Game

This is a Tron-themed clone of the classic arcade game Frogger.  Help Flynn cross the grid through seven stages to win.  Use the arrow keys (up, down, left, right) to move your user.

## Installation

It's easy to install!  Download the files and host using a simple web server, like [WAMP](http://www.wampserver.com/en/) or Node's [http-server](https://www.npmjs.com/package/http-server).  

You can create your own theme by replacing the images being loaded and specifying new dimensions in app.js and engine.js.  Image attributes are located in the config variable, like this:

```javascript
var config = {
    user: {
        spriteWidth: 44,
        spriteHeight: 85,
        verticalInsetTop: 0,
        verticalInsetBottom: 0,
        horizontalInsetLeft: 8,
        horizontalInsetRight: 6,
        verticalOffset: 60,
        speed: 1
    }
}

```

The game runs automatically on page load - try to avoid the light cycles!

## Contributors

Udacity provided the base files - the game engine and resource loader.  I customized the theme and added much of the core game functionality.

Special thanks to Jeff Bridges for being a great dude, and Disney for making a fun reboot of a classic film.