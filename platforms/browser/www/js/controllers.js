angular.module('timekpr.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ProjectsCtrl', function($scope, Projects) {
  $scope.projects = Projects.all();
  $scope.toggle = function(project) {
    Projects.startTimer(project);
  }
})

.controller('ProjectCtrlDetail', function($scope, $stateParams, Projects) {
  $scope.project = Projects.get($stateParams.projectId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
  };
});
