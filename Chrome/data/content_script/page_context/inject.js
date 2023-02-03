{
    const _useragent = navigator['userAgent'];
    Object['defineProperty'](navigator, 'userAgent', {
        'get': function () {
            const c = localStorage['getItem']('useragent-switcher-uastring');
            return c ? c : _useragent;
        }
    });
}