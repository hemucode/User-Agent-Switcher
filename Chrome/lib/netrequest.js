app['netrequest'] = {
    'display': {
        'badge': {
            'text': async function (c) {
                if (chrome['declarativeNetRequest']) {
                    var d = c !== undefined ? c : !![];
                    await chrome['declarativeNetRequest']['setExtensionActionOptions']({ 'displayActionCountAsBadgeText': d });
                }
            }
        }
    },
    'engine': {
        'rulesets': {
            'update': function (c) {
                return new Promise((d, e) => {
                    app['storage']['load'](function () {
                        chrome['declarativeNetRequest'] && chrome['declarativeNetRequest']['updateEnabledRulesets'](c)['then'](d)['catch'](e);
                    });
                });
            }
        },
        'rules': {
            'get': function () {
                return new Promise((c, d) => {
                    app['storage']['load'](function () {
                        chrome['declarativeNetRequest'] && (app['netrequest']['rules']['scope'] === 'dynamic' ? chrome['declarativeNetRequest']['getDynamicRules']()['then'](c)['catch'](d) : chrome['declarativeNetRequest']['getSessionRules']()['then'](c)['catch'](d));
                    });
                });
            },
            'update': function (c) {
                return new Promise((d, e) => {
                    app['storage']['load'](function () {
                        chrome['declarativeNetRequest'] && (app['netrequest']['rules']['scope'] === 'dynamic' ? chrome['declarativeNetRequest']['updateDynamicRules'](c)['then'](d)['catch'](e) : chrome['declarativeNetRequest']['updateSessionRules'](c)['then'](d)['catch'](e));
                    });
                });
            }
        }
    },
    'rules': {
        'stack': [],
        set 'scope'(c) {
            app['storage']['write']('rulescope', c);
        },
        get 'scope'() {
            return app['storage']['read']('rulescope') !== undefined ? app['storage']['read']('rulescope') : 'dynamic';
        },
        'update': async function () {
            let c = app['netrequest']['rules']['stack'];
            if (c && c['length']) {
                let d = c['map'](function (f) {
                    return f['id'];
                });
                d && d['length'] && await app['netrequest']['engine']['rules']['update']({
                    'addRules': c,
                    'removeRuleIds': d
                });
            }
        },
        'push': function (c) {
            if (c) {
                if (c['action'] && c['condition']) {
                    let d = c['id'] !== undefined ? c['id'] : app['netrequest']['rules']['find']['next']['available']['id']();
                    if (d) {
                        let f = app['netrequest']['rules']['stack']['filter'](g => g['id'] === d);
                        f && f['length'] === 0 && app['netrequest']['rules']['stack']['push']({
                            'id': d,
                            'action': c['action'],
                            'condition': c['condition'],
                            'priority': c['priority'] !== undefined ? c['priority'] : 1
                        });
                    }
                }
            }
        },
        'find': {
            'next': {
                'available': {
                    'id': function () {
                        let c = 1, d = app['netrequest']['rules']['stack'];
                        if (d && d['length']) {
                            let e = d['map'](function (f) {
                                return f['id'];
                            })['sort'](function (f, g) {
                                return f - g;
                            });
                            if (e && e['length'])
                                for (let f in e) {
                                    e[f] > -1 && e[f] === c && c++;
                                }
                        }
                        return c;
                    }
                }
            }
        },
        'remove': {
            'by': {
                'ids': async function (c) {
                    c && c['length'] && (await app['netrequest']['engine']['rules']['update']({ 'removeRuleIds': c }), app['netrequest']['rules']['stack'] = await app['netrequest']['engine']['rules']['get']());
                },
                'scope': async function (c) {
                    let d = [];
                    if (c === 'dynamic') {
                        let e = await chrome['declarativeNetRequest']['getDynamicRules']();
                        d = e['map'](function (f) {
                            return f['id'];
                        }), await chrome['declarativeNetRequest']['updateDynamicRules']({ 'removeRuleIds': d });
                    } else {
                        if (c === 'session') {
                            let f = await chrome['declarativeNetRequest']['getSessionRules']();
                            d = f['map'](function (g) {
                                return g['id'];
                            }), await chrome['declarativeNetRequest']['updateSessionRules']({ 'removeRuleIds': d });
                        }
                    }
                    app['netrequest']['rules']['stack'] = app['netrequest']['rules']['stack']['filter'](function (g) {
                        return d['indexOf'](g['id']) === -1;
                    });
                },
                'condition': {
                    'tabId': async function (c) {
                        if (c) {
                            let d = await app['netrequest']['engine']['rules']['get']();
                            if (d && d['length']) {
                                let e = d['filter'](function (f) {
                                    if (f) {
                                        if (f['condition']) {
                                            if (f['condition']['tabIds'][0] === c)
                                                return !![];
                                        }
                                    }
                                    return ![];
                                })['map'](function (f) {
                                    return f['id'];
                                });
                                await app['netrequest']['rules']['remove']['by']['ids'](e);
                            }
                        }
                    }
                },
                'action': {
                    'type': async function (c, d) {
                        if (c) {
                            let e = await app['netrequest']['engine']['rules']['get']();
                            if (e && e['length']) {
                                let f = e['filter'](function (g) {
                                    if (g) {
                                        if (g['action']) {
                                            if (g['action']['type'] === c) {
                                                if (d) {
                                                    if (d in g['action'])
                                                        return !![];
                                                } else
                                                    return !![];
                                            }
                                        }
                                    }
                                    return ![];
                                })['map'](function (g) {
                                    return g['id'];
                                });
                                await app['netrequest']['rules']['remove']['by']['ids'](f);
                            }
                        }
                    }
                }
            }
        }
    }
};