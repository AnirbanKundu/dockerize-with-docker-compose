'use strict';

const appname = 'My Awesome Microapp';

const express = require('express');

const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
//const proxy = require('express-request-proxy');
const app = express();

const http = require('http').Server(app);
const path = require('path');
//let notifierInterval = null;
// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');



app.use(cookieParser());


//SETTING cookie
app.all('*', (req, res, next) => {
  if(req.headers.cookies){
    req.cookies = req.headers.cookies;
  }
  next();
});

// COOKIE TEST
app.get('/setCookie/:cName/:cValue', (req, res) => {
  var customCookie = req.params.cName+'='+req.params.cValue+';Path=/'
  // Set cookie in response
  res.writeHead(200, {
    'Set-Cookie': customCookie,
    'Content-Type': 'text/plain'
  });

  res.end(JSON.stringify(req.cookies));
});
app.get('/getCookies', (req,res) => {
  res.send(JSON.stringify(req.cookies));
});

// ========================================================================
// NAV SERVICE

app.get('/nav', (req, res) => {

  const translate = req.t; //this is the lingo translator

  res.json([
    {
      label: translate('APPLICATION_NAME'),
      icon: 'fa-wrench',
      path: '/#/',
      badge: { status: 'important', count: 22 },
      items: [
        {
          label: translate('SUB_ITEM_1'),
          path: '/#/subnav1',
          badge: { status: 'warning', count: 3 },
        },
        {
          label: translate('SUB_ITEM_2'),
          path: '/#/subnav2',
          badge: { status: 'info', count: 34 },
        },
        {
          label: translate('SUB_ITEM_3'),
          path: '/?chromeless=true/#/subnav3',
          target: '_blank',
          badge: { status: 'error', count: 2 },
        },
        {
          label: translate('SUB_ITEM_4'),
          path: 'javascript:window.openMymodal()',
          badge: { status: 'info', count: 1 },
        },
        {
          label: translate('SOCKET_IO_EXAMPLE'),
          path: '/#/socketio',
          badge: { status: 'info', count: 0 },
        }
      ],
    },
  ]);
});


// ========================================================================
// SERVICE PROXIES
const defaultTimeout = 30000;

// Stub service for local dev
let stubService = 'https://ui-stub-service-dev.run.aws-usw02-pr.ice.predix.io';
// If we're in production, get the stub service from an environment var
if (process.env.NODE_ENV === 'production') {
  stubService = process.env.stubProxyConfig;
}
// app.use('/service/*', (req, res, next) => {
//   proxy({
//     url: stubService + '/*',
//     timeout: parseInt(req.headers.timeout) || defaultTimeout,
//     originalQuery: req.originalUrl.indexOf('?') >= 0
//     // Don't sanitize query parameters (allow square braces to pass). But only enable if query params are present.
//   })(req, res, next);
// });


// ========================================================================
// STATIC ASSETS
// serveStatic() here will cache these static assets in memory so we don't
// read them from the filesystem for each request. Additionally,
// setStaticAssetsCacheControl() will look for a 'Cache-Control' header on the
// request and add it to the response for these static assets. This can be
// used by a tenant who needs aggressive caching.
function setStaticAssetsCacheControl(res, path) {
  if (res.req.headers['Cache-Control'] || res.req.headers['cache-control']) {
    res.setHeader('Cache-Control', res.req.headers['Cache-Control'] || res.req.headers['cache-control']);
  }
}

// Aggressively cache static assets in production
// http://expressjs.com/en/advanced/best-practice-performance.html

let staticServerConfig = {};

// Aggressively cache static assets in production
// http://expressjs.com/en/advanced/best-practice-performance.html
if (process.env.NODE_ENV === 'production') {
  staticServerConfig = {
    setHeaders: setStaticAssetsCacheControl
  };
}

app.use('/', serveStatic('public', staticServerConfig));

// ========================================================================
// START THE SERVER
// Need to let CF set the port if we're deploying there.
const port = process.env.PORT || 3000;


// var boot = function (cb) {
//   console.info('Starting ui-microapp');

//   // Listen application request on port
//   http.listen(port, function(){
//     console.log(`${appname} started on port ${port}`);
//     console.log(`${appname} WebSocket listening on  ${port}`);
//     if (!!cb) {
//       cb()
//     }
//   });

//   http.on('error', function(err) {
//     console.error(err.stack);
//   });
// };

// var shutdown = function (cb) {
//   http.close(cb);
//   console.log(`${appname} shutdown`);
// };



module.exports = app;
/*
FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
# COPY bower.json /usr/src/app/
# COPY .bowerrc /usr/src/app/




# Install Node Packages
RUN npm install --production
# RUN npm install -g bower
# RUN echo '{ "allow_root": true }' > /root/.bowerrc
# RUN bower install
# RUN npm install -g jspm
# RUN jspm install 

# RUN npm rebuild node-sass
# RUN gulp sass

# Bundle app source
# COPY . /usr/src/app

EXPOSE 9000
CMD [ "node", "public/app.js" ]


*/
