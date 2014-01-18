/**
 * Created by nampnq on 11/27/13.
 */

(function () {
    angular.module("easylearncode.admin.home", ["easylearncode.core"]);
    angular.module("easylearncode.admin.weekly_quiz", ["easylearncode.core"]);
})();

angular.module("easylearncode.admin.weekly_quiz").controller('WeeklyQuizCtrl',
    ['$scope', '$http', 'csrf_token', function ($scope, $http, csrf_token) {
        $scope.them = function(){
            $(function () {
                $('#modelAdd').modal();
            });
        }
        $scope.xoa = function(contest){
            id = contest.test_key;
            $http.get('/api/weekly_quiz/delete/'+id+'/').success(function(){
                $scope.contests.pop(contest);
            });
        }
        $http.get('/admin/weekly_quiz/gets').success(function (data) {
            if (data.status == 1) {

            }
            else {
                $scope.contests = data;
            }

        });
    }]);
