var tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      target: 'step-1',
      title: 'Tên bài',
      content: 'Hiển thị tên bài mà bạn đang học.',
      placement: 'bottom'
    },
    {
      target: 'step-2',
      placement: 'top',
      title: 'Chọn bài',
      content: 'Hiển thị danh sách các bài học.'
    },
    {
      target: 'step-3',
      placement: 'bottom',
      title: 'Thời gian',
      content: 'Thời gian còn lại để làm bài thi.'
    },
    {
      target: 'step-4',
      placement: 'top',
      title: 'Khung code',
      content: 'Bạn hày làm bài thi vào khung code này!'
    },
    {
      target: 'step-5',
      placement: 'bottom',
      title: 'Chạy code',
      content: 'Nhấn vào đây để chạy thử code của bạn.'
    },
    {
      target: 'step-6',
      placement: 'bottom',
      title: 'Làm lại',
      content: 'Xóa trắng khung code'
    },
    {
      target: 'step-7',
      placement: 'left',
      title: 'Phóng to',
      content: 'Phóng to khung code'
    },
    {
      target: 'step-8',
      placement: 'top',
      title: 'Kết quả',
      content: 'Khung hiển thị kết quả'
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

initTour = function() {
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
//    setTimeout(function() {
//      mgr.createCallout({
//        id: calloutId,
//        target: startBtnId,
//        placement: 'bottom',
//        title: 'Xin chào các bạn',
//        content: 'Hãy click vào đây để xem hướng dẫn!',
//        yOffset: -25,
//        arrowOffset: 20,
//        width: 240
//      });
//    }, 100);
  }

  addClickListener(document.getElementById(startBtnId), function() {
    if (!hopscotch.isActive) {
      mgr.removeAllCallouts();
      hopscotch.startTour(tour);
    }
  });
};