module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        paths: {
            src: {
                app: {
                    witbot: 'src/witbot.js'
                },
                prd: [
                    'src/index.js',
                    'src/utils.js',
                    '<%= paths.src.app.witbot %>',
                    'src/init.js'
                ],
                all: [
                    'src/**/*.js'
                ]
            },
            dest: {
                // witbot: 'go-app-witbot.js'
                prd: 'go-app-witbot.js'
            },
            // test: {
            //     witbot: [
            //         'test/setup.js',
            //         'src/utils.js',
            //         '<%= paths.src.app.witbot %>',
            //         'test/witbot.test.js'
            //     ]
            // }
            test: [
                'test/setup.js',
               'src/utils.js',
                '<%= paths.src.app.witbot %>',
                'test/**/*.test.js'
            ]
        },
        jshint: {
            options: {jshintrc: '.jshintrc'},
            all: [
                'Gruntfile.js',
                '<%= paths.src.all %>',
              //  '<%= paths.test %>'
            ]
        },

        watch: {
            src: {
                files: [
                    '<%= paths.src.all %>',
                    '<%= paths.test %>'
                  ],
                tasks: ['default'],
                options: {
                    atBegin: true
                }
            }
        },

        concat: {
            options: {
                banner: [
                      '// WARNING: This is a generated file.',
                      '//          If you edit it you will be sad.',
                      '//          Edit src/app.js instead.',
                      '\n'
                ].join('\n')
            },
            // witbot: {
            //     src: ['<%= paths.src.witbot %>'],
            //     dest: '<%= paths.dest.witbot %>'
            // }
            prd: {
                src: ['<%= paths.src.prd %>'],
                dest: '<%= paths.dest.prd %>'
            }
        },
        mochaTest: {
            test: {
                src: ['<%= paths.test %>'],
                options: {
                  reporter: 'spec'
                }
            }
        }
    });

    grunt.registerTask('test', [
        'jshint',
        'build',
        'mochaTest'
    ]);

    grunt.registerTask('build', [
        'concat'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
};
