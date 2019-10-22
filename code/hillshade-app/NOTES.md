# Notes from development

A web interface that allows users to specify parameters and extents or polygons to generate, then download raster (GeoTIFF and JPG) files.

For simplicity's sake, at first it could just be counties in Colorado, or states in the US, or North America

Features:

- [ ]  Area  selector
    - [ ]  Bounding Box
    - [ ]  Polygon - Colorado counties
    - [ ]  Polygon - upload geojson
- [ ]  Parameters
    - [ ]  Hillshade
        - [ ]  Angle
        - [ ]  Azimuth
        - [ ]  Z-factor (vertical exaggeration)
        - [ ]  Scale
        - [ ]  More parameters?
    - [ ]  Aspect
        - [ ]  
    - [ ]  Slope
- [ ]  Other parameters
    - [ ]  Projection
    - [ ]  Output image filetype
    - [ ]  Email to send download link?

Elements

- [ ]  Header, footer
- [ ]  Query constructor
- [ ]  Map displaying

    # Back-end Workflow

    1. User inputs parameters and clicks `Generate file`

    	// prompt user - "This may take a few minutes. Would you like us to email you when we're done?
    		// [Nah, I'll wait.]
    		// [Sure, email me.[*input email here...*]]

    	userParams = {
    		area: {
    			type: 'bbox', // or 'county' or 'customPoly'
    			bbox: {
    				ll: [lon, lat],
    				ur: [lon, lat]
    			},
    			county: 'countyId',
    			customPoly: geoJson
    		},
    		analysisType: 'hillshade', // or aspect, slope, any gdaldem option
    		projection: 'epsg:74234',
    		filetype: 'tiff',
    		email: 'john.iv.18@ucl.ac.uk'
    	}


    2. invoke `generateFile(userParams)`

    ```javascript
    function generateFile(userParams) {
    	// Clip master raster to output extent / polygon
    	var raster = clip(masterRaster, extent);

    	// spawn python process (https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js)
    	const spawn = require('child_process').spawn
    	const analyzeDEM = spawn('python', ['path/to/script.py', arg1, arg2, arg3]

    	analyzeDEM.stdout.on('data', (data) => {
    		// Either send to screen
    		// Or email to provided email userParams.email
    	})
    }
    ```

## Process

### Prep DEM file

Download all DEM tiles from USGS
Merge tiles into one files
Clip to Colorado using shapefile from CDPHE data
Resize?
NOW we have our base colorado.tif for analysis.



## Additional Features

Store output file  to database or server - access if query matches file

That way over time the system builds up a cache of analyzed files, much faster

Collect emails?

Provide some 3d model, or adjust view angle so it is not always from directly above

## Data Sources

https://data-cdphe.opendata.arcgis.com/datasets/66c2642209684b90af84afcc559a5a02_5
https://www.naturalearthdata.com/downloads/10m-cultural-vectors/
https://www.naturalearthdata.com/downloads/10m-raster-data/10m-shaded-relief/
https://download.ordnancesurvey.co.uk/open/TERR50/201807/GAGG/terr50_gagg_gb.zip?sv=2014-02-14&sr=b&st=2018-12-07T11:51:24Z&se=2018-12-10T11:51:24Z&si=opendata_policy&sig=Oqb7rofKKe9SIYhOS%2FiQHijoTUyPDaYPvRpIgF230Ss%3D ????


## GDAL tools Used
gdaldem
http://manpages.ubuntu.com/manpages/trusty/man1/gdalbuildvrt.1.html
gdalwarp
https://gis.stackexchange.com/questions/45053/gdalwarp-cutline-along-with-shapefile
gdalwarp -cutline INPUT.shp -crop_to_cutline -dstalpha INPUT.tif OUTPUT.tif

For wireframe:
https://freevectormaps.com/world-maps/north-america/WRLD-NA-01-0003


### Production Set-up

In order to ensure that gdal installed reliably on the production server, we had to


## Modules to consider
http://bigtiff.org/

## Modules employed
socket.io

## Templates Used

https://github.com/BlackrockDigital/startbootstrap-bare

## Modules Rejected

Because we figured out how to do it with a native node module (child_process) - many fewer security risks  we'd imagine.
https://www.npmjs.com/package/node-cmd

Because it is not asynchronous, and  with child_process we can create child processes on the  machine that don't (shouldn't?) disrupt the node event loop.
https://github.com/naturalatlas/node-gdal


## Amazing Resources / References / Tools

https://github.com/dwtkns/gdal-cheat-sheet
https://scotch.io/tutorials/javascript-promises-for-dummies
https://bl.ocks.org/mbostock/3711652
mapshaper.org
http://geojson.xyz/
https://desktop.arcgis.com/en/arcmap/10.3/manage-data/raster-and-images/hillshade-function.htm#ESRI_SECTION1_CD703AA0CE28402FA5B113E98B3AB46B


## Made with
Firefox
Atom
Macbook Pro


Adobe Kuler
https://color.adobe.com/cloud/aHR0cHM6Ly9jYy1hcGktYXNzZXRzLmFkb2JlLmlv/library/d444d416-dd8a-49a6-a695-a4eadc3ee58d/theme/a8a433a6-4bc7-4c9e-9c07-229e361c7f00/






# Process

## UK Raster Generation:

Download Terrain 50 Dataset from os.uk - https://www.os.uk/opendatadownload/products.html

Unzip with python

Pull .asc and .prj files into asc folder. generate asc-names.txt for the next step.

Create vrt using gdalbuildvrt

gdal_translate file.vrt uk.tif

Now we can clip and do whatever we want to the dem tif!

Clip with UK outline - http://www.diva-gis.org/datadown

Now our hillshade should hopefully work.
