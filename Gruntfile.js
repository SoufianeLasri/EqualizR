/*global module:true, require:false*/
module.exports = function(grunt) {
    'use strict';

    var STATIC_DIR = 'src/',
        TEMPLATE_DIR = STATIC_DIR + 'templates/',
        CSS_DIR = STATIC_DIR + 'css/',
        JAVASCRIPT_DIR = STATIC_DIR + 'js/',
        VENDORS_JAVASCRIPT_DIR = JAVASCRIPT_DIR + 'vendors/',
        VENDORS_CSS_DIR = CSS_DIR + 'vendors/',
        FONTS_DIR = STATIC_DIR + 'fonts/',
        IMAGES_DIR = STATIC_DIR + 'images/',
        PUBLISH_DIR = 'dist',
        ASSETS_DIR = PUBLISH_DIR + '/assets';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig(
        {
            pkg: grunt.file.readJSON('package.json'),

            browserSync:
            {
                dev:
                {
                    src : [
                        'dist/index.html',
                        'dist/assets/css/*.css',
                        'dist/assets/js/*.js'
                    ]
                },

                options: {
                    watchTask: true,
                    server: {
                        baseDir: 'dist'
                    }
                }
            },

            browserify:
            {
                deploy:
                {
                    files:
                    {
                        'tmp/main.js': JAVASCRIPT_DIR + 'main.js',
                    },
                    options: {
                        transform: [ 'babelify' ]
                    }
                },

                dev:
                {
                    files:
                    {
                        'dist/assets/js/main.js': JAVASCRIPT_DIR + 'main.js',
                    },
                    options: {
                        transform: [ 'babelify' ]
                    }
                }
            },

            uglify:
            {
                deploy:
                {
                    files:
                    {
                        'dist/assets/js/main.js': 'tmp/main.js'
                    }
                }
            },

            jade:
            {
                deploy:
                {
                    files:
                    {
                        'dist/index.html': 'src/templates/index.jade'
                    },
                    options:
                    {
                        pretty: true,
                        compileDebug: true
                    }
                }

            },

            stylus:
            {
                deploy:
                {
                    options:
                    {
                        'compress': true
                    },
                    files:
                    {
                        'dist/assets/css/styles.css': 'src/css/styles.styl'
                    }
                }

            },

            copy:
            {
                vendors_css:
                {
                    files: [
                    {
                        expand: true,
                        cwd: VENDORS_CSS_DIR,
                        src: [ '**/*.css' ],
                        dest: ASSETS_DIR + '/css/vendors'
                    }]
                },

                models:
                {
                    files: [
                    {
                        expand: true,
                        cwd: JAVASCRIPT_DIR + 'models',
                        src: [ '**/*.js', '**/*.json' ],
                        dest: ASSETS_DIR + '/js/models'
                    }]
                },

                fonts:
                {
                    files: [
                    {
                        expand: true,
                        cwd: FONTS_DIR,
                        src: [ '*.*' ],
                        dest: ASSETS_DIR + '/fonts'
                    }]
                },

                images:
                {
                    files: [
                    {
                        expand: true,
                        cwd: IMAGES_DIR,
                        src: [ '**/*.*' ],
                        dest: ASSETS_DIR + '/images'
                    }]
                }

            },

            watch:
            {
                options:
                {
                    livereload: true,
                },

                js:
                {
                    files: [ JAVASCRIPT_DIR + '**/*.js' ],
                    tasks: [ 'browserify:dev' ]
                },

                vendors_css:
                {
                    files: [ CSS_DIR + 'vendors/**/*.css' ],
                    tasks: [ 'copy:vendors_css' ]
                },

                models:
                {
                    files: [ JAVASCRIPT_DIR + 'models/**/*.js', JAVASCRIPT_DIR + 'models/**/*.json' ],
                    tasks: [ 'copy:models', 'browserify:dev' ]
                },

                stylus:
                {
                    files: [ CSS_DIR + '**/*.styl' ],
                    tasks: [ 'stylus' ]
                },

                fonts:
                {
                    files: [ FONTS_DIR + '*.*' ],
                    tasks: [ 'copy:fonts' ]
                },

                images:
                {
                    files: [ IMAGES_DIR + '**/*.*' ],
                    tasks: [ 'copy:images' ]
                },

                jade:
                {
                    files: [ TEMPLATE_DIR + '**/*.jade' ],
                    tasks: [ 'jade' ]
                }
            }

        });

    grunt.registerTask('default', [
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('deploy', [
        'browserify:deploy',
        'uglify:deploy',
        'copy',
        'jade',
        'stylus'
    ]);
};
