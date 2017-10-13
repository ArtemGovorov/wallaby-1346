module.exports = function(wallaby) {

  const ts = require('typescript');

  const wallabyWebpack = require('wallaby-webpack');
  // const CircularDependencyPlugin = require('circular-dependency-plugin');
  const webpack = require('webpack');
  const React = require('react');
  const path = require('path');

  var constants = require('./w/constants.json');

  const webpackPostprocessor = wallabyWebpack({
    // webpack options
    resolve: {
      modules: [
        path.join(wallaby.projectCacheDir, 'src/javascript')
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    externals: {
      cheerio: 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true,
      'react/addons': true
      // "react": "React"
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/\.(gif|png|scss|css|svg)$/, 'node-noop'),
      // new CircularDependencyPlugin({exclude: /node_modules/, failOnError: true}),
      new webpack.DefinePlugin({
        __IS_TEST__: 'true',
        CONSTANTS: JSON.stringify(constants)
      })
    ]
  });

  return {
    files: [
      'src/javascript/test/components/setup.ts',
      {pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false},
      {pattern: 'node_modules/phantomjs-polyfill/bind-polyfill.js', instrument: false},
      {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},
      {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
      {pattern: 'node_modules/jquery/dist/jquery.js', instrument: false},

      {pattern: 'node_modules/whatwg-fetch/fetch.js', instrument: false},
      {pattern: 'src/javascript/app/**/*.ts*', load: false},
      {pattern: 'src/javascript/dev/**/*.ts*', load: false},
      {pattern: 'src/javascript/test/utils.ts', instrument: false}
    ],

    tests: [
      {pattern: 'src/javascript/test/**/*Spec.ts*', load: false}
    ],

    compilers: {
      '**/*.ts*': wallaby.compilers.typeScript({
        typescript: ts
      })
    },

    postprocessor: webpackPostprocessor,
    testFramework: 'mocha',
    bootstrap: function() {
      window.__moduleBundler.loadTests();
    }
  };
};
