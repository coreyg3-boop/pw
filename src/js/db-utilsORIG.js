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
        console.log(typeof(status))
        console.log(status)
        if(typeof(status) == 'Array' || typeof(status) == 'object') {
            intendedQuery = 'SELECT * from `projects` WHERE `status` = ' + "'" + status[0] + "'" + ' OR `status` = ' + "'" + status[1] + "'";
        } else {
            intendedQuery = 'SELECT * from `projects` WHERE `status` = ' + "'" + status + "'";
        }
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
            intendedQuery = "UPDATE `projects` SET `status` = '" + newStatus + "', `cut_time` = '" + project['cut_time'] + "', `labor_time` = '" + project['labor_time'] + "' WHERE `projects`.`id` = " + JSONproject.id;
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
        console.log(data)
        if (data == 'success!') {
            getProjectList(status);
        } else {
            const dataString = JSON.stringify(data);

            console.log(status)

            if(typeof(status) == 'object') {
                const pendingProjects = [];
                const inProgressProjects = [];
                status.forEach((item) => {
                    const JSONProjects = JSON.parse(dataString);
                    console.log(item)
                    console.log(dataString)
                    console.log(JSON.parse(dataString))
                    for(let projectStatus in JSONProjects) {
                        console.log(JSONProjects[projectStatus])
                        console.log(JSONProjects[projectStatus].status)
                        if (JSONProjects[projectStatus].status == 'pending') {
                            pendingProjects.push(JSONProjects[projectStatus]);
                            //window.sessionStorage.setItem(JSONProjects[projectStatus].status, JSONProjects[projectStatus]);
                        } else if (JSONProjects[projectStatus].status == 'inProgress') {
                            inProgressProjects.push(JSONProjects[projectStatus]);
                            //window.sessionStorage.setItem(JSONProjects[projectStatus].status, JSONProjects[projectStatus]);
                        }
                    }
                    console.log(JSON.stringify(pendingProjects))
                    window.sessionStorage.setItem('pending', JSON.stringify(pendingProjects));
                    window.sessionStorage.setItem('inProgress', JSON.stringify(inProgressProjects));
                })
            } else {
                console.log(item)
                console.log(dataString)
                console.log(JSON.parse(dataString))
                window.sessionStorage.setItem(status, dataString);
            }

            return data;
        }
    })
}

export { dbInteractionCall, dbReturnedInteractionCall }