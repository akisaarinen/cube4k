Spinning cubes WebGL 4k demo.

Nothing fancy, this is my first attempt at doing something fun with WebGL
and shaders. Minified version is currently 3615 bytes, and there's
actually quite much fat left there. Didn't bother optimizing
the size any more after getting it below the magic 4k :-)

Demo
----

A demo is available here: http://akisaarinen.fi/webgl/cube.min.html

It has only been tested with OS X 10.7.5 and Chrome 28.0.1500.95.

If you only see a blank white screen, it's likely that your browser
does not support WebGL. At the point of writing this, in 2013, there
seems to be way more setups where it doesn't work than where it does.

Running the development version
-------------------------------

Boot up any HTTP server and serve the files from there.

My setup is to use `http-server` from node, install it with npm:

    npm install http-server -g

Then simply run the following in the root of this project:

    http-server

After that surf to http://localhost:8080/development.html

Using plain `file://` won't work because the app is loading script 
asynchronously using GET calls. These extra hoops in the dev version
are required to get better compression for the minified version.

Compiling minified version
---------------------------

1. Install `grunt` as global dependency for running the build

        npm install grunt -g

2. Install other dependencies
    
        npm install

3. Run grunt

        grunt

Result should appear to `cube.min.html`, and it should work exactly
as `development.html` except it's smaller and everything is included
in a single file. Note, however, that the compression to a single file
has several steps and tools. It's likely that something will break
at if enough code is changed :-)