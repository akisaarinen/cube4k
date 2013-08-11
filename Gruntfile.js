module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/*.js'],
        dest: 'build/app.js'
      }
    },
    uglify: {
      options: {
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    exec: {
      jade_minify: {
        command: './compile.js'
      }
    },
    watch: {
      files: ['js/*.js'],
      tasks: ['concat', 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['concat', 'uglify', 'exec']);
};
