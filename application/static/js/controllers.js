define(['angular', 'services'], function (angular) {
    'use strict';

    return angular.module('myApp.controllers', ['myApp.services'])
        // Sample controller where service is being used
        .controller('HeaderController', ['$scope', '$location', function ($scope, $location) {
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
        }])
        .controller('HomeCtrl', ['$scope', function ($scope) {
            alert("Hello");
        }])
        .controller('AlertDemoCtrl', ['$scope', function ($scope) {
            $scope.alerts = [
                { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
                { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
            ];

            $scope.addAlert = function () {
                $scope.alerts.push({msg: "Another alert!"});
            };

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };
        }])
        .controller('HomeCarouselCtrl', ['$scope', function ($scope) {
            $scope.myInterval = 5000;
            $scope.langs = [
                {
                    name: 'Python',
                    img: 'python.jpg',
                    description: 'Python là một ngôn ngữ lập trình thông dịch do Guido van Rossum tạo ra năm 1990. Python hoàn toàn tạo kiểu động và dùng cơ chế cấp phát bộ nhớ tự động; do vậy nó tương tự như Perl, Ruby, Scheme, Smalltalk, và Tcl. Python được phát triển trong một dự án mã mở, do tổ chức phi lợi nhuận Python Software Foundation quản lý. Là một ngôn ngữ lập trình hướng đối tượng, chạy được trên nhiều hệ điều hành khác nhau như Windows, Linux, Unix, Mac. Nó Đơn giản như các shellscript nhưng lại thực sự là ngôn ngữ để phát triển ứng dụng cấp siêu cao (very-high-level-language).'

                },
                {
                    name: 'C',
                    img: 'C.png',
                    description: 'C là một ngôn ngữ lập trình tương đối nhỏ gọn vận hành gần với phần cứng và nó giống với ngôn ngữ Assembler hơn hầu hết các ngôn ngữ bậc cao. Hơn thế, C đôi khi được đánh giá như là "có khả năng di động", cho thấy sự khác nhau quan trọng giữa nó với ngôn ngữ bậc thấp như là Assembler, đó là việc mã C có thể được dịch và thi hành trong hầu hết các máy tính, hơn hẳn các ngôn ngữ hiện tại trong khi đó thì Assembler chỉ có thể chạy trong một số máy tính đặc biệt. Vì lý do này C được xem là ngôn ngữ ...'

                },
                {
                    name: 'Java',
                    img: 'Java.jpg',
                    description: 'Java (đọc như "Gia-va") là một ngôn ngữ lập trình dạng lập trình hướng đối tượng (OOP). Khác với phần lớn ngôn ngữ lập trình thông thường, thay vì biên dịch mã nguồn thành mã máy hoặc thông dịch mã nguồn khi chạy, Java được thiết kế để biên dịch mã nguồn thành bytecode, bytecode sau đó sẽ được môi trường thực thi (runtime environment) chạy. Bằng cách này, Java thường chạy chậm hơn những ngôn ngữ lập trình thông dịch khác như C++, Python, Perl, PHP, C#...'
                }
            ];
        }])

});