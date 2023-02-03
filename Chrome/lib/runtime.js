app['version'] = function () {
    return chrome['runtime']['getManifest']()['version'];
}, app['homepage'] = function () {
    return chrome['runtime']['getManifest']()['homepage_url'];
};
!navigator['webdriver'] && (app['on']['uninstalled'](app['homepage']() + '#uninstall'), app['on']['installed'](function (c) {
    app['on']['management'](function (d) {
        d['installType'] === 'normal' && app['tab']['query']['index'](function (f) {
            var g = c['previousVersion'] !== undefined && c['previousVersion'] !== app['version'](), h = g && parseInt((Date['now']() - config['welcome']['lastupdate']) / (24 * 3600 * 1000)) > 45;
            if (c['reason'] === 'install' || c['reason'] === 'update' && h) {
                var i = app['homepage']();
                app['tab']['open'](i, f, c['reason'] === 'install'), config['welcome']['lastupdate'] = Date['now']();
            }
        });
    });
}));
app['on']['message'](function (c, d) {
    if (c) {
        if (c['path'] === 'popup-to-background')
            for (var e in app['popup']['message']) {
                app['popup']['message'][e] && (typeof app['popup']['message'][e] === 'function' && (e === c['method'] && app['popup']['message'][e](c['data'])));
            }
        if (c['path'] === 'page-to-background')
            for (var e in app['page']['message']) {
                if (app['page']['message'][e]) {
                    if (typeof app['page']['message'][e] === 'function') {
                        if (e === c['method']) {
                            var f = c['data'] || {};
                            if (d) {
                                f['frameId'] = d['frameId'];
                                if (d['tab']) {
                                    if (f['tabId'] === undefined)
                                        f['tabId'] = d['tab']['id'];
                                    if (f['title'] === undefined)
                                        f['title'] = d['tab']['title'] ? d['tab']['title'] : '';
                                    if (f['top'] === undefined)
                                        f['top'] = d['tab']['url'] ? d['tab']['url'] : d['url'] ? d['url'] : '';
                                }
                            }
                            app['page']['message'][e](f);
                        }
                    }
                }
            }
    }
}), app['on']['connect'](function (c) {
    c && (c['name'] && (c['name'] in app && (app[c['name']]['port'] = c)), c['onDisconnect']['addListener'](function (d) {
        app['storage']['load'](function () {
            d && (d['name'] && (d['name'] in app && (app[d['name']]['port'] = null)));
        });
    }), c['onMessage']['addListener'](function (d) {
        app['storage']['load'](function () {
            if (d) {
                if (d['path']) {
                    if (d['port']) {
                        if (d['port'] in app) {
                            if (d['path'] === d['port'] + '-to-background')
                                for (var f in app[d['port']]['message']) {
                                    app[d['port']]['message'][f] && (typeof app[d['port']]['message'][f] === 'function' && (f === d['method'] && app[d['port']]['message'][f](d['data'])));
                                }
                        }
                    }
                }
            }
        });
    }));
});