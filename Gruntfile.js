﻿module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-jscs');
    //grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-create-test-files');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-generate');

    var appFiles = [
            'app/utils/strict.js',
            'app/utils/namespace.js',
            'app/element/**/metadata.js',
            'app/config.js',
            'app/utils/*.js',
            'app/messaging/**/*.js',
            'app/controls/_base/**/*.js',
            'app/element/_mixins/*.js',
            'app/element/*.js',
            'app/**/*.js',
            'extensions/**/*.js',
            '!app/utils/pdf/**/*.js',
            '!app/extensions/**/*.js',
            '!app/utils/exel-builder/*.js',
            '!app/element/dataElement/listBox/**/*.*'
        ],
        extFiles = [],
        vendorFiles = [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/underscore/underscore.js',
            'bower_components/backbone/backbone.js',
            'bower_components/metronic/assets/global/plugins/select2/select2.js',
            'bower_components/moment/moment.js',
            'bower_components/moment/lang/ru.js',
            'bower_components/ractive/ractive.js',
            'bower_components/signalr/jquery.signalR.js',
            'bower_components/jstree/dist/jstree.js',
            'bower_components/ulogin/index.js',
            'bower_components/blockUI/jquery.blockUI.js',
            'bower_components/metronic/assets/global/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js',
            'bower_components/metronic/assets/global/plugins/bootstrap/js/bootstrap.min.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.ru.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.ru.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js',
            'bower_components/jquery-bootpag/lib/jquery.bootpag.min.js',
            'bower_components/metronic/assets/global/plugins/uniform/jquery.uniform.js',
            'bower_components/metronic/assets/global/plugins/fullcalendar/fullcalendar/fullcalendar.js',
            'bower_components/metronic/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.js',
            'bower_components/metronic/assets/global/plugins/bootstrap-toastr/toastr.min.js',
            'bower_components/metronic/assets/global/scripts/metronic.js',
            'bower_components/JavaScript-MD5/js/md5.js',
            'bower_components/metronic/assets/admin/layout/scripts/layout.js',
            'app/utils/pdf/build/pdf.js'
        ],
        appStyleFiles = ['app/styles/main.less'],
        vendorCssFiles = [
            'bower_components/jstree-bootstrap-theme/dist/themes/proton/style.css',
            'bower_components/font-awesome/css/font-awesome.min.css',
            'bower_components/metronic/assets/global/plugins/simple-line-icons/simple-line-icons.min.css',
            'bower_components/metronic/assets/global/plugins/bootstrap/css/bootstrap.min.css',
            'bower_components/metronic/assets/global/plugins/uniform/css/uniform.default.css',
            'bower_components/metronic/assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
            'bower_components/metronic/assets/global/plugins/select2/select2.css',
            'bower_components/metronic/assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
            'bower_components/metronic/assets/global/plugins/bootstrap-datetimepicker/css/datetimepicker.css',
            'bower_components/metronic/assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.css',
            'bower_components/metronic/assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css',
            'bower_components/metronic/assets/global/plugins/bootstrap-modal/css/bootstrap-modal.css',
            'bower_components/metronic/assets/global/css/components.css',
            'bower_components/metronic/assets/global/css/plugins.css',
            'bower_components/metronic/assets/global/plugins/fullcalendar/fullcalendar/fullcalendar.css',
            'bower_components/metronic/assets/global/plugins/bootstrap-toastr/toastr.min.css',

            'bower_components/metronic/assets/admin/layout/css/layout.css',
            'bower_components/metronic/assets/admin/layout/css/custom.css',

            'bower_components/metronic/assets/admin/layout/css/themes/darkblue.css'
        ],
        unitTestFiles = ['app/utils/strict.js', 'test/unit/setup.js', 'test/unit/**/*.js'],
        e2eTestFiles = ['test/e2e/setup.js', 'test/e2e/**/*.js'],
        templateFiles = ["app/**/*.tpl.html"],
        outerExtensionScript = '*.Extensions/**/*.js',
        outerExtensionIntegrationTest = '*.Extensions/**/integrationTests/**/*.js',
        outerExtensionStyle = '*.Extensions/**/*.css',
        outerExtensionLessStyle = '*.Extensions/**/*.less',
        outerExtensionFavicon = '*.Extensions/*.ico',
        outerExtensionPdf = '*.Extensions/**/*.pdf',
        outerExtensionPNG = '*.Extensions/*.png';

    grunt.initConfig({
        concat: {
            app: {
                src: appFiles,
                dest: 'out/app.js'
            },
            extensions: {
                src: extFiles,
                dest: 'out/extension.js'
            },
            vendor: {
                src: vendorFiles,
                dest: 'out/vendor.js'
            },
            vendor_css: {
                src: vendorCssFiles,
                dest: 'out/css/vendor.css'
            },
            prodApp: {
                src: appFiles,
                dest: 'out/prodApp.js',
                options: {
                    banner: ';(function(){',
                    footer:'})();'
                }
            },
            unit_test: {
                src: unitTestFiles,
                dest: 'out/unitTest.js'
            },
            e2e_test: {
                src: e2eTestFiles,
                dest: 'out/e2eTest.js'
            }
        },

        copy: {
            fonts: {
                cwd: 'bower_components/font-awesome/fonts/',
                src: '*',
                dest: 'out/fonts/',
                expand: true
            },
            fonts1: {
                cwd: 'app/styles/font/',
                src: '*',
                dest: 'out/fonts/',
                expand: true
            },
            css:{
                expand: true,
                flatten: true,
                src: 'app/styles/main.css',
                dest: 'out/css/'
            },
            resources: {
                expand: true,
                flatten: true,
                src: [
                    'bower_components/jstree-bootstrap-theme/src/themes/default/throbber.gif',
                    'bower_components/jstree-bootstrap-theme/src/themes/default/30px.png',
                    'bower_components/jstree-bootstrap-theme/src/themes/default/32px.png',
                    'bower_components/metronic/assets/global/plugins/select2/select2-spinner.gif'
                ],
                dest: 'out/css/'
            },
            favicon:{
                expand: true,
                flatten: true,
                src: [],
                dest: 'out/images/'
            },
            pdf:{
                expand: true,
                flatten: true,
                src: [],
                dest: 'out/docs/'
            },
            png:{
                expand: true,
                flatten: true,
                src: [],
                dest: 'out/images/'
            },
            images: {
                files: [
                    {
                        cwd: 'bower_components/metronic/assets/global/img/',
                        src: '*',
                        dest: 'out/img/',
                        expand: true
                    },
                    {
                        cwd: 'bower_components/metronic/assets/global/plugins/select2/',
                        src: 'select2.png',
                        dest: 'out/css/',
                        expand: true
                    },
                    {
                        cwd: 'bower_components/metronic/assets/global/plugins/uniform/images',
                        src: '*',
                        dest: 'out/images/',
                        expand: true
                    }
                ]
            }
        },

        jscs: {
            default: {
                src: ['app/element/dataElement/dataGrid/**/*.js', 'app/controls/dataGrid/**/*.js'],
                options: {
                    config: '.jscsrc'
                }
            }
        },

        watch: {
            scripts: {
                files: appFiles.concat(unitTestFiles,e2eTestFiles),
                tasks: ['concat:app', 'concat:unit_test', 'concat:e2e_test']
            },
            templates: {
                files: templateFiles,
                tasks: ['jst']
            }
        },

        jst : {
            templates : {
                options : {
                    namespace : 'InfinniUI.Template',
                    prettify : true,
                    processName : function (filename) {
                        return filename.replace(/^app\//, '');
                    }
                },
                files : {
                    "out/templates.js" : templateFiles
                }
            }
        },

        less : {
            extension: {
                src: [],
                dest: 'out/css/extension.css'
            },
            default: {
                src: appStyleFiles,
                dest: 'app/styles/main.css'
            }
        },

        connect: {
            http: {
                options: {
                    open: 'http://localhost:8181/test/unit/',
                    hostname : '*',
                    port: '8181'
                }
            },
            https: {
                options: {
                    open: 'http://localhost:8181/test/unit/',
                    hostname : '*',
                    protocol: 'https',
                    port: '8181',
                    key: grunt.file.read('certificates/server.key').toString(),
                    cert: grunt.file.read('certificates/server.crt').toString(),
                    ca: grunt.file.read('certificates/ca.crt').toString()
                }
            }
        },

        clean:{
            default: {
                src: "test/unit/autogeneratedTests/elementAPI/"
            }
        },

        create_test_files: {
            your_target: {
                options: {
                    templateFile: 'test/unit/autogeneratedTests/templateElementApi.test',
                    destinationBasePath: 'test/unit/autogeneratedTests/elementAPI/',
                    sourceBasePath: 'app/element/'
                },
                files: {
                    src: [
                        '**/*.js',          //включить все вложенные .js файлы
                        '!*.js',            //исключить js файлы лежащие в корне sourceBasePath
                        '!**/*Builder.js',  //исключить все билдеры
                        '!_mixins/**'       //исключить все mixin-ы
                    ]
                }
            }
        },

        generate: {

        }
    });

    var previous_force_state = grunt.option("force");
    grunt.registerTask("force",function(set){
        if (set === "on") {
            grunt.option("force",true);
        }
        else if (set === "off") {
            grunt.option("force",false);
        }
        else if (set === "restore") {
            grunt.option("force",previous_force_state);
        }
        console.log(grunt.option('force'));
    });

    grunt.task.registerTask('build',
        function (extensionPath) {
            if (extensionPath) {
                var
                    path = require('path'),
                    tmp = [],
                    less = [],
                    tmpFavicon = grunt.config.get('copy.favicon.src').slice(0),
                    tmpPdf = grunt.config.get('copy.pdf.src').slice(0),
                    tmpPNG = grunt.config.get('copy.png.src').slice(0);

                tmp.push(path.join(extensionPath, outerExtensionScript),
                    '!' + path.join(extensionPath, outerExtensionIntegrationTest));
                less.push(path.join(extensionPath, outerExtensionStyle),
                    path.join(extensionPath, outerExtensionLessStyle));
                tmpFavicon.push(path.join(extensionPath, outerExtensionFavicon));
                tmpPdf.push(path.join(extensionPath, outerExtensionPdf));
                tmpPNG.push(path.join(extensionPath, outerExtensionPNG));

                grunt.config.set('copy.png.src', tmpPNG);
                grunt.config.set('copy.favicon.src', tmpFavicon);
                grunt.config.set('copy.pdf.src', tmpPdf);
                grunt.config.set('concat.extensions.src', tmp);
                grunt.config.set('less.extension.src', less);
            }else{
                grunt.config.set('concat.app.src', appFiles);
                grunt.config.set('less.default.src', appStyleFiles);
            }

            //grunt.log.writeln(extensionPath + outerExtensionScript);
            //grunt.log.writeln(grunt.config().concat.app.src);

            var tasks = [
                'less',
                'force:on',
                'clean:default',
                //'jscs',
                'force:restore',
                'jst',
                'concat',
                'copy'
            ];
            grunt.task.run(tasks);
        }
    );

    grunt.task.registerTask('build with autogen tests',
        [
            'less',
            'force:on',
            //'jscs',
            'force:restore',
            'jst',
            'clean:default',
            'create_test_files',
            'concat',
            'copy'
        ]
    );

    grunt.task.registerTask('default', function (protocol) {
            var protocols = ['http', 'https'];
            if (protocols.indexOf(protocol) === -1) {
                protocol = protocols[0];
            }
            var tasks = ['build', 'connect:' + protocol, 'watch'];
            console.log(tasks);
            grunt.task.run(tasks);
        }
    );

    grunt.task.registerTask('newElement', function(name){
            name = name.charAt(0).toLowerCase() + name.slice(1);

            grunt.task.run('generate:element:' +name+"@app/element/"+name);
            grunt.task.run('generate:builder:' +name+"Builder"+"@app/element/"+name);
            grunt.task.run('generate:control:' +name+"@app/controls/"+name);
            grunt.task.run('generate:unittest:' +name+"@test/unit/element/"+name);
        }
    );

    grunt.task.registerTask('removeElement', function(name){
            name = name.charAt(0).toLowerCase() + name.slice(1);

            grunt.config('clean.element', ['app/element/'+name,'app/controls/'+name,'test/unit/element/'+name]);
            grunt.task.run('clean:element');
        }
    );

};