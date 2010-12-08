/**
 * 
 */
goog.require('goog.net.XhrIo');
goog.provide('kemia.io.xhr');


/**
 * Retrieve JSON data using XhrIo's static send() method.
 *
 * @param {string} dataUrl The url to request.
 * @param {Function=} opt_callback Callback function for when request is
 *     complete.
 */
kemia.io.xhr.get = function(dataUrl, opt_callback) {
  goog.net.XhrIo.send(dataUrl, function(e) {
      var xhr = e.target;
      var obj = xhr.getResponseJson();
      opt_callback.apply( this, [obj]);
  });
}