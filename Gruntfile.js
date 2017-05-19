module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            dev: {
                src: ['src/web-extension-handler.js'],
                dest: 'angular-web-extension-handler.js'
            }
        },
        uglify: {
            prod: {
                options: { mangle: true, compress: true },
                src: 'angular-web-extension-handler.js',
                dest: 'angular-web-extension-handler.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['browserify', 'uglify']);
};
