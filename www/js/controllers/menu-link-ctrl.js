/**
 * menuLinkCtrl
 *
 * Used to create an ngClick controller to link the menu items to the slide-box index pages.
 * Also used obtain the current tabs and slide index and in conjunction with JSON file display the view title.
 */

angular.module('grassroots').controller('menuLinkCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicTabsDelegate', '$ionicSlideBoxDelegate', menuLinkCtrl]);

function menuLinkCtrl($scope, $ionicSideMenuDelegate, $ionicTabsDelegate, $ionicSlideBoxDelegate) {
    'use strict';


    $scope.indexSlide = function (index1, index2) {
        $ionicTabsDelegate.select(index1);
        $ionicSlideBoxDelegate.slide(index2);
    };

    $scope.currInd = function () {
        var navTitle = {
            name: ""
        };

        if ($ionicSlideBoxDelegate.currentIndex() === 0) {
            $scope.navTitle.name = "Presidential";
            console.log(navTitle.name);
        } else if ($ionicSlideBoxDelegate.currentIndex() === 1) {
            $scope.navTitle.name = "Senatorial";
            console.log(navTitle.name);
        } else {
            $scope.navTitle.name = "National Legislator";
            console.log(navTitle.name);
        }
        console.log($rootScope);
        return navTitle.name;
    };

    $scope.$on("$ionicView.enter", function () {
        $ionicSlideBoxDelegate.update();
    });

    $ionicSideMenuDelegate.canDragContent(false);
}