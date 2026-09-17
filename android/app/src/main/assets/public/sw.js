/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "index.html",
    "revision": "95ef5146fa30151e83a094e1afc76ddf"
  }, {
    "url": "firebase-messaging-sw.js",
    "revision": "2ebfb5cdcd14eef11cde807df99c5538"
  }, {
    "url": "assets/purify.es-DedTAGkB.js",
    "revision": null
  }, {
    "url": "assets/index.es-BWSdPU3a.js",
    "revision": null
  }, {
    "url": "assets/index-DUdmgz79.css",
    "revision": null
  }, {
    "url": "assets/index-BgTQ7poG.js",
    "revision": null
  }, {
    "url": "assets/html2canvas.esm-QH1iLAAe.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "bb9c3222985992d4028d634e61950e7d"
  }, {
    "url": "favicon.svg",
    "revision": "731f1a3c355e5a668d38f29c048c4fc9"
  }, {
    "url": "icon.svg",
    "revision": "731f1a3c355e5a668d38f29c048c4fc9"
  }, {
    "url": "manifest.json",
    "revision": "5b365b7f1fb98668b12f108c21113858"
  }, {
    "url": "pwa-192x192.png",
    "revision": "cb885c1d774a53b7cb17f20d56b159ef"
  }, {
    "url": "pwa-512x512.png",
    "revision": "2d896d6d82994d7498b2956c7d28101f"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "ec126961cd52c506f0e78740096b2d63"
  }, {
    "url": "manifest.webmanifest",
    "revision": "5c7629c6c4b428e83149226fc769482d"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
