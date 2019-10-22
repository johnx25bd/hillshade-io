const express = require('express')
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const events = require('events');
const { spawn } = require('child_process');
const fs = require('fs')
const eventEmitter = new events.EventEmitter();

const demProcess = require('./node_modules/demProcess/demProcess.js')




let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
// Set up sockets listener - when user submits form from client this
// will receive data sent
io.on('connection', (socket) => {
  console.log('Server connected!')
  socket.on('getDEM', (demParamsFromClient) => {

    // This is receiving data from the front end.
    // console.log(demParamsFromClient)
    demProcess(demParamsFromClient);


  });

  eventEmitter.addListener('dem-success', (pathToRenderedFile) => {
    // console.log('EMITTER WORKING', pathToRenderedFile);


    socket.emit('dem-success', pathToRenderedFile);
    // THIS IS WHERE YOU UPDATE THE CLIENT
    // console.log(data);
  })

  socket.on('disconnect', data => {
    // something;
  })
});

server.listen(port)

// Now the webserver waiting for HTTP requests:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/form.html'));
});

app.use(express.static('public'));

// Environment variables
var productionEnv = Object.create(process.env);
productionEnv.NODE_ENV = 'production';
console.log('production Enviornment', productionEnv)


// Environment variables for spawn process:
var productionEnv = Object.create(process.env);
productionEnv.NODE_ENV = 'production';
console.log(productionEnv, 'port', port);

// Should this be async? Probably ....



function clippedDEMexists(_params) {
  var path = './dem/gen/state/colorado/' + _params.area + '/' + _params.area + '.tif';
  return fs.existsSync(path);
}


function renderDEMtoOutput(_params) {
  console.log("INTO renderDEMtoOutput")
  outputfiletype = _params.filetype;
  var area = _params.area,
    areatype = _params.areatype,
    algo = _params.algo;

  var now = new Date().toJSON();

  // Generate random suffix for filenames:
  var randSuffix = keccak('keccak256').update(Math.random() >
    0.5 ? Math.random().toString(16) : Math.random().toString(2))
      .digest().toString('hex'), // That's so random! KB
    semiPseudoRandomDEMFilename = area + '-pretty-small-' + algo +
    '-' + 'now' + '-' + randSuffix + '.' + (outputfiletype == 'GTiff' ? 'tif' : outputfiletype.toLowerCase());

  // First we clip to the target area:
  // NOTE: This is super inefficient, but much more scalable, especially
  // as we'd like to allow the user to upload polygons to clip, and
  // to include the option to pull all sorts and levels of polygons

  // Here is a place for MongoDB integration:
  // check if a clipped tiff exists
  // If so, use it
  // if not, clip it, store it, write it to db.

  // A spawn  of just the dem to png command
  var inputraster = './dem/gen/state/colorado/' + area + '/' + area + '.tif',
    outputpath = './public/dem/gen/state/colorado/' + area + '/' + algo + '/' + semiPseudoRandomDEMFilename;
  var demArgs = [];
  switch (algo) {
    case 'hillshade':
      demArgs.push(algo);
      for (key in _params) {
        console.log(key, ':', _params[key]);
        if (key == 'filetype') {
          demArgs.push('-of', _params[key].toUpperCase());
        }

        if (key == 'params') {
          for (p in _params[key]) {
            demArgs.push('-' + p, _params[key][p]);
          }
        }
      }
      demArgs.push(inputraster, outputpath);
      break;
    case 'slope':
      demArgs.push(algo);
      demArgs.push(inputraster, outputpath);
      break;
    case 'aspect':
      demArgs.push(algo);
      demArgs.push(inputraster, outputpath);
      break;
  }
  console.log("INTO RENDERPROCESS with ", demArgs);

  var renderCommand = 'gdaldem'

  demArgs.forEach((arg) => {
    renderCommand += ' ' + arg;
  });
  console.log('***gdaldem command:::******', renderCommand);

  const renderProcess = spawn('gdaldem', demArgs, {env: productionEnv, shell: true})
	.on('error', function (error){throw error;});

  renderProcess.stdout.on('data', (data) => {
    console.log(data.toString('utf8'));
    if(data.toString('utf8') % 20 == 0) {
      console.log('TWENTIES');
    }
  });

  renderProcess.on('close', (code) => {
    if (code == 0) {

      console.log("SUCCESSFUL renderDEMtoOutput!!!!", outputpath.substr(9));
      eventEmitter.emit('dem-success', outputpath.substr(9));
    }
  });

  console.log("END OF RENDERDEMTOOUTPUT");
}
