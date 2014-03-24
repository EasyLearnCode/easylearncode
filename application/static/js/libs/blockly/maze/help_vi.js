var tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      target: 'step-1',
      title: 'Mức độ',
      content: 'Đây là nơi hiển thị mức độ bạn đã vượt qua trong mỗi vòng.',
      placement: 'bottom'
    },
    {
      target: 'step-2',
      placement: 'top',
      title: 'Câu hỏi',
      content: 'Đây là phần thay đổi con vật bạn đang chơi.'
    },
    {
      target: 'step-3',
      placement: 'bottom',
      title: 'Thanh tím',
      content: 'Các thanh tím này để bạn kéo thả vào khung trắng bên cạnh.'
    },
    {
      target: 'step-4',
      placement: 'top',
      title: 'Khung hướng đi.',
      content: ''
    },
    {
      target: 'step-5',
      placement: 'bottom',
      title: 'Thùng rác',
      content: 'Bạn có thể bỏ thẻ màu tím không cần thiết vào đây.'
    },
    {
      target: 'step-6',
      placement: 'bottom',
      title: 'Chạy thử',
      content: 'Bạn bấm chạy thử để xem thuật toán của bạn có đúng không!'
    },
    {
      target: 'step-7',
      placement: 'bottom',
      title: 'Xem code',
      content: 'Bạn có thể xem code python viết bằng câu lệnh gì.'
    }
  ],
  showPrevButton: true,
  scrollTopMargin: 100
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