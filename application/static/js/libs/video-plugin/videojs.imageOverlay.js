/*
 *  Copyright (c) 2013 Funny or Die, Inc.
 *  http://www.funnyordie.com
 *  https://github.com/funnyordie/videojs-imageOverlay/blob/master/LICENSE
 */

(function(vjs) {
  var
  extend = function(obj) {
    var arg, i, k;
    for (i = 1; i < arguments.length; i++) {
      arg = arguments[i];
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          obj[k] = arg[k];
        }
      }
    }
    return obj;
  },

  defaults = {
      image_url: '',
      click_url: '',
      start_time: null,
      end_time: null,
      opacity: 1,
      height: '15%',
      width: '100%',
      content: '<h2>Bạn hãy thử viết một đoạn code hiển thị dòng chữ "chào thế giới"?<h2>'
  },

  imageOverlay = function(options) {
    var player = this,
        settings = extend({}, defaults, options || {}),
        showingImage = false;

    if (settings.start_time === null)
      settings.start_time = 0;

    if (settings.end_time === null)
      settings.end_time = player.duration() + 1;

    overlay = {
      checkOverlay: function() {
        if ((player.currentTime() >= settings.start_time) && (player.currentTime() < settings.end_time)) {
          overlay.showImage();
        } else {
          overlay.hideImage();
        }
      },
      showImage: function() {
        if (showingImage) {
          return;
        }
        showingImage = true;
        player.pause();
        var holderDiv = document.createElement('div');
        holderDiv.id = 'vjs-image-overlay-holder';
        var html = '<div class="panel panel-default">';
          html+='<div class="panel-heading">Câu hỏi :D</div>';
          html+='<div class="panel-body" id="Question-cont">';
          html+=settings.content;
          html+='<button type="button" onclick="btnOk()" class="btn btn-primary">OK</button>'
          html+='</div>';
          html+='</div>';
//        holderDiv.style.height = settings.height;
//        holderDiv.style.width = settings.width;
//
//        var overlayImage = document.createElement('img');
//        overlayImage.src = settings.image_url;
//        overlayImage.onclick = function() {
//          player.pause();
//          window.open(settings.click_url);
//        };
//        overlayImage.style.opacity = settings.opacity;
        holderDiv.innerHTML = html;
        //holderDiv.appendChild(overlayImage);
        player.el().appendChild(holderDiv);
      },
      hideImage: function() {
        if (!showingImage) {
          return;
        }
        showingImage = false;
        player.play();
        player.el().removeChild(document.getElementById('vjs-image-overlay-holder'));
      }
    };
  };

  showQuestion = function()
  {
      overlay.showImage();
  }

  hideQuestion = function()
  {
      overlay.showImage();
  }

  vjs.plugin('imageOverlay', imageOverlay);
}(window.videojs));
