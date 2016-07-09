/**
 *  Main controller JS file for the webpages.
 */
$(document).ready(function() {
  var diagnostics = 'Screen dimensions: ' + screen.height + ' x ' + screen.width + '<br/>Viewport dimensions: ' + $(document).height() + ' x ' + $(document).width();
  $('#diagnostics').html(diagnostics);

  // target elements with the "draggable" class
  interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // enable autoScroll
      autoScroll: true,

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