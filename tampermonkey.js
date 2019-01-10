// ==UserScript==
// @name         Happychat Site URL
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Shows site name
// @author       Senff
// @require      https://code.jquery.com/jquery-1.12.4.js
// @match        https://hud.happychat.io/*
// @grant        none
// ==/UserScript==

var $ = window.jQuery;

function showSite() {

    var $currentSession = $('.ReactVirtualized__Grid__innerScrollContainer > div:last-child .chat__message__type-customer-info');
    var $currentSiteLink = $currentSession.find('.chat__message__link').attr('href');

    if (typeof $currentSiteLink != 'undefined') {
        var currentSiteDomain= $currentSiteLink.replace("http://", "");
        currentSiteDomain= currentSiteDomain.replace("https://", "");
        var siteLink = 'Site I need help with: <a href="'+$currentSiteLink+'" target="_blank" style="text-decoration: underline;">'+$currentSiteLink+'</a> <div style="width:0; height: 0; overflow:hidden; display:inline-block;"><input type="text" id="copyTarget" value="'+currentSiteDomain+'"></div> <a class="button" href="#" id="copyButton">COPY DOMAIN</a>';
    } else {
        siteLink = 'Site I need help with: N/A';
    }

    if($('.chatting_about').length<1) {
        $('.chat-info__details').append('<div class="chatting_about">'+siteLink+'</div>');
    } else {
        $('.chatting_about').html(siteLink);
    }
}

$("body").on('DOMSubtreeModified', ".ReactVirtualized__Grid__innerScrollContainer", function() {
    showSite();
});

$("body").on('click','#copyButton', function () {
    copyToClipboard(document.getElementById("copyTarget"));
});

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

window.setInterval(function(){
  showSite();
}, 2500);
