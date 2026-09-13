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
    "revision": "f8d09912f30b60bbd00879efe67e792a"
  }, {
    "url": "assets/index-URg-39Mf.css",
    "revision": null
  }, {
    "url": "assets/index-D3FNr44u.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "d24bca79c5e949e70b7e5ae2040795ad"
  }, {
    "url": "favicon.svg",
    "revision": "41301855b9f7e3b316590466ba5c090e"
  }, {
    "url": "icon.svg",
    "revision": "41301855b9f7e3b316590466ba5c090e"
  }, {
    "url": "manifest.json",
    "revision": "4544b964da115dc2d02bf7bd104f0a2c"
  }, {
    "url": "pwa-192x192.png",
    "revision": "1af6389abf27273a69d11d8837190bc0"
  }, {
    "url": "pwa-512x512.png",
    "revision": "aed00f555f29be11aa67e153c0be546d"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "a2c2622c71f6a491432a6a52fd9622ad"
  }, {
    "url": "manifest.webmanifest",
    "revision": "5c7629c6c4b428e83149226fc769482d"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
