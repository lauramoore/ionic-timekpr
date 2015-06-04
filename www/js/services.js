angular.module('timekpr.services', [])

/*
 * Projects Service maintains Data state for Project Records
 * stores and fetches data from device storage
 * provides methods to start / stop timers and track time elapsed.
 * enforces logic that only one project can be timing at any moment.
 */
.factory('Projects', function(persistance) {
   var key_TimeKprData = 'timekprData';
   var projects;
   var current;
   var savedState = persistance.getObject(key_TimeKprData);
   if (! savedState || _.isEmpty(savedState)) {
     initProjects();
     saveState();
   } else {
     projects = savedState.projectList;
     current = savedState.currentId;
   }
   function formatTime() {
      var shoDate = new Date(0, 0, 0, 0, 0, 0, this.elapsed);
      this.time =  shoDate.getHours() + ":" + shoDate.getMinutes() + ":" +  shoDate.getSeconds();
   }
   function initProjects(){
     projects =[
       new Project('Bench', 0),
       new Project('PTO', 1),
       new Project('EFX-CallCenter', 2)
     ];
     current = -1;
   }
  /*
   * Project constructor function encapsulates Project "state" logic
   */
  function Project(name, id){
    this.id = id;
    this.name = name;
    this.start = 0;
    this.elapsed = 0;
    this.time = "";
  }


  function clearCurrent(timestamp){
     //check again just in case.
     if (current < 0 ) return;
     var currentProject = projects[current];
     //again just being careful array has the value we want.
     if (! currentProject) return;
     //now process.
     var deltaTime = timestamp - currentProject.start;
     currentProject.elapsed += deltaTime;
     formatTime.call(currentProject);
     //finally update to no project
     current = -1;
  };

  function setCurrent(timestamp, project){
     var savedProject = projects[project.id];
     savedProject.start = timestamp;
     current = savedProject.id;
  };
  
  function saveState(){
    persistance.setObject(key_TimeKprData, { projectList : projects, currentId : current});
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
