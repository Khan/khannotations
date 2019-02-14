/**
 * Return true if we are using IE 11 or below.
 *
 * Returns false if we are Edge, or any other browser.
 */
export default function isIE(): boolean {
    var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    var msie = ua.indexOf("MSIE "); // IE 10 or older
    var trident = ua.indexOf("Trident/"); //IE 11

    return msie > 0 || trident > 0;
}
