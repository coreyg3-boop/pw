const specifiedDriveLetter = (window.localStorage.getItem('driveLetter')) ? window.localStorage.getItem('driveLetter') + ':\\' : 'X:';

const getDBFile = (fileName) => {
    const data = window.api.getFile(fileName, specifiedDriveLetter);

    window.api.onFileResponse((data) => {
        return data;
    });
}

const writeToFile = (data, fileName) => {
    console.log('api');
    console.log(data);
    window.api.writeToFile(data, fileName, specifiedDriveLetter);
}

export { getDBFile, writeToFile }