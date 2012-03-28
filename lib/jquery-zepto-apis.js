(function($) {

  // Used by colorslider.js
  ['width', 'height'].forEach(function(dimension) {
    var offset, Dimension = dimension.replace(/./, function(m) { return m[0].toUpperCase() });
    $.fn['outer' + Dimension] = function(margin) {
      var elem = this;
      if (elem) {
        var size = elem[dimension]();
        var sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
        sides[dimension].forEach(function(side) {
          if (margin) size += parseInt(elem.css('margin-' + side), 10);
        });
        return size;
      } else {
        return null;
      }
    };
  });

  // Used by bootstrap
  $.proxy = function( fn, context ) {
    if ( typeof context === "string" ) {
      var tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !$.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    var args = Array.prototype.slice.call( arguments, 2 ),
      proxy = function() {
        return fn.apply( context, args.concat( Array.prototype.slice.call( arguments ) ) );
      };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || proxy.guid || $.guid++;

    return proxy;
  };

  var rroot = /^(?:body|html)$/i;

  $.fn.position = function() {
    if ( !this[0] ) {
      return null;
    }

    var elem = this[0],

    // Get *real* offsetParent
    offsetParent = this.offsetParent(),
    // Get correct offsets
    offset       = this.offset(),
    parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    // Subtract element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    offset.top  -= parseFloat( $(elem).css("margin-top") ) || 0;
    offset.left -= parseFloat( $(elem).css("margin-left") ) || 0;

    // Add offsetParent borders
    parentOffset.top  += parseFloat( $(offsetParent[0]).css("border-top-width") ) || 0;
    parentOffset.left += parseFloat( $(offsetParent[0]).css("border-left-width") ) || 0;

    // Subtract the two offsets
    return {
      top:  offset.top  - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  };

  $.fn.offsetParent = function() {
    var ret = $();
    this.each(function(){
      var offsetParent = this.offsetParent || document.body;
      while ( offsetParent && (!rroot.test(offsetParent.nodeName) && $(offsetParent).css("position") === "static") ) {
        offsetParent = offsetParent.offsetParent;
      }
      ret.push(offsetParent);
    });
    return ret;
  };

})(this.Zepto);
