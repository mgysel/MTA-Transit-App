// Registering the serviceWorker

// Only register if the navigator is serviceWorker compatible
if (navigator.serviceWorker) {
	// Register the service worker
	navigator.serviceWorker.register('js/sw.js').then(function(reg) {
		// log a success
		console.log('Registration successful');
	}).catch(function(err) {
		// log a failure
		console.log('Registration failed');
	});
}