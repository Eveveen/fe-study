const fs = require('fs');
const http = require('http');
const path = require('path');
const resolvePath = require('resolve-path');

http
  .createServer(function (req, res) {
    try {
        const rootDir = path.join(__dirname, 'static');
        console.log(req.url);
        const file = resolvePath(rootDir, req.url);
        console.log(file);
    
        fs.readFile(file, function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
          res.end(data);
        });
    } catch(e) {
        console.log(e);
        res.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
        res.end('找不到对应的资源');
    }
    
  })
  .listen(8081);
  console.log('server listening on port 8081');