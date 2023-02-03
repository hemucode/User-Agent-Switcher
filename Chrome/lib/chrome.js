function a() {
    var k = ['management'];
    a = function () {
        return k;
    };
    return a();
}
var app = {};
function b(c, d) {
    var e = a();
    return b = function (f, g) {
        f = f - 0;
        var h = e[f];
        return h;
    }, b(c, d);
}
app['error'] = function () {
    return chrome['runtime']['lastError'];
}, app['hotkey'] = {
    'on': {
        'pressed': function (c) {
            chrome['commands']['onCommand']['addListener'](function (d) {
                if (c)
                    c(d);
            });
        }
    }
}, app['contentscripts'] = {
    'register': function (c) {
        if (chrome['scripting'])
            return chrome['scripting']['registerContentScripts'](c);
    },
    'unregister': function (c) {
        if (chrome['scripting'])
            return c ? chrome['scripting']['unregisterContentScripts'](c) : chrome['scripting']['unregisterContentScripts']();
    }
}, app['popup'] = {
    'port': null,
    'message': {},
    'receive': function (c, d) {
        c && (app['popup']['message'][c] = d);
    },
    'send': function (c, d) {
        c && chrome['runtime']['sendMessage']({
            'data': d,
            'method': c,
            'path': 'background-to-popup'
        }, app['error']);
    },
    'post': function (c, d) {
        c && (app['popup']['port'] && app['popup']['port']['postMessage']({
            'data': d,
            'method': c,
            'path': 'background-to-popup'
        }));
    }
}, app['button'] = {
    'icon': function (c, d, e) {
        if (d && typeof d === 'object') {
            var f = { 'path': d };
            if (c)
                f['tabId'] = c;
            chrome['action']['setIcon'](f, function (g) {
                if (e)
                    e(g);
            });
        } else {
            var f = {};
            d ? f = {
                'path': {
                    '16': '../data/popup/icons/16/' + d + '.png',
                    '32': '../data/popup/icons/32/' + d + '.png'
                }
            } : f = {
                'path': {
                    '16': '../data/icons/16.png',
                    '32': '../data/icons/32.png',
                    '48': '../data/icons/48.png',
                    '64': '../data/icons/64.png'
                }
            };
            if (c)
                f['tabId'] = c;
            chrome['action']['setIcon'](f, function (g) {
                if (e)
                    e(g);
            });
        }
    }
}, app['storage'] = {
    'local': {},
    'read': function (c) {
        return app['storage']['local'][c];
    },
    'update': function (c) {
        if (app['session'])
            app['session']['load']();
        chrome['storage']['local']['get'](null, function (d) {
            app['storage']['local'] = d, c && c('update');
        });
    },
    'write': function (c, d, e) {
        let f = {};
        f[c] = d, app['storage']['local'][c] = d, chrome['storage']['local']['set'](f, function (g) {
            e && e(g);
        });
    },
    'load': function (c) {
        const d = Object['keys'](app['storage']['local']);
        d && d['length'] ? c && c('cache') : app['storage']['update'](function () {
            if (c)
                c('disk');
        });
    }
}, app['on'] = {
    'management': function (c) {
        chrome[b(0)]['getSelf'](c);
    },
    'uninstalled': function (c) {
        chrome['runtime']['setUninstallURL'](c, function () {
        });
    },
    'installed': function (c) {
        chrome['runtime']['onInstalled']['addListener'](function (d) {
            app['storage']['load'](function () {
                c(d);
            });
        });
    },
    'startup': function (c) {
        chrome['runtime']['onStartup']['addListener'](function (d) {
            app['storage']['load'](function () {
                c(d);
            });
        });
    },
    'connect': function (c) {
        chrome['runtime']['onConnect']['addListener'](function (d) {
            app['storage']['load'](function () {
                if (c)
                    c(d);
            });
        });
    },
    'storage': function (c) {
        chrome['storage']['onChanged']['addListener'](function (d, e) {
            app['storage']['update'](function () {
                c && c(d, e);
            });
        });
    },
    'message': function (c) {
        chrome['runtime']['onMessage']['addListener'](function (d, e, f) {
            return app['storage']['load'](function () {
                c(d, e, f);
            }), !![];
        });
    }
}, app['page'] = {
    'port': null,
    'message': {},
    'sender': { 'port': {} },
    'receive': function (c, d) {
        c && (app['page']['message'][c] = d);
    },
    'post': function (c, d, e) {
        if (c) {
            if (e)
                app['page']['sender']['port'][e] && app['page']['sender']['port'][e]['postMessage']({
                    'data': d,
                    'method': c,
                    'path': 'background-to-page'
                });
            else
                app['page']['port'] && app['page']['port']['postMessage']({
                    'data': d,
                    'method': c,
                    'path': 'background-to-page'
                });
        }
    },
    'send': function (c, d, e, f) {
        c && chrome['tabs']['query']({}, function (g) {
            var h = chrome['runtime']['lastError'];
            if (g && g['length']) {
                var i = {
                    'method': c,
                    'data': d ? d : {},
                    'path': 'background-to-page'
                };
                g['forEach'](function (j) {
                    j && (i['data']['tabId'] = j['id'], i['data']['top'] = j['url'] ? j['url'] : '', i['data']['title'] = j['title'] ? j['title'] : '', e !== null && e !== undefined ? e === j['id'] && (f !== null && f !== undefined ? chrome['tabs']['sendMessage'](j['id'], i, { 'frameId': f }, app['error']) : chrome['tabs']['sendMessage'](j['id'], i, app['error'])) : chrome['tabs']['sendMessage'](j['id'], i, app['error']));
                });
            }
        });
    }
}, app['tab'] = {
    'open': function (c, d, e, f) {
        var g = {
            'url': c,
            'active': e !== undefined ? e : !![]
        };
        d !== undefined && (typeof d === 'number' && (g['index'] = d + 1)), chrome['tabs']['create'](g, function (h) {
            if (f)
                f(h);
        });
    },
    'query': {
        'index': function (c) {
            chrome['tabs']['query']({
                'active': !![],
                'currentWindow': !![]
            }, function (d) {
                var e = chrome['runtime']['lastError'];
                if (d && d['length'])
                    c(d[0]['index']);
                else
                    c(undefined);
            });
        },
        'active': function (c) {
            chrome['tabs']['query']({
                'active': !![],
                'currentWindow': !![]
            }, function (d) {
                var e = chrome['runtime']['lastError'];
                if (d && d['length'])
                    c(d[0]);
                else
                    c(undefined);
            });
        }
    },
    'reload': function (c, d, e) {
        c ? d && typeof d === 'object' ? chrome['tabs']['reload'](c, d, function (f) {
            if (e)
                e(f);
        }) : chrome['tabs']['reload'](c, { 'bypassCache': d !== undefined ? d : ![] }, function (f) {
            if (e)
                e(f);
        }) : chrome['tabs']['query']({
            'active': !![],
            'currentWindow': !![]
        }, function (f) {
            var g = chrome['runtime']['lastError'];
            f && f['length'] && (d && typeof d === 'object' ? chrome['tabs']['reload'](f[0]['id'], d, function (h) {
                if (e)
                    e(h);
            }) : chrome['tabs']['reload'](f[0]['id'], { 'bypassCache': d !== undefined ? d : ![] }, function (h) {
                if (e)
                    e(h);
            }));
        });
    }
};