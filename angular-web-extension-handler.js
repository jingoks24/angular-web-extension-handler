(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var chromeExtensionHandler = [function () {
    var extensionHandler;

    return {
        config: config,
        isBeingUsed: isBeingUsed,
        $get: ['$q', factory]
    };

    function config(extension) {
        extensionHandler = {
            browser: 'chrome',
            id: extension.id,
            url: extension.url,
            iconUrl: extension.iconUrl
        };
    }

    function isBeingUsed() {
            // Checks if the browser used is Chrome
        return !!window.chrome && !!window.chrome.webstore;
    }

    function factory($q) {
        extensionHandler.install = function (url) {
            var deferred = $q.defer();
            window.chrome.webstore.install(url || this.url, deferred.resolve, deferred.reject);

            return deferred.promise;
        };

        return extensionHandler;
    }
}];

module.exports = chromeExtensionHandler;

},{}],2:[function(require,module,exports){
'use strict';

var firefoxExtensionHandler = [function () {
    var extensionHandler;

    return {
        config: config,
        isBeingUsed: isBeingUsed,
        $get: ['$q', factory]
    };

    function config(extension) {
        extensionHandler = {
            browser: 'firefox',
            name: extension.name,
            url: extension.url,
            iconUrl: extension.iconUrl
        };
    }

    function isBeingUsed() {
            // Checks if the browser used is Firefox
        return typeof InstallTrigger !== 'undefined';
    }

    function factory($q) {
        extensionHandler.install = function (url) {
            var deferred = $q.defer();
            var installInfo = {};
            url = url || this.url;

            installInfo[this.name] = {
                URL: url,
                toString: function () {
                    return url;
                }
            };

                // As of April 4, 2016. Functions successCallback and errorCallback
                // will not trigger if your site is not whitelisted in MDN, but the
                // problem is they don't allow whitelisting
            window.InstallTrigger.install(installInfo, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        return extensionHandler;
    }
}];

module.exports = firefoxExtensionHandler;

},{}],3:[function(require,module,exports){
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

},{"./chrome-extension-handler":1,"./firefox-extension-handler":2}]},{},[3]);
