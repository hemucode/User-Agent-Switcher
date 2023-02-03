var config = {};
config['test'] = { 'page': 'https://www.downloadhub.cloud/2023/01/what-is-my-user-assign-this-time.html' }, config['badge'] = {
    set 'icon'(c) {
        app['storage']['write']('badge-icon', c);
    },
    get 'icon'() {
        return app['storage']['read']('badge-icon') !== undefined ? app['storage']['read']('badge-icon') : '';
    }
}, config['welcome'] = {
    set 'lastupdate'(c) {
        app['storage']['write']('lastupdate', c);
    },
    get 'lastupdate'() {
        return app['storage']['read']('lastupdate') !== undefined ? app['storage']['read']('lastupdate') : 0;
    }
}, config['contentscripts'] = {
    'filters': [
        {
            'allFrames': !![],
            'world': 'ISOLATED',
            'matches': ['*://*/*'],
            'runAt': 'document_start',
            'js': ['data/content_script/inject.js'],
            'id': 'useragent-switcher-contentscript-isolated'
        },
        {
            'world': 'MAIN',
            'allFrames': !![],
            'matches': ['*://*/*'],
            'runAt': 'document_start',
            'id': 'useragent-switcher-contentscript-main',
            'js': ['data/content_script/page_context/inject.js']
        }
    ]
}, config['useragent'] = {
    set 'url'(c) {
        app['storage']['write']('user-agent-url', c);
    },
    set 'text'(c) {
        app['storage']['write']('user-agent-text', c);
    },
    set 'string'(c) {
        app['storage']['write']('user-agent-string', c);
    },
    set 'key'(c) {
        app['storage']['write']('user-agent-key', JSON['stringify'](c));
    },
    set 'obj'(c) {
        app['storage']['write']('user-agent-object', JSON['stringify'](c));
    },
    set 'global'(c) {
        app['storage']['write']('user-agent-global', JSON['stringify'](c));
    },
    get 'key'() {
        return JSON['parse'](app['storage']['read']('user-agent-key') || '["", "", "default"]');
    },
    get 'url'() {
        return app['storage']['read']('user-agent-url') !== undefined ? app['storage']['read']('user-agent-url') : 'all_urls';
    },
    get 'string'() {
        return app['storage']['read']('user-agent-string') !== undefined ? app['storage']['read']('user-agent-string') : '';
    },
    get 'text'() {
        return app['storage']['read']('user-agent-text') !== undefined ? app['storage']['read']('user-agent-text') : 'User-Agent: Default';
    },
    get 'obj'() {
        return app['storage']['read']('user-agent-object') !== undefined ? JSON['parse'](app['storage']['read']('user-agent-object')) : config['default']['ua']['object'];
    },
    get 'global'() {
        return app['storage']['read']('user-agent-global') !== undefined ? JSON['parse'](app['storage']['read']('user-agent-global')) : {};
    }
}, config['domain'] = {
    'cleanup': function (c) {
        var d = c['replace'](/\s+/g, '')['split'](',')['map'](f => config['domain']['extract'](f))['filter'](f => f);
        d && d['length'] && (d['indexOf']('*') !== -1 || d['indexOf']('all_urls') !== -1 ? config['useragent']['url'] = 'all_urls' : config['useragent']['url'] = d['join'](', '));
    },
    'extract': function (c) {
        c = c['replace']('www.', '')['trim']();
        var d = c['indexOf']('//') + 2;
        if (d > 1) {
            var e = c['indexOf']('/', d);
            return e > 0 ? c['substring'](d, e) : (e = c['indexOf']('?', d), e > 0 ? c['substring'](d, e) : c['substring'](d));
        } else
            return c;
    }
}, config['default'] = {
    'ua': {
        'object': {
            'ios': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1',
            'android': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.105 Mobile Safari/537.36',
            'windowsp': 'Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; WebView/2.0; rv:11.0; IEMobile/11.0; NOKIA; Lumia 525) like Gecko',
            'tizen': 'Mozilla/5.0 (Linux; U; Tizen 2.0; en-us) AppleWebKit/537.1 (KHTML, like Gecko) Mobile TizenBrowser/2.0',
            'symbian': 'Nokia5250/10.0.011 (SymbianOS/9.4; U; Series60/5.0 Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML, like Gecko) Safari/525 3gpp-gba',
            'firefoxos': 'Mozilla/5.0 (Android 6.0.1; Mobile; rv:43.0) Gecko/43.0 Firefox/43.0',
            'chrome': {
                'windowsd': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'chromeOS': 'Mozilla/5.0 (X11; CrOS x86_64 15117.111.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.110 Safari/537.36',
                'ibm': '',
                'freebsd': 'Mozilla/5.0 (X11; U; FreeBSD amd64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
            },
            'opera': {
                'windowsd': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36 OPR/48.0.2685.52',
                'mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36 OPR/47.0.2631.55',
                'linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.49 Safari/537.36 OPR/48.0.2685.7',
                'chromeOS': '',
                'ibm': '',
                'freebsd': 'Mozilla/5.0 (X11; U; FreeBSD i386; zh-tw; rv:31.0) Gecko/20100101 Opera/13.0'
            },
            'firefox': {
                'windowsd': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0',
                'mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:56.0) Gecko/20100101 Firefox/56.0',
                'linux': 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0',
                'chromeOS': 'Mozilla/5.0 (X11; U; CrOS i686 9.10.0; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Gecko/20100101 Firefox/29.0',
                'ibm': 'Mozilla/5.0 (OS/2; U; Warp 4.5; en-US; rv:1.7.12) Gecko/20050922 Firefox/1.0.7',
                'freebsd': 'Mozilla/5.0 (X11; FreeBSD amd64; rv:40.0) Gecko/20100101 Firefox/40.0'
            },
            'safari': {
                'windowsd': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27',
                'mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5',
                'linux': 'Mozilla/5.0 (X11; U; Linux x86_64; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/531.2',
                'chromeOS': '',
                'ibm': '',
                'freebsd': ''
            },
            'explorer': {
                'windowsd': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
                'mac': '',
                'linux': '',
                'chromeOS': '',
                'ibm': '',
                'freebsd': ''
            },
            'edge': {
                'windowsd': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
                'mac': '',
                'linux': '',
                'chromeOS': '',
                'ibm': '',
                'freebsd': ''
            }
        }
    }
};