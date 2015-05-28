angular.module('timekpr.services', [])

/*
 * Projects Service maintains Data state for Project Records
 * stores and fetches data from device storage
 * provides methods to start / stop timers and track time elapsed.
 * enforces logic that only one project can be timing at any moment.
 */
.factory('Projects', function(persistance) {

  /*
   * Project constructor function encapsulates Project "state" logic
   */
  function Project(name, id){
    this.id = id;
    this.name = name;
    this.start = 0;
    this.elapsed = 0;
    this.time = function(){
      var shoDate = new Date(0, 0, 0, 0, 0, 0, this.elapsed);
      return shoDate.getHours() + ":" + shoDate.getMinutes() + ":" +  shoDate.getSeconds();
    }
  }
  var projects =[
     new Project('Bench', 0),
     new Project('PTO', 1),
     new Project('EFX-CallCenter', 2)
  ];

  var current = -1;

  function clearCurrent(timestamp){
     //check again just in case.
     if (current < 0 ) return;
     var currentProject = projects[current];
     //again just being careful array has the value we want.
     if (! currentProject) return;
     //now process.
     var deltaTime = timestamp - currentProject.start;
     currentProject.elapsed += deltaTime;
     //finally update to no project
     current = -1;
  };

  function setCurrent(timestamp, project){
     var savedProject = projects[project.id];
     savedProject.start = timestamp;
     current = savedProject.id;
  };
  
  function saveState(){
    persistance.setObject('timekprProjects', projects);
    persistance.set('timekprCurrentProject', current);
  }

  return {
    all: function() {
      return projects;
    },
    startTimer: function(project) {
      var now = new Date();
      if (current > -1) {
        //if toggling same current project. just leave it.
        if (current.id === project.id) return;
        //else clear out current project
        clearCurrent(now);
      }
      setCurrent(now, project);
      saveState();
    },
    stopTimer: function(){
        clearCurrent(new Date());
        saveState();
    }
  };
});
