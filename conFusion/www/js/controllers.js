//Ionic assignment #4
angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera,
$cordovaImagePicker) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
   $scope.loginData = $localStorage.getObject('userinfo','{}');
  // Reservation form
  $scope.reservation = {};
  $scope.registration = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
    $timeout(function() {
          $scope.closeLogin();
        }, 1000);


    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };


    //Use of the cordovaCamera plugin
          //these are the options for what follows
          $ionicPlatform.ready(function() {

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
                };

            //now the plugin + the options
            $scope.takePicture = function() {
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    console.log(err);
                });
                $scope.registerform.show();
                };

            //Use cordovaImagePicker here
            var optionspicker = {
               maximumImagesCount: 10,
               width: 100,
               height: 100,
               quality: 50
              };

            $scope.selectPicture = function() {
            //now the plugin + the options
             $cordovaImagePicker.getPictures(optionspicker)
                 .then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);
                        $scope.registration.imgSrc = results[0];
                    }
                }, function(error) {
                     console.log('Failed to get picture')
                });
            }; //selectPicture ends

        };//$ionicPlatform ends



 // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };


})


.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";

            $scope.dishes = dishes;

            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };

            //From exercise Lesson2-Part1
            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();

            //Add here $cordovaLocalNotification
            $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.dishes[index].name
                    }).then(function () {
                        console.log('Added Favorite '+$scope.dishes[index].name);
                    },
                    function () {
                        console.log('Failed to add Notification ');
                    });

                    $cordovaToast
                      .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                      .then(function (success) {
                          // success
                      }, function (error) {
                          // error
                      });
            }); //$ionicPlatform ends

            }; //addFavorite end
        }])


        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])


        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])


.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

            //favoriteFactory dependency injection is needed for this to work
    /* previous addFavorite
            $scope.addFavorite = function(index){
              favoriteFactory.addToFavorites($scope.dish.id);
              console.log("Favorite added");
              $scope.popover.hide();
            };

        */

//NEW Assign.#4 - addFavorite with cordovaLocalNotification + cordovaToast
    $scope.addFavorite = function(){
        favoriteFactory.addToFavorites($scope.dish.id);
        console.log("Favorite added");
        $scope.popover.hide();

        $ionicPlatform.ready(function () {

             $cordovaLocalNotification.schedule({
                 id: 1,
                 title: "Added Favorite",
                 text: $scope.dish.name
             }).then(function () {
                 console.log('Added Favorite '+$scope.dish.name);
             },
             function () {
                 console.log('Failed to add Notification ');
             });

             $cordovaToast
               .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
               .then(function (success) {
                   console.log('Toast succesful for '+$scope.dish.name);
               }, function (error) {
                     console.log('Toast Failed');
               });

        }); //$ionicPlatform ends

    }; //addFavorite ends



            //code updated Lesson1 from Week3
            $scope.dish = dish;

          // popover.fromTemplateUrl() method
          $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
            scope: $scope
          }).then(function(popover) {
            $scope.popover = popover;
          });

         $scope.openPopover = function($event) {
            console.log('Open popover');
            $scope.popover.show($event);
          };
          $scope.closePopover = function() {
            console.log('Closing popover');
            $scope.popover.hide();
          };
          //Cleanup the popover when we're done with it!
          $scope.$on('$destroy', function() {
            $scope.popover.remove();
          });
          // Execute action on hide popover
          $scope.$on('popover.hidden', function() {
            // Execute action
          });
          // Execute action on remove popover
          $scope.$on('popover.removed', function() {
            // Execute action
          });
          // popover ends


          // Comment modal starts here
            $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
              scope: $scope
            }).then(function(modal){
              $scope.commentmodal = modal;
            });

            $scope.addComment = function() {
                $scope.commentmodal.show();
                $scope.popover.hide();
              };

            $scope.closeComment = function() {
                console.log('Closing modal');
                $scope.commentmodal.hide();
              };

            $scope.submitComment = function() {
              $scope.mycomment.date = new Date().toISOString();
              $scope.mycomment.rating = parseInt($scope.mycomment.rating, 10);
              console.log('Comment submitted', $scope.mycomment);
              $scope.dish.comments.push($scope.mycomment);
              $scope.commentmodal.hide();
            };
        // comment modal ends


    }])



.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};

            $scope.submitComment = function () {

                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);

                $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);

                $scope.commentForm.$setPristine();

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])



.controller('IndexController', ['$scope', 'menuFactory', 'leader', 'dish', 'promotion', 'promotionFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, leader, dish, promotion, promotionFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = dish;
    $scope.promotion = promotion;
    $scope.leader = leader;


}])


.controller('AboutController', ['$scope', 'corporateFactory', 'leaders', '$stateParams', 'baseURL', function($scope, corporateFactory, leaders, $stateParams, baseURL) {

              $scope.baseURL = baseURL;
              $scope.showLeaders = false;
              $scope.message = 'Loading ...';
              $scope.leaders = leaders;

              console.log($scope.leaders);

}])

//This code got changed in Lesson1 from Week3
.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate','$ionicPopup', '$ionicLoading', '$timeout', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $cordovaVibration) {

            $scope.baseURL = baseURL;
            $scope.shouldShowDelete = false;

            $scope.favorites = favorites;
            $scope.dishes = dishes;


            console.log($scope.dishes, $scope.favorites);

            $scope.toggleDelete = function () {
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
                console.log($scope.shouldShowDelete);
            }

            //This code got changed in Lesson3
            $scope.deleteFavorite = function (index) {

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirm Delete',
                        template: 'Are you sure you want to delete this item?'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            console.log('Ok to delete');
                            favoriteFactory.deleteFromFavorites(index);
                             // Vibrate 100ms
                            $cordovaVibration.vibrate(100);
                        } else {
                            console.log('Canceled delete');
                        }
                    });

                    $scope.shouldShowDelete = false;

            }

    }])


// This is a FILTER not a controller
.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

    }})

;
