# Static AEM Markup
====================================

A static repository with AEM Core Component markup that can be used by front-end developers to style.

## How To Use

    $ git clone git@github.com:godanny86/aem-static-markup.git
    $ cd aem-static-markup
    $ npm install
    
After, run

    $ gulp
    
Or 

    $ gulp server
    
...if you need a local server. Folder **build** serving at [http://localhost:8888](http://localhost:8888)

Should use [Livereload extension](http://livereload.com/extensions/). Or inject `<script src="//localhost:35729/livereload.js"></script>` into your page.

When you change a LESS(or JS) file, the page will reload.

## Updates

**If this isn't working**, it's probably because you need to update. Just run `npm update --save-dev`

**If no command gulp found?**, you need to install it globally `npm install -g gulp` or run `npm run gulp`

### Still broken or not working?

Try this:

```javascript
sudo npm cache clean
npm install --save-dev
npm update --save-dev
gulp
```


## Quick Tips
- Any changes in `assets/less/*` will trigger the Less to compile on save
- All files in `assets/js/libs/*`  will be compressed to `build/jquery.plugins.min.js`
- All files in `assets/js/*` (except for `libs`) will be compressed to `build/scripts.min.js`


#### Special Thanks

To scotch-io for providing a sample gulp project: https://github.com/scotch-io/gulp-and-less-starter-kit

HTML5 UP @jlkn for providing some inspiration html styles: https://html5up.net/
