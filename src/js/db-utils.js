const dbReturnedInteractionCall = (data) => {
    return data;
}

const dbInteractionCall = (task, status, project) => {
    let intendedQuery;
    let projectData;

    const date = new Date();
    const dateString = date.toDateString();
    const timeString = date.toTimeString();
    const dateEntry = '"' + dateString + " @ " + timeString + '"';
    
    const getProjectList = (status) => {
        intendedQuery = 'SELECT * from `projects` WHERE `status` = ' + "'" + status + "'";
        projectData = 'got from db utils!!!'
    };

    const addNewProject = (project) => {    
        const JSONproject = JSON.parse(project);
        let JSONprojectForSQL = '';
        let JSONprojectForSQLEntries = '';

        console.log(project)

        for (let details in JSONproject) {
            JSONprojectForSQL += "`" + details + "`, ";
            JSONprojectForSQLEntries += '"' + JSONproject[details] + '", '; 
        }

        const sqlColumns = JSONprojectForSQL.slice(0,-2);
        const sqlEntries = JSONprojectForSQLEntries.slice(0,-2);

        intendedQuery = 'INSERT INTO `projects`(' + sqlColumns + ') VALUES (' + sqlEntries + ')';
        projectData = 'created from db utils!!!'

    };

    const updateProjectStatus = (newStatus, project) => {

        console.log(newStatus)
        console.log(project)
        
        let JSONproject;
        if (typeof(project) == 'object') {
            JSONproject = project;
        } else {
            JSONproject = JSON.parse(project);
        }

        if (newStatus == 'completed') {
            intendedQuery = "UPDATE `projects` SET `status` = '" + newStatus + "', `cut_time` = '" + project['cut_time'] + "' WHERE `projects`.`id` = " + JSONproject.id;
        } else {
            intendedQuery = "UPDATE `projects` SET `status` = '" + newStatus + "' WHERE `projects`.`id` = " + JSONproject.id;
        }
    };

    const reviseExistingProject = () => {

    }

    switch (task) {
        case 'get':
            getProjectList(status);
            break;
        case 'create':
            addNewProject(project);
            break;
        case 'update':
            updateProjectStatus(status, project);
            break;
        case 'revise':
            reviseExistingProject();
            break;
        default:
    }
    window.api.dbInteraction('insert' , intendedQuery, projectData);

    window.api.dbInteractionResponse((data) => {
      const dataString = JSON.stringify(data);

      window.sessionStorage.setItem(status, dataString)
      return data;
    })
}

export { dbInteractionCall, dbReturnedInteractionCall }