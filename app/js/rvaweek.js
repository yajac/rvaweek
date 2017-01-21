

AWS.config.update({region: "us-east-1", accessKeyId:"AKIAIB6G7S5W6Z4QE6UA", secretAccessKey:"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"});

var docClient = new AWS.DynamoDB.DocumentClient();

 var weeks = [
   [new Date("01/01/2017"), new Date("01/02/2017"),new Date("01/03/2017"),new Date("01/04/2017"),new Date("01/05/2017"),new Date("01/06/2017"),new Date("01/07/2017")],
   [new Date("01/08/2017"), new Date("01/09/2017"),new Date("01/10/2017"),new Date("01/11/2017"),new Date("01/12/2017"),new Date("01/13/2017"),new Date("01/14/2017")],
   [new Date("01/15/2017"), new Date("01/16/2017"),new Date("01/17/2017"),new Date("01/18/2017"),new Date("01/19/2017"),new Date("01/20/2017"),new Date("01/21/2017")],
   [new Date("01/22/2017"), new Date("01/23/2017"),new Date("01/24/2017"),new Date("01/25/2017"),new Date("01/26/2017"),new Date("01/27/2017"),new Date("01/28/2017")]
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
   console.log(weekIndex + " " + dayIndex);


   day = weeks[weekIndex][dayIndex];

   $scope.week = weeks[weekIndex];
   $scope.day = day;
   $scope.dayIndex = dayIndex;
   $scope.weekIndex = weekIndex;

   var promise = asyncEvents($q, day.getFullYear(), day.getMonth()+1, day.getDate());
   promise.then(function(data) {
     $scope.eventList.events = data.Items;
    }, function(reason) {
      console.log('Failed: ' + data);
    });

 });

 function asyncEvents($q, year, month, date) {
   var deferred = $q.defer();
   if(month < 10){
     month = "0" + month;
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
