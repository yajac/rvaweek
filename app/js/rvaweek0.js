var url = "https://2grfdhdu8b.execute-api.us-east-1.amazonaws.com/beta/rvaweek";

//dayNames[x.getDay()]

  function getWeek(date){
    var theWeek = [];
    var weekIndex = date.getWeek();
    var start = new Date(date).setWeek(weekIndex);
    for (var i=0; i <7; i++){
      var newDate = new Date(start).addDays(i);
      theWeek.push(newDate);
    }
    return theWeek;
  }


 var app = angular.module('rvaWeekApp', []);

 app.controller('RVAWeekController', function($scope, $q) {

   var today = Date.today();
   today.clearTime();
   day = today;
   $scope.day = day;

   console.log(today.getDay());

   $scope.dayIndex = day.getDay();
   $scope.week =  getWeek(day);
   $scope.weekIndex = day.getWeek();
   updateEvents(day);

   $scope.updateWeek = function(days){
     var newDate = $scope.day.add(days).days();
     $scope.week =  getWeek(newDate);
     $scope.dayIndex = newDate.getDay();
     $scope.day  = newDate;
     updateEvents(newDate)
   };

    $scope.updateEvents = function(date) {
        $scope.dayIndex = date.getDay();
        $scope.day  = date;
        updateEvents(date);
    };

    function updateEvents(date){
      var promise = asyncEvents($q, date.getFullYear(), date.getMonth()+1, date.getDate());
      promise.then(function(data) {
        $scope.events = data.eventList;
       }, function(reason) {
         console.log('Failed: ' + data);
       });
    }

 });

 function asyncEvents($q, year, month, day) {
   var deferred = $q.defer();
   if(month < 10){
     month = "0" + month;
   }
   if(day < 10){
     day = "0" + day;
   }
   setTimeout(function() {
     var date = ""+month+day+year;
     $.ajax({
       url: url,
       data: {
         date: date
       },
       success: function(events) {
         deferred.resolve(events);
       }
     });
   }, 1000);
   return deferred.promise;
 }
