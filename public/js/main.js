/**
 *  Main controller JS file for the webpages.
 */
$(document).ready(function() {
  var diagnostics = 'Screen dimensions: ' + screen.height + ' x ' + screen.width + '<br/>Viewport dimensions: ' + $(document).height() + ' x ' + $(document).width();
  $('#diagnostics').html(diagnostics);

  // lock in screen size to device display size
  $('#container').css({
    height: screen.height,
    width: screen.width,
    overlow: 'hidden',
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
        elementRect: { top: (-1 * ITEM_HEIGHT), left: (- 1* ITEM_WIDTH), bottom: ITEM_HEIGHT, right: ITEM_WIDTH }
      },
      // enable autoScroll
      autoScroll: true,
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

    textEl && (textEl.textContent = 'Anchored at ' + item.left + ', ' + item.top)
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
});