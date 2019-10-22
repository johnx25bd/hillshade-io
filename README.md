# Final Coursework

*A web tool to  enable  users to specify  and download  raster images of DEM, hillshade, slope and aspect*

## Usage

To deploy on your machine, ensure that you have `gdal`, `node`, `python` and `git` installed.

### Get the code

Clone the repository in Terminal:

```bash
git clone https://github.com/robisoniv/dem-web-app.git && cd dem-web-app/code/hillshade-app
```

> We've included a *small* TIF of Colorado in the repository so we don't have to download, extract and merge the several gigabytes of full resolution data. To do so, execute the `dl-zips.sh`, `unzip.py`, `aggregate.py`, `merge.py` and `place-data.py` scripts.

### Prep the node app

Install the node modules with `npm install`.

Fire up the webserver with `node start`.

Load `localhost:8000` in your browser - let's hope it works! 🤞🏼
