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

  $(window).on("orientationchange", function(data) {
    window.socket.emit('flip', {
      orientation: data.orientation,
      session_id: window.session_id,
      phone_id: window.phone_id,
    })
  });

  // ----------------------------- SOCKET ----------------------------------
  window.socket = io();
  // -----------------------------------------------------------------------

  window.socket.on('play_video', function(data) {
    console.log('EVERYONE IS READY!!!!!');
    window.player.playVideo();
  });

  window.socket.on('reload', function () {
    window.location.reload();
  });

  window.socket.on('wait_on_video', function(data) {
    window.player.pauseVideo();
  });

  $('#player').css({
    left: window.anchor.x,
    top: window.anchor.y,
  });

  // 2. This code loads the IFrame Player API code asynchronously.
  // var tag = document.createElement('script');

  // tag.src = "https://www.youtube.com/iframe_api";
  // var firstScriptTag = document.getElementsByTagName('script')[0];
  // console.log(firstScriptTag);
  // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  // $(document).append()

  var player;
  window.onYouTubeIframeAPIReady = function() {
    console.log('triggered');
    player = new YT.Player('player', {
      height: String(window.global_height),
      width: String(window.global_width),
      controls: 0,
      playerVars: {
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0
      },
      videoId: 'bzD8H6o1awQ',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    if (!window.READY) {
      // event.target.playVideo();
      window.player = event.target;
      console.log('I am ready to play');
      window.player.playVideo();
      window.READY = true;
    }
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  // var done = false;
  function onPlayerStateChange(event) {
    var state = event.data;
    console.log(state);
    if (state == 3) {
      window.buffering = true;
    } else if (state == 1) {
      if (window.buffering == true) {
        window.buffering = false;
        window.player.pauseVideo();
        window.socket.emit('video_ready', {
          session_id: window.session_id,
          phone_id: window.phone_id,
        });
      }
    }
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000);
    //   done = true;
    // }
  }

  function stopVideo() {
    player.stopVideo();
  }
});