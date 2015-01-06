Package.describe({
    name: 'arch:fermions',
    summary: 'Writing reusable cilent side codes.',
    version: '0.1.0',
    git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.2.1');
    //commented out because of https://github.com/mquandalle/meteor-harmony/issues/37
    // api.use('mquandalle:harmony');
    api.addFiles('lib/core.js', 'client');
    api.export('fermions','client');
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('arch:fermions');
    api.addFiles('test/basic_tests.js','client');
    api.addFiles('test/advanced_tests.js','client');
});