Package.describe({
    name: 'arch:fermions',
    summary: 'Writing reusable cilent-side codes on Meteor.',
    version: '1.0.0',
    git: 'https://github.com/0a-/fermions'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.2.1');
    //commented out because of https://github.com/mquandalle/meteor-harmony/issues/37
    // api.use('mquandalle:harmony');
    api.addFiles('lib/core.js', 'client');
    api.export('Fermions','client');
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('arch:fermions');
    api.addFiles('test/basic_tests.js','client');
    api.addFiles('test/advanced_tests.js','client');
});