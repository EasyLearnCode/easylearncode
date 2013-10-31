EasyLearnCode 
=============
Easy learn code system

Develop [![Build Status](https://travis-ci.org/EasyLearnCode/easylearncode.png?branch=develop)](https://travis-ci.org/EasyLearnCode/easylearncode)

Master [![Build Status](https://travis-ci.org/EasyLearnCode/easylearncode.png?branch=master)](https://travis-ci.org/EasyLearnCode/easylearncode)

Documentation
-------------
See the wiki for up-to-date [Develop from Source](https://github.com/EasyLearnCode/easylearncode/wiki/Develop-from-Source).


Running the Development Environment
-----------------------------------

    $ cd /path/to/project-name/main
    $ ./run.py -s

To test it visit `http://localhost:8080/` in your browser.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

To watch for changes of your `*.less` & `*.coffee` files and compile them
automatically to `*.css` & `*.js` run in another bash:

    $ ./run.py -w

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

For a complete list of commands:

    $ ./run -h


Deploying on Google App Engine
------------------------------

Before deploying make sure that the `app.yaml` and `config.py` are up to date
and you ran the `run.py` script to minify all the static files:

    $ ./run.py -m
    $ appcfg.py --oauth2 update .
