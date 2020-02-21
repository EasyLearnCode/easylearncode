var tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      target: 'step-1',
      title: 'Mức độ',
      content: 'Đây là 10 level mà bạn có thể chơi.',
      placement: 'top'
    },
    {
      target: 'step-2',
      placement: 'left',
      title: 'Thay đổi nhân vật',
      content: 'Đây là phần mà bạn có thể thay đổi nhân vật đang chơi trong khung đường đi phía dưới.'
    },
    {
      target: 'blockly',
      placement: 'top',
      title: 'Thanh điều khiển bước đi',
      content: 'Các thanh tím này bạn có thể kéo thả vào khung trắng bên cạnh để điều khiển nhân vật đi tới đích.'
    },
    {
      target: 'svgMaze',
      placement: 'top',
      title: 'Khung đường đi.',
      content: 'Đây là phần thể hiện đường đi của nhân vật.'
    },
    {
      target: 'step-6',
      placement: 'bottom',
      title: 'Chạy thử',
      content: 'Bạn bấm vào nút đỏ để chạy thử thuật toán!'
    },
    {
      target: 'step-7',
      placement: 'bottom',
      title: 'Xem code',
      content: 'Đây là phần mà bạn có thể xem code python viết như thế nào để đi tới đích của nhân vật.'
    }
  ],
  showPrevButton: true,
  scrollTopMargin: 100,
  i18n: {
      nextBtn:'>>',
      prevBtn: '<<'
  }
},

/* ========== */
/* TOUR SETUP */
/* ========== */
addClickListener = function(el, fn) {
  if (el.addEventListener) {
    el.addEventListener('click', fn, false);
  }
  else {
    el.attachEvent('onclick', fn);
  }
},

init = function() {
  var startBtnId = 'startTourBtn',
      calloutId = 'startTourCallout',
      mgr = hopscotch.getCalloutManager(),
      state = hopscotch.getState();

  if (state && state.indexOf('hello-hopscotch:') === 0) {
    // Already started the tour at some point!
    hopscotch.startTour(tour);
  }
  else {
    // Looking at the page for the first(?) time.
    setTimeout(function() {
      mgr.createCallout({
        id: calloutId,
        target: startBtnId,
        placement: 'bottom',
        title: 'Xin chào các bạn',
        content: 'Hãy click vào đây để xem hướng dẫn!',
        yOffset: -25,
        arrowOffset: 20,
        width: 180
      });
    }, 100);
  }

  addClickListener(document.getElementById(startBtnId), function() {
    if (!hopscotch.isActive) {
      mgr.removeAllCallouts();
      hopscotch.startTour(tour);
    }
  });
};
init();