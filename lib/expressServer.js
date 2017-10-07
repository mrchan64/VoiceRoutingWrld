var http    = require('http'),
    express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    _       = require('underscore'),
    ws      = require('ws');

exports.app = express();
exports.app.use('/js', express.static(path.join(__dirname, '../public/js')));
exports.app.use('/images', express.static(path.join(__dirname, '../public/images')));
exports.app.use('/css', express.static(path.join(__dirname, '../public/css')));
exports.app.set('views', path.join(__dirname, '../public/views'));

exports.app.get('/', function(req, res){
  res.render(path.join(__dirname, '../public/views/index.jade'), {gen: generatePack()});
});
exports.app.get('/js/wrld.js', function(req, res){
  //res.sendFile(path.join(__dirname, 'wrld.js/dist/wrld.js'));
});
exports.app.get('/js/jquery.min.js', function(req, res){
  res.sendFile(path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js'));
});
exports.app.get('/js/underscore.min.js', function(req, res){
  res.sendFile(path.join(__dirname, '../node_modules/underscore/underscore-min.js'));
});

exports.server = http.createServer(exports.app);

exports.server.listen(1500);

const wss = new ws.Server({ server:exports.server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});

var jqueryfile = 'jquery.min.js';
var underscorefile = 'underscore.min.js';
var jspath = '../public/js';
var generatePack = function() {
  return {
    'js': function(){
      try{
        exports.js = fs.readdirSync(path.join(__dirname, jspath));
      }catch(err){
        console.log("ERROR: Express Static JS Paths Don't Exist");
      }
      var ret = "";
      //attaching jquery and underscore
      ret += "<script src='"+path.join('js', jqueryfile)+"'type='text/javascript'></script>";
      ret += "<script src='"+path.join('js', underscorefile)+"'type='text/javascript'></script>";
      _.each(exports.js, function(el){
        ret += "<script src='"+path.join('js', el)+"'type='text/javascript'></script>";
      })
      return ret;
    }
  }
}