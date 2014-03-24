var tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      target: 'step-1',
      title: 'Mức độ',
      content: 'Đây là nơi hiển thị mức độ bạn đã vượt qua trong tuần này.',
      placement: 'bottom'
    },
    {
      target: 'step-2',
      placement: 'top',
      title: 'Câu hỏi',
      content: 'Đây là phần hiển thị nội dung câu hỏi.'
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
      title: 'Nộp bài',
      content: 'Khi làm xong bạn hãy clink vào đây để nộp bài.'
    },
    {
      target: 'step-6',
      placement: 'bottom',
      title: 'Chạy thử',
      content: 'Bạn muốn chạy thử xem kết quả ra sao thì hãy click vào đây!'
    },
    {
      target: 'step-7',
      placement: 'bottom',
      title: 'Làm lại',
      content: 'Khi nào muốn xóa trắng màn hình thì bạn hãy click vào đây!'
    },
    {
      target: 'step-8',
      placement: 'top',
      title: 'Khung kết quả',
      content: 'Bảng hiển thị kết quả khi chạy thử.'
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