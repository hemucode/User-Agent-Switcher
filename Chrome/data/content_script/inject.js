var background = (function () {
        let c = {};
        return chrome['runtime']['onMessage']['addListener'](function (d) {
            for (let e in c) {
                c[e] && typeof c[e] === 'function' && (d['path'] === 'background-to-page' && (d['method'] === e && c[e](d['data'])));
            }
        }), {
            'receive': function (d, e) {
                c[d] = e;
            },
            'send': function (d, e) {
                chrome['runtime']['sendMessage']({
                    'method': d,
                    'data': e,
                    'path': 'page-to-background'
                }, function () {
                    return chrome['runtime']['lastError'];
                });
            }
        };
    }()), config = {
        'render': function (c) {
            const d = c['top'], f = c['useragent'], g = c['url']['replace'](/\s+/g, '')['split'](',');
            f && (config['domain']['is']['valid'](d, g) && localStorage['setItem']('useragent-switcher-uastring', f));
        },
        'domain': {
            'extract': function (c) {
                c = c['replace']('www.', '')['trim']();
                let d = c['indexOf']('//') + 2;
                if (d > 1) {
                    let e = c['indexOf']('/', d);
                    return e > 0 ? c['substring'](d, e) : (e = c['indexOf']('?', d), e > 0 ? c['substring'](d, e) : c['substring'](d));
                } else
                    return c;
            },
            'is': {
                'valid': function (c, d) {
                    if (!c)
                        return !![];
                    c = config['domain']['extract'](c);
                    if (d['indexOf']('*') !== -1)
                        return !![];
                    if (d['indexOf']('all_urls') !== -1)
                        return !![];
                    for (let e = 0; e < d['length']; e++) {
                        let f = d[e];
                        if (f === c)
                            return !![];
                        else {
                            if (c['indexOf'](f) !== -1)
                                return !![];
                        }
                    }
                    return ![];
                }
            }
        }
    };
background['send']('load'), background['receive']('storage', config['render']);