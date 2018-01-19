const path = require('path');
const fs = require('fs');
const tap = require('tap');
const loadPattern = require('../core/lib/loadPattern');
const testUtils = require('./util/test_utils.js');
const config = require('./util/patternlab-config.json');
const engineLoader = require('../core/lib/pattern_engines');
const testPatternsPath = path.resolve(
  __dirname,
  'files',
  '_react-test-patterns'
);

engineLoader.loadAllEngines(config);

// don't run these tests unless the react engine is installed
if (!engineLoader.react) {
  tap.test('React engine not installed, skipping tests.', test => {
    test.end();
  });
} else {
  const fpl = testUtils.fakePatternLab(testPatternsPath);

  tap.test('Load the hello world pattern and verify contents', test => {
    const patternPath = path.join(
      testPatternsPath,
      '00-atoms/00-general/HelloWorld.jsx'
    );
    const patternContent = fs.readFileSync(patternPath, { encoding: 'utf8' });
    const pattern = loadPattern(patternPath, fpl);

    test.equals(pattern.template, patternContent);
    test.end();
  });

  tap.test('Load the hello world pattern and verify output', test => {
    const patternPath = path.join(
      testPatternsPath,
      '00-atoms/00-general/HelloWorld.jsx'
    );
    const pattern = loadPattern(patternPath, fpl);

    return pattern.render().then(output => {
      test.equals(output, '<div>Hello world!</div>\n');
    });
  });
}
