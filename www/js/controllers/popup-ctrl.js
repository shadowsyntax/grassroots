/* popUpCtrl
 *
 *
 * Controller for creating pop-ups to allow user confirm their GPS location.
 */

angular.module('grassroots').controller('popUpCtrl', ['$scope', 'sweet', '$location', '$rootScope', 'ResultsService', '$cordovaGeolocation', 'loaderSrv', popUpCtrl]);

function popUpCtrl($scope, sweet, $location, $rootScope, ResultsService, $cordovaGeolocation, loaderSrv) {
    'use strict';

    // A confirm dialog box to get the GPS location.
    $scope.showConfirm = function() {
        sweet.show({
                title: 'Polling Booth location',
                text: 'Are you at the polling booth where the votes were counted?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: false,
                closeOnCancel: false
            },

            function(isConfirm) {
                if (isConfirm) {
                    sweet.show({
                        title: 'Polling Booth location',
                        text: 'Thank you, Tap OK and your collated results will be submitted.',
                        type: 'success',
                        showCancelButton: true
                    }, function(isOk) {
                        if (isOk) {
                            // Showing loading-spinner
                            loaderSrv.show();
                            // Tab Name
                            var path = $location.$$path;
                            //console.log('path: '+ path);
                            var tabName = path.split('/')[2];

                            // Slide Name
                            var slideName = '';
                            if (tabName === 'national') {
                                slideName = $rootScope.data.currentViewTitle;
                            } else {
                                slideName = $rootScope.data.currentViewTitleii;
                            }
                            slideName = slideName.replace(" ", "-");
                            slideName = slideName.toLowerCase();
                            //console.log('slide: ' + slideName);

                            // Processing Results to Store in Firebase
                            var completeResults = processResultsArray($scope.partyAbbr, slideName);


                            //UID
                            var uid = $rootScope.loggedInUserID;
                            console.log(uid);

                            //Fetching the GeoLocation Data
                            var posOptions = {
                                timeout: 10000,
                                maximumAge: 20000,
                                enableHighAccuracy: true
                            };

                            $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
                                var lat = position.coords.latitude;
                                var long = position.coords.longitude;
                                //alert("Lat is :" + lat + " & Long is :" + long);

                                var geoPosition = {
                                    lattitude: lat,
                                    longitude: long
                                };
                                // Call my SubmitResults Service
                                ResultsService.submitResults(tabName, slideName, uid, completeResults, geoPosition, function(status) {
                                    if (status) {
                                        //console.log("Data Submission Successful");
                                        resetResults($scope.partyAbbr, slideName);
                                    } else {
                                        alert("Error Occurred");
                                    }

                                });
                            }, function(err) {
                                sweet.show('Oops...', 'GPS is not enabled on your device. Please go to you device settings and enable.', 'error');
                                console.log("Error " + err);
                            });
                            // Hiding loading-spinner
                            loaderSrv.hide();
                        }
                    });
                } else {
                    sweet.show('Requirement!', 'You have to be at the polling booth to submit the results. This is to ensure accurate result collection.', 'error');
                }
            });
    };


    function processResultsArray(partyAbbr, slideName) {
        // console.log(partyAbbr);
        var dataArr = [];
        for (var i = 0; i < partyAbbr.length; i++) {

            dataArr.push({
                fullname: partyAbbr[i].fullname,
                abbr: partyAbbr[i].abbr,
                results: partyAbbr[i].results ? partyAbbr[i].results[slideName] ? partyAbbr[i].results[slideName] : "" : ""
            });
        }
        // console.log(dataArr);
        return dataArr;
    }

    function resetResults(partyAbbr, slideName) {
        for (var i = 0; i < partyAbbr.length; i++) {
            if (partyAbbr[i].results && partyAbbr[i].results[slideName]) {
                partyAbbr[i].results[slideName] = "";
            }
        }
    }
}
