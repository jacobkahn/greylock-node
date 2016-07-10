/**
 *  Main controller JS file for the webpages.
 */
$(document).ready(function() {
  var diagnostics = 'Screen dimensions: ' + screen.height + ' x ' + screen.width + '<br/>Viewport dimensions: ' + $(document).height() + ' x ' + $(document).width();
  $('#diagnostics').html(diagnostics);

  // lock in screen size to device display size
  $('body').css({
    height: screen.height,
    width: screen.width,
    overlow: 'hidden',
  });
  $('#container').css({
    height: screen.height,
    width: screen.width,
    overlow: 'hidden',
  });

  $('body').on({
    'mousewheel': function(e) {
      if (e.target.id == 'el') return;
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // add focus to the item
  $('.info').text('Locally anchored at 0, 0').focus();

  if (window.isFirst == 0) {
    $('#item').hide();
  }

  // ----------------------------- SOCKET ----------------------------------
  window.socket = io();
  // -----------------------------------------------------------------------


  window.socket.on('item_draw', function(data) {
    // TODO: change this to filter only information relevant to this client
    var anchor = data[window.phone_id].anchor;
    console.log(anchor);
    $('#item').css({
      display: 'block',
      transform: `(${anchor.x}px, ${anchor.y}px)`
    });
    $('.info').text('Locally anchored at ' + anchor.x + ', ' + anchor.y);
  });

  var ITEM_WIDTH = $('.item').css('width');
  var ITEM_HEIGHT = $('.item').css('height');

  // target elements with the "draggable" class
  interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: true,
      restrict: {
        restriction: 'parent',
        elementRect: {
          top: (-1 * ITEM_HEIGHT),
          left: (-1 * ITEM_WIDTH),
          bottom: 0,
          right: 0
        }
      },
      snap: false,

      // call this function on every dragmove event
      onmove: dragMoveListener,
    });

  function dragMoveListener(event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // ------------------ render diagnostic information ------------------

    var textEl = event.target.querySelector('p');

    // textEl && (textEl.textContent =
    //   'moved a distance of ' + (Math.sqrt(event.dx * event.dx +
    //     event.dy * event.dy) | 0) + 'px');

    var item = interact.getElementRect(event.target);

    textEl && (textEl.textContent = 'Locally anchored at ' + item.left + ', ' + item.top)

    console.log(window.session_id, window.phone_id);

    window.socket.emit('item_move', {
      anchor: {
        x: item.left,
        y: item.top,
      },
      session_id: window.session_id,
      phone_id: window.phone_id,
    });

    // draw fancy shit

    for (var i = 0; i < window.magic.touches.length; i++) {

      var touch = window.magic.touches[i];
      var max = Math.round(Math.random() * 4);
      for (var j = 0; j < max; j++) {
        window.magic.spawn(event.pageX, event.pageY - 50);
      };
    }
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
});