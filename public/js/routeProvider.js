var app = angular.module("ngScheduler", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "html/home.html",
        controller:'mainController'
    })
    .when("/settings", {
        templateUrl : "html/settings.html"
    })

});

app.controller("mainController", function ($scope,$http,$location,$rootScope) {
  $scope.issues={last7Days:0,last24Hours:0,total:0,beforelast7Days:0};
  $scope.repoUrl="Shippable/support/issues";
$scope.getOpenIssues=function(propVar,sinceVar){
  if($scope.repoUrl.trim()=="")
  {
    $scope.errorMsg="Please Enter Something in the search box!!";
    return;
  }
  var since="";
  if(sinceVar)
  since="&since="+sinceVar;

  $scope.repoUrl=removeLastSlash($scope.repoUrl);
  var urlArr=$scope.repoUrl.split("/");
  var authTokenParam="?access_token=c1104426da675d7ce3ae4d202744ac200ce8bf08"

  if(urlArr[urlArr.length-1]!="issues")
  {
    $scope.repoUrl=$scope.repoUrl+"/issues";
  }

  console.log($scope.repoUrl);


  var myUrl     = "https://api.github.com/repos/"+$scope.repoUrl+authTokenParam+since;

  $http(
      {
         method  : 'GET',
         url     : myUrl,
        })
         .success(function(data) {
           $scope.errorMsg="";

           $scope.issues[propVar]=data.length;
           if(propVar=='last7Days')
           {
          $scope.issues.beforelast7Days=Math.abs($scope.issues.total-$scope.issues.last7Days);
          $scope.issues.last7Days=Math.abs($scope.issues.last7Days-$scope.issues.last24Hours);

         }
       })
       .error(function(err){
        $scope.errorMsg="Something went wrong! please check your Repo URL or Network Connectivity!! Hint:  Donot Include https://github.com/ !! Details: "+err.message;
        $scope.issues={last7Days:0,last24Hours:0,total:0,beforelast7Days:0};



       })
       }



       function removeLastSlash(site)
       {
           return site.replace(/\/$/, "");
       }

$scope.getData=function()
{
$scope.getOpenIssues("total");
var last24Hours=new Date();
last24Hours.setDate(last24Hours.getDate()-1);
$scope.getOpenIssues("last24Hours",last24Hours.toISOString());
var last7Days=new Date();
last7Days.setDate(last7Days.getDate()-7);
$scope.getOpenIssues("last7Days",last7Days.toISOString());
}


$scope.getData();



});
