module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        compress: {
          global_defs: {
            "DEBUG": false
          },
        }
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['js/main.js']
        }
      }
    },
    exec: {
      jade_minify: {
        command: './compile.js'
      }
    },
    watch: {
      files: ['js/*', 'shader/*', 'template.jade'],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['uglify', 'exec']);
};
