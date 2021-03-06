/**
 * sliderEmitCtrl
 *
 *
 *
 *
 * This controller works in conjuction with the sliderCtrl to implement a new slide-pager component.
 */

angular.module('grassroots').controller('sliderEmitCtrl', ['$rootScope', '$state', '$ionicSlideBoxDelegate', sliderEmitCtrl]);

function sliderEmitCtrl($rootScope, $state, $ionicSlideBoxDelegate) {
    'use strict';

    $rootScope.data = {
        numViewableSlides: 0,
        slideIndex: 0,
        currentViewTitle: 'Presidential',
        currentViewTitleii: 'Gubernatorial'
    };

    var emitSlideBoxChanged = function () {
        $rootScope.$broadcast('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $rootScope.data.numViewableSlides
        });
    };

    // Called each time the slide changes on National tab.
    $rootScope.slideChanged = function (index) {
        $rootScope.data.slideIndex = index;

        if (index === 0) {
            $rootScope.data.currentViewTitle = "Presidential";

        } else if (index === 1) {
            $rootScope.data.currentViewTitle = "Senatorial";

        } else {
            $rootScope.data.currentViewTitle = "National Legislator";

        }

        emitSlideBoxChanged();
    };
    $rootScope.slideChanged(0);

    //Called each time the slide changes on the Regional tab.
    $rootScope.slideChangedii = function (index) {
        $rootScope.data.slideIndex = index;

        if (index === 0) {
            $rootScope.data.currentViewTitleii = "Gubernatorial";

        } else {
            $rootScope.data.currentViewTitleii = "State Legislator";

        }

        emitSlideBoxChanged();
    };
    $rootScope.slideChangedii(0);
}
