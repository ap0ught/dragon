;(function ($) {

  var $win = $(window);
  var $doc = $(document);

  /**
   * Options:
   *
   *   @param {boolean} noCursor Prevents the drag cursor from being "move"
   */
  $.fn.dragon = function (opts) {
    initDragonEls(this, opts || {});
  };

  // CONSTANTS
  $.extend($.fn.dragon, {
    'AXIS_X': 'x'
    ,'AXIS_Y': 'y'
  });

  function initDragonEls ($els, opts) {
    opts.axis = opts.axis || {};
    $els.attr('draggable', 'true');
    $els.on('dragstart', preventDefault);

    if (!opts.noCursor) {
      $els.css('cursor', 'move');
    }

    $els.each(function (i, el) {
      var $el = $(el);
      var position = $el.position();
      var top = position.top;
      var left = position.left;

      $el
        .css({
          'top': top
          ,'left': left
          ,'position': 'absolute'
        })
        .data('dragon', {})
        .data('dragon-opts', opts)
        .on('mousedown', $.proxy(onMouseDown, $el))
        .on('dragon-dragstart', $.proxy(opts.onDragStart || $.noop, $el))
        .on('dragon-drag', $.proxy(opts.onDrag || $.noop, $el))
        .on('dragon-dragend', $.proxy(opts.onDragEnd || $.noop, $el));
    });
  }

  function onMouseDown (evt) {
    var data = this.data('dragon');
    var wasAlreadyDragging = data.isDragging;
    var onMouseUpInstance = $.proxy(onMouseUp, this);
    var onMouseMoveInstance = $.proxy(onMouseMove, this);
    var initialPosition = this.position();
    this.data('dragon', {
      'onMouseUp': onMouseUpInstance
      ,'onMouseMove': onMouseMoveInstance
      ,'isDragging': true
      ,'left': initialPosition.left
      ,'top': initialPosition.top
      ,'grabPointX': initialPosition.left - evt.pageX
      ,'grabPointY': initialPosition.top - evt.pageY
    });

    $win
      .on('mouseup', onMouseUpInstance)
      .on('blur', onMouseUpInstance)
      .on('mousemove', onMouseMoveInstance);

    $doc.on('selectstart', preventSelect);
    this.trigger('dragon-dragstart');
  }

  function onMouseUp (evt) {
    var data = this.data('dragon');
    data.isDragging = false;
    $win.off('mouseup', data.onMouseUp);
    $win.off('blur', data.onMouseUp);
    $win.off('mousemove', data.onMouseMove);
    $doc.off('selectstart', preventSelect);
    delete data.onMouseUp;
    delete data.onMouseMove;
    this.trigger('dragon-dragend');
  }

  function onMouseMove (evt) {
    var data = this.data('dragon');
    var opts = this.data('dragon-opts');
    var newCoords = {};

    if (opts.axis !== $.fn.dragon.AXIS_X) {
      newCoords.top = evt.pageY + data.grabPointY;
    }

    if (opts.axis !== $.fn.dragon.AXIS_Y) {
      newCoords.left = evt.pageX + data.grabPointX;
    }

    this.css(newCoords);
    this.trigger('dragon-drag');
  }

  // This event handler fixes some craziness with the startselect event breaking
  // the cursor CSS setting.
  // http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag
  function preventSelect(evt) {
    preventDefault(evt);
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.clear();
    }
  }

  function preventDefault (evt) {
    evt.preventDefault();
  }

} (jQuery));
