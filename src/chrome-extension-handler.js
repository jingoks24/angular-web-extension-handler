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
