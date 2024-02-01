import * as pageUtils from './utils.js';

const specifiedDriveLetter = (window.localStorage.getItem('specifiedDriveLetter')) ? window.localStorage.getItem('specifiedDriveLetter') + ':\\' : 'X:';

const getSpecifiedDriveLetter = () => {
    return specifiedDriveLetter;
}

const populatePageWithSessionStorage = (dataName) => {
    const sessionData = window.sessionStorage;
    const projects= sessionData.getItem(dataName);
    const cardList = document.createElement('div');
    const cardListId = 'cardList';
    const JSONprojects = JSON.parse(projects);

    cardList.setAttribute('id', cardListId);

    if (JSONprojects.length === 0) {
        const noProjects = document.createElement('p');
        noProjects.textContent = 'No projects to display';
        cardList.appendChild(noProjects);
        return cardList;
    }

    for(let each in JSONprojects) {
        const card = pageUtils.makeTableCard(JSONprojects[each]);

        cardList.appendChild(card);
    }

    return cardList;
}


const openFileInProgram = (file) => {    
    window.api.openFileInApplication(file.path, specifiedDriveLetter);
}

const createOrRelocateDirectory = (action, projectSpecs) => {
    window.api.createOrRelocateDirectory(action, projectSpecs, specifiedDriveLetter);
}

export { populatePageWithSessionStorage, openFileInProgram, createOrRelocateDirectory, getSpecifiedDriveLetter }