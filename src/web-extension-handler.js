'use strict';

var chromeExtensionHandler = require('./chrome-extension-handler');
var firefoxExtensionHandler = require('./firefox-extension-handler');

angular
    .module('ngWebExtensionHandler', [])
    .provider('webExtensionHandler', webExtensionHandler)
    .provider('chromeExtensionHandler', chromeExtensionHandler)
    .provider('firefoxExtensionHandler', firefoxExtensionHandler);

webExtensionHandler.$inject = ['$injector'];

function webExtensionHandler($injector) {
    var service; // Holds the service to be used

    return {
        config: config,
        $get: ['$injector', '$q', factory]
    };

    function config(browsers) {
        var extensionHandlerFound = false;
        angular.forEach(browsers, function (value, key) {
            if (!extensionHandlerFound) {
                service = key + 'ExtensionHandler'; // Build the service name
                var serviceProvider = service + 'Provider'; // Build the service provider name

                try {
                    // Get the service provider, then check if it should be the
                    // one to be used according to the browser used by the user
                    var browser = $injector.get(serviceProvider);
                    if (browser.isBeingUsed()) {
                        // Initialize the configuration of the service
                        browser.config(value || {});
                        extensionHandlerFound = true;
                    }
                } catch (e) {
                    console.warn('ngWebExtensionHandler:', serviceProvider, 'not found.',
                        'Are you sure that you registered this provider?');
                }
            }
        });
    }

    function factory($$injector, $q) {
        var extensionHandler;

        try {
            // Get the appropriate extension handler stored from the config
            extensionHandler = $$injector.get(service);
            // Add our generic isInstalled function, with default iconUrl as src
            extensionHandler.isInstalled = function (src) {
                return isInstalled(src || extensionHandler.iconUrl);
            };
        } catch (e) {
            // We're here because we did not get an appropriate service,
            // so we will just provide them the isInstalled function
            extensionHandler = { isInstalled: isInstalled };
            console.warn('ngWebExtensionHandler:', 'extensionHandler not found.',
                'Maybe you forgot to call the config function.');
        }

        return extensionHandler;

        function isInstalled(src) {
            var deferred = $q.defer();
            var image = document.createElement('img');

            // Check the if extesion exist using it's accessible resource, icon
            image.src = src;
            image.onload = deferred.resolve;
            image.onerror = deferred.reject;

            image = null; // Dereference the DOM, so that gc can collect it
            return deferred.promise;
        }
    }
}
