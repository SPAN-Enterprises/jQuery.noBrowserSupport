function fn_no_browser_support(args) {
    var defaultSettings = {
        // These are the defaults.
        logo: "",
        chrome: 35,
        firefox: 29,
        safari: 5,
        ie: 9,
        ubrowser: 4
    };
    var settings = nbs_merge_options(defaultSettings, args);

    var browserInfo = get_browser_info();
    var bName = browserInfo.name.toLowerCase().replace(/^\s+|\s+$/g, "");
    var bVersion = browserInfo.version.replace(/^\s+|\s+$/g, "");
    var browserSupported = true;
	var isnbsMobileBrowser = fnisnbsMobileBrowser();
	
	if(isnbsMobileBrowser == true){
		browserSupported = true
	}
	else{
		if (bName === "chrome" && parseInt(bVersion) < parseInt(settings.chrome)) {
			browserSupported = false;
		}
		else if ((bName === "ie" || bName === "msie") && parseInt(bVersion) < parseInt(settings.ie)) {
			browserSupported = false;
		}
		else if (bName === "firefox" && parseInt(bVersion) < parseInt(settings.firefox)) {
			browserSupported = false;
		}
		else if (bName === "safari" && parseInt(bVersion) < parseInt(settings.safari)) {
			browserSupported = false;
		}
		else if (bName === "ubrowser" && parseInt(bVersion) < parseInt(settings.ubrowser)) {
			browserSupported = false;
		}
	}
    if (!browserSupported) {
        rewrite_doc_browser_not_support(settings);
    }
}

/**
 * Overwrites mergeTarget's values with mergeSource's and adds mergeSource's if non existent in mergeTarget
 * @param mergeTarget
 * @param mergeSource
 * @returns mergeResult a new object based on mergeTarget and mergeSource
 */
function nbs_merge_options(mergeTarget, mergeSource) {
    var mergeResult = {};
    for (var attrname in mergeTarget) { mergeResult[attrname] = mergeTarget[attrname]; }
    for (var attrname in mergeSource) { mergeResult[attrname] = mergeSource[attrname]; }
    return mergeResult;
}

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
	if (ua.indexOf("UBrowser") > 0) {
            M = ua.match(/(opera|ubrowser|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	}
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

function rewrite_doc_browser_not_support(settings) {
    var scripts = document.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];

    var bSupportKeyword = "jQuery.noBrowserSupport.js";

    myScript = getnbsScriptPath(bSupportKeyword);

    var bSupportScriptUrl = myScript.src.toLowerCase();
    var bSupportBaseUrl = bSupportScriptUrl.substr(0, bSupportScriptUrl.indexOf(bSupportKeyword.toLowerCase())).toLowerCase().replace("scripts/", "");
    var link = document.createElement("link")
    link.setAttribute("rel", "stylesheet")
    link.setAttribute("type", "text/css")
    link.setAttribute("href", bSupportBaseUrl + 'Content/jQuery.noBrowserSupport.css');

    document.getElementsByTagName('head')[0].appendChild(link);
    //$('head').append('<link rel="stylesheet" type="text/css" href="' + bSupportBaseUrl + 'Content/jQuery.noBrowserSupport.css">');

    var noSupportHtml = '<div id="no-bSupport-center-wrap"><div id="no-bSupport-center">';
    if (settings.logo != '') {
        noSupportHtml += '<div class="no-bSupport-Logo"><img id="no-bSupport-img" src="' + settings.logo + '" /></div>';
    }
    noSupportHtml += '</div></div><div class="no-bSupport-clear"></div><div id="no-bSupport-content"><div class="no-bSupport-clear no-bSupport-taC no-bSupport-titleText"><span>OOPS!</span></div><div class="no-bSupport-clear no-bSupport-taC no-bSupport-titleText">YOUR BROWSER IS NOT SUPPORTED!</div><div class="no-bSupport-clear no-bSupport-taC no-bSupport-detText">Don\'t worry, there is an easy fix. Try upgrading to any of the following versions:</div><div class="no-bSupport-clear no-bSupport-taC no-bSupport-iconText"><a class="ieIcon" href="https://www.google.com/intl/en/chrome/browser/desktop/index.html" target="_blank"><img src="' + bSupportBaseUrl + 'Content/images/bSupport/chromeIcon.png" /><br/>Chrome ' + settings.chrome + '+ </a><a class="ieIcon" href="https://www.mozilla.org/en-US/firefox/new/" target="_blank"><img src="' + bSupportBaseUrl + 'Content/images/bSupport/firefoxIcon.png" /><br/>Firefox ' + settings.firefox + '+ </a> <a class="ieIcon" href="https://support.apple.com/kb/dl1531" target="_blank"><img src="' + bSupportBaseUrl + 'Content/images/bSupport/safariIcon.png" /><br/>Safari ' + settings.safari + '+ </a> <a class="ieIcon" href="http://windows.microsoft.com/en-us/internet-explorer/download-ie" target="_blank"><img src="' + bSupportBaseUrl + 'Content/images/bSupport/ieIcon.png" /><br/>Internet Explorer ' + settings.ie + '+ </a><div class="clear"></div></div></div>';
    document.body.innerHTML = noSupportHtml;
}

function getnbsScriptPath(bSupportKeyword) {
    var nbsScript = null;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
        if (isnbsScript(scripts[i], bSupportKeyword)) {
            nbsScript = scripts[i];
        }
    }
    return nbsScript;
}

function isnbsScript(scriptElem, bSupportKeyword) {
    if (scriptElem.getAttribute('src') != null && scriptElem.getAttribute('src') != '') {
        return scriptElem.getAttribute('src').toLowerCase().indexOf(bSupportKeyword.toLowerCase()) != -1;
    }
    else {
        return false;
    }
}

function fnisnbsMobileBrowser()
{
   var isnbsMobile = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))isnbsMobile = true})(navigator.userAgent||navigator.vendor||window.opera);
  return isnbsMobile;
}

(function (funcName, baseObj) {
    // The public function name defaults to window.noBrowserSupportReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "noBrowserSupportReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the noBrowserSupportReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if (document.readyState === "complete") {
            ready();
        }
    }

    // This is the one public interface
    // noBrowserSupportReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function (callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function () { callback(context); }, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({ fn: callback, ctx: context });
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("noBrowserSupportReady", window);
