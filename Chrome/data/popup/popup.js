var background = {
        'port': null,
        'message': {},
        'receive': function (c, d) {
            c && (background['message'][c] = d);
        },
        'send': function (c, d) {
            c && chrome['runtime']['sendMessage']({
                'method': c,
                'data': d,
                'path': 'popup-to-background'
            }, function () {
                return chrome['runtime']['lastError'];
            });
        },
        'connect': function (c) {
            chrome['runtime']['onMessage']['addListener'](background['listener']), c && (background['port'] = c, background['port']['onMessage']['addListener'](background['listener']), background['port']['onDisconnect']['addListener'](function () {
                background['port'] = null;
            }));
        },
        'post': function (c, d) {
            c && (background['port'] && background['port']['postMessage']({
                'method': c,
                'data': d,
                'path': 'popup-to-background',
                'port': background['port']['name']
            }));
        },
        'listener': function (c) {
            if (c)
                for (let d in background['message']) {
                    background['message'][d] && (typeof background['message'][d] === 'function' && (c['path'] === 'background-to-popup' && (c['method'] === d && background['message'][d](c['data']))));
                }
        }
    }, config = {
        'status': { 'text': '' },
        'clean': {
            'table': function (c) {
                let d = [...c['getElementsByTagName']('td')];
                if (d && d['length'])
                    for (let e = 0; e < d['length']; e++) {
                        d[e]['removeAttribute']('type');
                    }
            }
        },
        'useragent': {
            'key': [],
            'string': '',
            'url': 'all_urls',
            'sanitize': function (c) {
                return c = c ? c['replace'](/[^a-z0-9 áéíóúñü\(\)\.\,\_\-\;\:\/]/gim, '') : '', c['trim']();
            }
        },
        'information': {
            'reset': function () {
                document['getElementById']('status-td')['textContent'] = config['status']['text'];
            },
            'update': function (c) {
                let d = c['target']['getAttribute']('title');
                document['getElementById']('status-td')['textContent'] = d || config['status']['text'];
            },
            'listener': function () {
                let c = [...document['querySelectorAll']('td')];
                if (c && c['length'])
                    for (let d = 0; d < c['length']; d++) {
                        c[d]['addEventListener']('mouseleave', config['information']['reset'], ![]), c[d]['addEventListener']('mouseenter', config['information']['update'], ![]);
                    }
            }
        },
        'load': function () {
            document['getElementById']('mobile-browsers')['addEventListener']('click', config['handle']['click'], ![]), document['getElementById']('desktop-browsers')['addEventListener']('click', config['handle']['click'], ![]), document['getElementById']('operating-systems')['addEventListener']('click', config['handle']['click'], ![]), document['getElementById']('faq')['addEventListener']('click', function () {
                background['send']('faq');
            }, ![]), document['getElementById']('bug')['addEventListener']('click', function () {
                background['send']('bug');
            }, ![]), document['getElementById']('check')['addEventListener']('click', function () {
                background['send']('check');
            }, ![]), document['getElementById']('reload')['addEventListener']('click', function () {
                background['send']('reload');
            }, ![]), document['getElementById']('donation')['addEventListener']('click', function () {
                background['send']('donation');
            }, ![]), document['getElementById']('default')['addEventListener']('click', function (c) {
                let d = window['confirm']('Are you sure you want to switch to the default useragent?');
                if (d)
                    config['handle']['click'](c);
            }, ![]), document['getElementById']('url')['addEventListener']('change', function (c) {
                config['useragent']['url'] = c['target']['value'] || 'all_urls', background['send']('useragent-url', config['useragent']['url']), c['target']['value'] = config['useragent']['url'];
            }, ![]), document['getElementById']('copy')['addEventListener']('click', function () {
                let c = config['useragent']['string'], d = window['prompt']('Edit this useragent string or copy the string to the clipboard (Ctrl+C+Enter)', config['useragent']['string']);
                if (d && d !== c) {
                    let e = config['useragent']['sanitize'](d);
                    background['send']('update-useragent-string', {
                        'UA': e,
                        'key': config['useragent']['key']
                    });
                }
            }, ![]), background['send']('load'), config['information']['listener'](), window['removeEventListener']('load', config['load'], ![]);
        },
        'handle': {
            'click': function (c) {
                if (c) {
                    if (c['target']) {
                        let d = {};
                        d['ua'] = [], d['target'] = c['target'], d['id'] = d['target']['getAttribute']('id'), d['table'] = d['target']['closest']('table'), d['category'] = d['table']['getAttribute']('id'), d['tds'] = [...document['getElementsByTagName']('td')];
                        let f = document['getElementById']('mobile-browsers'), g = document['getElementById']('desktop-browsers'), h = document['getElementById']('operating-systems');
                        if (d['table']) {
                            config['clean']['table'](d['table']);
                            d['category'] === 'mobile-browsers' ? (config['clean']['table'](g), config['clean']['table'](h)) : config['clean']['table'](f);
                            d['id'] && (d['id'] === 'default' ? (d['ua'] = [
                                '',
                                '',
                                'default'
                            ], config['clean']['table'](f), config['clean']['table'](g), config['clean']['table'](h)) : d['target']['setAttribute']('type', 'selected'));
                            if (d['tds'] && d['tds']['length'])
                                for (let j = 0; j < d['tds']['length']; j++) {
                                    let k = d['tds'][j]['getAttribute']('type');
                                    if (k) {
                                        if (k === 'selected') {
                                            let l = d['tds'][j]['getAttribute']('id');
                                            if (l)
                                                d['ua']['push'](l);
                                        }
                                    }
                                }
                            d['ua']['length'] === 1 && (d['category'] === 'desktop-browsers' && (d['ua']['push']('windowsd'), document['getElementById']('windowsd')['setAttribute']('type', 'selected')), d['category'] === 'operating-systems' && (d['ua']['unshift']('chrome'), document['getElementById']('chrome')['setAttribute']('type', 'selected')));
                        }
                        d['ua']['length'] && config['interface']['update'](d['ua']);
                    }
                }
            }
        },
        'interface': {
            'init': function (c) {
                if (c['key'][2] && c['key'][2] === 'default')
                    config['interface']['render'](c, 'UserAgent: Default', ![]);
                else
                    c['string'] ? (config['useragent']['key'] = c['key'], config['useragent']['string'] = c['string'], config['interface']['render'](c, c['text'], !![])) : config['interface']['render'](c, 'UserAgent: Not Available', ![]);
            },
            'update': function (c) {
                if (c['length'] === 2) {
                    let d = document['getElementById'](c[0])['getAttribute']('title') || 'N/A', f = document['getElementById'](c[1])['getAttribute']('title') || 'N/A';
                    config['status']['text'] = 'UserAgent: ' + d + ' on ' + f;
                }
                if (c['length'] === 1)
                    config['status']['text'] = 'UserAgent: ' + document['getElementById'](c[0])['getAttribute']('title');
                else
                    c[3] === 'default' && (config['status']['text'] = 'UserAgent: Default');
                document['getElementById']('status-td')['textContent'] = config['status']['text'], background['send']('status-td-text', config['status']['text']), background['send']('useragent-id', {
                    'id': c,
                    'url': config['useragent']['url']
                });
            },
            'render': function (c, d, f) {
                config['status']['text'] = d;
                let g = document['getElementById']('mobile-browsers'), h = document['getElementById']('desktop-browsers'), i = document['getElementById']('operating-systems');
                config['clean']['table'](g), config['clean']['table'](h), config['clean']['table'](i);
                if (c['key'][0]) {
                    let j = document['getElementById'](c['key'][0]);
                    if (f && j)
                        j['setAttribute']('type', 'selected');
                    else
                        j && j['removeAttribute']('type');
                }
                if (c['key'][1]) {
                    let k = document['getElementById'](c['key'][1]);
                    if (f && k)
                        k['setAttribute']('type', 'selected');
                    else
                        k && k['removeAttribute']('type');
                }
                config['useragent']['url'] = c['url'], document['getElementById']('url')['value'] = c['url'], document['getElementById']('status-td')['textContent'] = config['status']['text'];
            }
        }
    };
window['addEventListener']('load', config['load'], ![]), background['receive']('storage', config['interface']['init']), background['connect'](chrome['runtime']['connect']({ 'name': 'popup' }));