Package.describe({
    name: 'arch:template-butler',
    summary: 'writing DRY client-side JS with dependency for templates',
    version: '2.0.3',
    git: 'https://github.com/0a-/Template-Butler'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.5');
    api.addFiles('lib/core.js', ['client']);
    api.export('TButler',['client']);
    api.export('TemplateButler',['client']);
});

Package.onTest(function(api) {
    api.use('arch:template-butler');
    api.use('tinytest');
    api.addFiles('test/basic_tests.js',['client']);
    api.addFiles('test/advanced_tests.js',['client']);
});
