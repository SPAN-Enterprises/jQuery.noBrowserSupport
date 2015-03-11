$(function () {
    var browserInfo = get_browser_info();
    var bName = $.trim(browserInfo.name.toLowerCase());
    var bVersion = $.trim(browserInfo.version);
    var browserSupported = true;
    
    if (bName === "chrome" && parseInt(bVersion) < 42) {
        browserSupported = false;
    }
    else if (bName === "ie" && parseInt(bVersion) < 9) {
        browserSupported = false;
    }
    else if (bName === "firefox" && parseInt(bVersion) < 29) {
        browserSupported = false;
    }
    else if (bName === "safari" && parseInt(bVersion) < 5) {
        browserSupported = false;
    }
    if (!browserSupported) {
        rewrite_doc_browser_not_support();
    }
});

function get_browser_info() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE ', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

function rewrite_doc_browser_not_support() {
    $('head').append('<link rel="stylesheet" type="text/css" href="http://plugins.spanenterprises.com/content/se.browsersupport.plugin.css">');

    var noSupportHtml = '<div id="no-bSupport-center-wrap"><div id="no-bSupport-center"><div class="no-bSupport-Logo"><img id="no-bSupport-img" src="/Content/Images/anonymous.png" /></div></div></div>';
    noSupportHtml += '<div class="no-bSupport-clear"></div><div id="no-bSupport-content">';
    noSupportHtml += '<div class="no-bSupport-clear no-bSupport-taC no-bSupport-titleText">OOPS!</div>';
    noSupportHtml += '<div class="no-bSupport-clear no-bSupport-taC no-bSupport-titleText">YOUR BROWSER IS NOT SUPPORTED!</div>';
    noSupportHtml += '<div class="no-bSupport-clear no-bSupport-taC no-bSupport-detText">Don\'t worry, there is an easy fix. Try upgrading to any of the following versions:</div>';
    noSupportHtml += '<div class="no-bSupport-clear no-bSupport-taC no-bSupport-iconText"><a href="https://www.google.com/intl/en/chrome/browser/desktop/index.html" target="_blank"><img src="http://plugins.spanenterprises.com/Content/Images/bSupport/chrome.png" /></a> <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank"><img src="http://plugins.spanenterprises.com/Content/Images/bSupport/firefox.png" /></a> <a href="https://support.apple.com/kb/dl1531" target="_blank"><img src="http://plugins.spanenterprises.com/Content/Images/bSupport/safari.png" /></a> <a href="http://windows.microsoft.com/en-us/internet-explorer/download-ie" target="_blank"><img src="http://plugins.spanenterprises.com/Content/Images/bSupport/ie.png" /></a></div>';
    noSupportHtml += '</div>';
    
    document.body.innerHTML = noSupportHtml;

    var scripts = document.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];
    // myScript now contains our script object
    var queryString = myScript.src.replace(/^[^\?]+\??/, '');
    var qs = bSupportParseQuery(queryString);
    if (qs["logo"] != null && qs["logo"] != '') {
        $("#no-bSupport-img").attr("src", qs["logo"]);
    }
}

function bSupportParseQuery(query) {
    var Params = new Object();
    if (!query) return Params; // return empty object
    var Pairs = query.split(/[;&]/);
    for (var i = 0; i < Pairs.length; i++) {
        var KeyVal = Pairs[i].split('=');
        if (!KeyVal || KeyVal.length != 2) continue;
        var key = unescape(KeyVal[0]);
        var val = unescape(KeyVal[1]);
        val = val.replace(/\+/g, ' ');
        Params[key] = val;
    }
    return Params;
}