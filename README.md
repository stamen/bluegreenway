# Blue Greenway

Maps and events along SF's Blue Greenway


More info: ["The Long-Awaited Transformation of SF’s Southeast Waterfront"](http://www.spur.org/blog/2015-03-25/long-awaited-transformation-sf-s-southeast-waterfront)


![Parks Alliance Blue Greenway Map](http://www.spur.org/sites/default/files/wysiwyg/Blue.Greenway.map.jpg)


## Running

1. Clone the project and `cd` into the project folder.

2. `nvm use` to fire up the right Node version.

3. `npm install`

4. `npm start`


## Deploying to studio.stamen.com

```
npm run dist
scp -prq ./dist/. studio.stamen.com:www/lake-tahoe/show/latest/ (or YYYY-MM-DD)
```


## Deploying to GitHub pages (production)

`npm run gh-deploy`

### GitHub Pages setup

The CDN-backed production version of the site is running on GitHub Pages, directed to http://bluegreenway.org/ via a [`CNAME` file](https://github.com/stamen/bluegreenway/blob/gh-pages/CNAME). The deploy script uses [`git-directory-deploy`](https://www.npmjs.com/package/git-directory-deploy) to push only `dist/` to the `gh-pages` branch.
