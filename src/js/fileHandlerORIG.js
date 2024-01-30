import * as pageUtils from './utils.js';

const specifiedDriveLetter = (window.localStorage.getItem('specifiedDriveLetter')) ? window.localStorage.getItem('specifiedDriveLetter') + ':\\' : 'X:';

const getSpecifiedDriveLetter = () => {
    return specifiedDriveLetter;
}

// const watchDBFile = (fileName) => {
//     window.api.watchFile(fileName, specifiedDriveLetter);

//     window.api.onFileChange((path) => {
//         const fileName = path.split('.')[0];
//         getDBFileAddToLocal(fileName);
//         console.log('file changed', path, fileName);
//     });
// }

const populatePageWithSessionStorage = (dataName) => {
    const sessionData = window.sessionStorage;
    const projects= sessionData.getItem(dataName);
    const cardList = document.createElement('div');
    const cardListId = 'cardList';
    const JSONprojects = JSON.parse(projects);

    cardList.setAttribute('id', cardListId);

    for(let each in JSONprojects) {
        // const card = pageUtils.makeCard(JSONprojects[each]);
        const card = pageUtils.makeTableCard(JSONprojects[each]);

        cardList.appendChild(card);
    }

    return cardList;
}


const openFileInProgram = (file) => {

    console.log(file);
    
    window.api.openFileInApplication(file.path, specifiedDriveLetter);

}

const createOrRelocateDirectory = (action, projectSpecs) => {
    console.log(projectSpecs);
    window.api.createOrRelocateDirectory(action, projectSpecs, specifiedDriveLetter);
}

export { populatePageWithSessionStorage, openFileInProgram, createOrRelocateDirectory, getSpecifiedDriveLetter }