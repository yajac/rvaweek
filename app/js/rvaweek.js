AWS.config.update({region: "us-east-1", accessKeyId:"AKIAJ5LDPWL3NHXE5UUA", secretAccessKey:"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"});

var docClient = new AWS.DynamoDB.DocumentClient();

 var weeks = [
   [new Date("01/01/2017"), new Date("01/02/2017"),new Date("01/03/2017"),new Date("01/04/2017"),new Date("01/05/2017"),new Date("01/06/2017"),new Date("01/07/2017")],
   [new Date("01/08/2017"), new Date("01/09/2017"),new Date("01/10/2017"),new Date("01/11/2017"),new Date("01/12/2017"),new Date("01/13/2017"),new Date("01/14/2017")],
   [new Date("01/15/2017"), new Date("01/16/2017"),new Date("01/17/2017"),new Date("01/18/2017"),new Date("01/19/2017"),new Date("01/20/2017"),new Date("01/21/2017")],
   [new Date("01/22/2017"), new Date("01/23/2017"),new Date("01/24/2017"),new Date("01/25/2017"),new Date("01/26/2017"),new Date("01/27/2017"),new Date("01/28/2017")],
   [new Date("01/29/2017"), new Date("01/30/2017"),new Date("01/31/2017"),new Date("02/01/2017"),new Date("02/02/2017"),new Date("02/03/2017"),new Date("02/04/2017")],
   [new Date("02/05/2017"), new Date("02/06/2017"),new Date("02/07/2017"),new Date("02/08/2017"),new Date("02/09/2017"),new Date("02/10/2017"),new Date("02/11/2017")],
   [new Date("02/12/2017"), new Date("02/13/2017"),new Date("02/14/2017"),new Date("02/15/2017"),new Date("02/16/2017"),new Date("02/17/2017"),new Date("02/18/2017")],
   [new Date("02/19/2017"), new Date("02/20/2017"),new Date("02/21/2017"),new Date("02/22/2017"),new Date("02/23/2017"),new Date("02/24/2017"),new Date("02/25/2017")],
   [new Date("02/26/2017"), new Date("02/27/2017"),new Date("02/28/2017"),new Date("03/01/2017"),new Date("03/02/2017"),new Date("03/03/2017"),new Date("03/04/2017")],
   [new Date("03/05/2017"), new Date("03/06/2017"),new Date("03/07/2017"),new Date("03/08/2017"),new Date("03/09/2017"),new Date("03/10/2017"),new Date("03/11/2017")],
   [new Date("03/12/2017"), new Date("03/13/2017"),new Date("03/14/2017"),new Date("03/15/2017"),new Date("03/16/2017"),new Date("03/17/2017"),new Date("03/18/2017")]
 ];

 var weekIndex = 0;
 var dayIndex = 0;

 function setDayWeek(today){
   for(weekIndex in weeks){
     for(dayIndex in weeks[weekIndex]){
        if(weeks[weekIndex][dayIndex].getTime() == today.getTime()){
            return;
        }
    }
   }
 }

 var app = angular.module('rvaWeekApp', []);

 app.controller('RVAWeekController', function($scope, $q) {

   var today = new Date();
   today.setHours(0,0,0,0);
   $scope.date = today.toDateString();

  setDayWeek(today);

   day = weeks[weekIndex][dayIndex];

   $scope.weeks = weeks.slice(weekIndex);
   $scope.week = weeks[weekIndex];
   $scope.day = day;
   $scope.dayIndex = dayIndex;
   $scope.weekIndex = weekIndex;

   updateEvents(day);

    $scope.updateEvents = function(date, index) {
        $scope.dayIndex = index;
        $scope.day  = date;
        updateEvents(date);
    };

    function updateEvents(date){
      var promise = asyncEvents($q, date.getFullYear(), date.getMonth()+1, date.getDate());
      promise.then(function(data) {
        $scope.eventList.events = data.Items;
       }, function(reason) {
         console.log('Failed: ' + data);
       });
    }

 });

 function asyncEvents($q, year, month, date) {
   var deferred = $q.defer();
   if(month < 10){
     month = "0" + month;
   }
   if(date < 10){
     date = "0" + date;
   }
   var params = {
        TableName: "events",
        FilterExpression: "#date = :date",
        ExpressionAttributeNames: {
            "#date": "date"
        },
        ExpressionAttributeValues: {
            ":date": month+"/"+date+"/"+year
        }
    };
   setTimeout(function() {
     docClient.scan(params, function(err, data) {
       if (err) {
         console.log(JSON.stringify(err, undefined, 2));
       } else {
         deferred.resolve(data);
       }
     })
   }, 1000);
   return deferred.promise;
 }
