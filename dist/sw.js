// Cache versions I don't want to delete
var staticCacheName = 'mta-v1';

// Add Install event listener to the service worker
this.addEventListener('install', function(event) {
	// Make sure service worker doesn't install until cache is created successfully
	event.waitUntil(
		// Create new cache called the value of staticCacheName
		caches.open(staticCacheName).then(function(cache) {
			// urls of resources to cache
			return cache.addAll([
				'/',
				'/MTA-transit-map.html',
				'../data/stops.txt',
				'../data/stop_times.txt',
				'../img/subwaymap.jpg',
				'../css/style.css',
				'../js/all.js'
			]);
		})
	);
});

// Respond to requests, by first hijacking the request.
this.addEventListener('fetch', function(event) {
	// respond to hijacked requests
	event.respondWith(
		// respond with the cached resource that matches the request.
		caches.match(event.request).then(function(response) {
			// return the response if found, or request from network if not.
			return response || fetch(event.request);
		})
	);
});