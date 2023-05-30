/**
 * Thanks to https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 */

// Resources
const resources = [
    "/ug-timetable/",
    "/ug-timetable/data.json",
    "/ug-timetable/index.html",
    "/ug-timetable/index.js",
    "/ug-timetable/item-prototypes.html",
    "/ug-timetable/ugt-items.js",
    "/ug-timetable/ugt-render.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.4/font/bootstrap-icons.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js",
    "https://code.jquery.com/jquery-3.6.4.min.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1/plugin/isBetween.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1/plugin/isSameOrBefore.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1/plugin/isSameOrAfter.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1/plugin/relativeTime.js"
]


// Install
const addResourcesToCache = async (resources) => {
    const cache = await caches.open("ugt");
    await cache.addAll(resources);
  };
  
  self.addEventListener("install", (event) => {
    event.waitUntil(
      addResourcesToCache(resources)
    );
  });
  
  // Get from Cache
  const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      console.log('Returned item from cache')
      return responseFromCache;
    }
    return fetch(request);
  };
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
  });
  
  // Message
  addEventListener("message", (event) => {
    console.log(`Message received: ${event.data}`);
    
    switch(event.data){
        case 'update':
            caches.delete('ugt').then( () => {
                addResourcesToCache(resources).then( () => {
                    event.source.postMessage("updated");  
                })
            })    
        break;
    }
  });
