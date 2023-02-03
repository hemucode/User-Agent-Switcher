var core = {
    'start': function () {
        core['load']();
    },
    'install': function () {
        core['load']();
    },
    'load': function () {
        config['domain']['cleanup'](config['useragent']['url']), app['button']['icon'](null, config['badge']['icon']), core['register']['netrequest']();
    },
    'action': {
        'storage': function (c, d) {
        },
        'hotkey': function (c) {
            c === 'toggle-default-mode' && (config['badge']['icon'] === '' ? core['update']['useragent'](config['useragent']['global']) : core['update']['useragent']({
                'url': null,
                'id': [
                    '',
                    '',
                    'default'
                ]
            }));
        }
    },
    'update': {
        'page': function (c) {
            app['page']['send']('storage', {
                'top': c ? c['top'] : '',
                'url': config['useragent']['url'],
                'useragent': config['useragent']['string']
            }, c ? c['tabId'] : null, c ? c['frameId'] : null);
        },
        'popup': function () {
            app['popup']['send']('storage', {
                'key': config['useragent']['key'],
                'url': config['useragent']['url'],
                'text': config['useragent']['text'],
                'string': config['useragent']['string']
            });
        },
        'useragent': function (c) {
            if (c) {
                if (c['id']) {
                    let d = c['id'];
                    config['useragent']['key'] = d;
                    c['url'] && (config['useragent']['global'] = c, config['useragent']['url'] = c['url']);
                    let f = config['useragent']['obj'];
                    if (d['length'] === 1)
                        config['useragent']['string'] = f[d[0]];
                    else
                        d['length'] === 2 ? config['useragent']['string'] = f[d[0]][d[1]] : config['useragent']['string'] = '';
                    config['badge']['icon'] = config['useragent']['string'] ? d[0] : '', app['button']['icon'](null, config['badge']['icon']), core['register']['netrequest'](), core['register']['scripts'](), core['update']['popup']();
                }
            }
        }
    },
    'register': {
        'scripts': async function () {
            await app['contentscripts']['unregister'](), config['useragent']['string'] && await app['contentscripts']['register'](config['contentscripts']['filters']);
        },
        'netrequest': async function () {
            await app['netrequest']['display']['badge']['text'](![]), await app['netrequest']['rules']['remove']['by']['action']['type']('modifyHeaders', 'requestHeaders');
            if (config['useragent']['string']) {
                const c = config['useragent']['url']['replace'](/\s+/g, '')['split'](','), d = c['indexOf']('all_urls') === -1, e = c['indexOf']('*') === -1, f = config['useragent']['string'];
                if (e && d)
                    for (let g = 0; g < c['length']; g++) {
                        app['netrequest']['rules']['push']({
                            'action': {
                                'type': 'modifyHeaders',
                                'requestHeaders': [{
                                        'value': f,
                                        'operation': 'set',
                                        'header': 'user-agent'
                                    }]
                            },
                            'condition': {
                                'urlFilter': '||' + c[g],
                                'resourceTypes': [
                                    'sub_frame',
                                    'main_frame'
                                ]
                            }
                        });
                    }
                else
                    app['netrequest']['rules']['push']({
                        'action': {
                            'type': 'modifyHeaders',
                            'requestHeaders': [{
                                    'value': f,
                                    'operation': 'set',
                                    'header': 'user-agent'
                                }]
                        },
                        'condition': {
                            'urlFilter': '*',
                            'resourceTypes': [
                                'sub_frame',
                                'main_frame'
                            ]
                        }
                    });
                await app['netrequest']['rules']['update']();
            }
        }
    }
};
app['popup']['receive']('useragent-url', function (c) {
    config['useragent']['url'] = 'all_urls';
    if (c)
        config['domain']['cleanup'](c);
    core['register']['netrequest'](), core['register']['scripts'](), core['update']['popup']();
}), app['popup']['receive']('reload', function () {
    app['tab']['query']['active'](function (c) {
        c && app['tab']['reload'](c['id']);
    });
}), app['popup']['receive']('update-useragent-string', function (c) {
    let d = config['useragent']['obj'];
    if (c['key']['length'] === 1)
        d[c['key'][0]] = c['UA'];
    if (c['key']['length'] === 2)
        d[c['key'][0]][c['key'][1]] = c['UA'];
    config['useragent']['string'] = c['UA'], config['useragent']['obj'] = d, core['register']['netrequest'](), core['register']['scripts'](), core['update']['popup']();
}), app['page']['receive']('load', core['update']['page']), app['popup']['receive']('load', core['update']['popup']), app['popup']['receive']('useragent-id', core['update']['useragent']), app['popup']['receive']('faq', function () {
    app['tab']['open'](app['homepage']());
}), app['popup']['receive']('check', function () {
    app['tab']['open'](config['test']['page']);
}), app['popup']['receive']('bug', function () {
    app['tab']['open'](app['homepage']() + '#report');
}), app['popup']['receive']('status-td-text', function (c) {
    config['useragent']['text'] = c;
}), app['popup']['receive']('donation', function () {
    app['tab']['open'](app['homepage']() + '?reason=support');
}), app['on']['startup'](core['start']), app['on']['installed'](core['install']), app['on']['storage'](core['action']['storage']), app['storage']['load'](core['register']['scripts']), app['hotkey']['on']['pressed'](core['action']['hotkey']);