import * as dbUtils from './db-utils.js';
import * as fileHandler from './fileHandler.js';

const menuNavigation = () => {
    const linkButton = document.querySelectorAll('button.goToPage');

    linkButton.forEach((button) => {
      button.addEventListener('click', () => {
        const link = button.dataset.href;
        pageChangeFade();
        setTimeout(() => {
            window.location.href = link
        }, 125);
      });
    });
  };

const pageChangeFade = () => {
    const bodyMainContent = document.querySelector('body > main section.content');
    
    if (bodyMainContent.classList.contains('fade-in')) {
        bodyMainContent.classList.remove('fade-in');
        bodyMainContent.classList.add('fade-out');
    } else if (bodyMainContent.classList.contains('fade-out')) {
        bodyMainContent.classList.remove('fade-out');
        bodyMainContent.classList.add('fade-in');
    } else {
        bodyMainContent.classList.add('fade-in');
    }
}

const driveLetterSpecification = (driveLetter) => {
  // if (!window.localStorage.getItem('specifiedDriveLetter')) {
  //   window.localStorage.setItem('specifiedDriveLetter', 'Z:');
  // } else {
  //   window.localStorage.setItem('specifiedDriveLetter', driveLetter + ':');
  // }

  if (!window.localStorage.getItem('specifiedDriveLetter')) {
    window.localStorage.setItem('specifiedDriveLetter', 'Z');
  } else {
    window.localStorage.setItem('specifiedDriveLetter', driveLetter);
  }

  console.log(window.localStorage.getItem('specifiedDriveLetter'));
}

const projectToMove = (project) => {
  let newStatus;
  const currentStatus = project.status;

  console.log(project)
  console.log(project.status)

  switch (project.status) {
    case 'pending':
      newStatus = 'inProgress';
      break;
    case 'inProgress':
      newStatus = 'completed';
      break;
    case 'completed':
      newStatus = 'archived';
      break;
    default:
      newStatus = 'pending';
  }

  project.status = newStatus;

  console.log(project);

  fileHandler.createOrRelocateDirectory('relocate', project);
  dbUtils.dbInteractionCall('update', newStatus, project);

}

const moveToNewStatus = (thisCard, status, cutTime) => {
  const cardID = thisCard.dataset.id;
  const projects = JSON.parse(window.sessionStorage.getItem(status));

  console.log(status)
  console.log(thisCard)
  console.log(cutTime)
  console.log(cutTime.value)

  //For Testingvvv//
  //const statusFaux = 'pending';
  //let cardID;

  //const projects = JSON.parse(window.sessionStorage.getItem(statusFaux));
  //Testing^^^//

  console.log(projects)

  //For Testingvvvv//

  // if (typeof(projects) == 'object') {
  //   for (let project in projects) {
  //     console.log('object')
  //     //cardID = projects[project]['uniqueID'];
  //     if(project['id'] == cardID) {
  //       projectToMove(projects[project]);
  //     }
  //   }
  // } else {
  //   console.log('object else')
  //   projects.forEach((project) => {
  //     if(project['id'] == cardID) {
  //       projectToMove(project);
  //     }
  //   })
  // }

  //Testing^^^^//

  // if (typeof(projects) == 'object') {
  //   for (let project in projects) {
  //     console.log('object')
  //     //cardID = projects[project]['uniqueID'];
  //     if(project['id'] == cardID) {
  //       projectToMove(projects[project]);
  //     }
  //   }
  // }


  console.log(projects)
  console.log(thisCard)




  projects.forEach((project) => {
    if(project['id'] == cardID) {
      project['cut_time'] = cutTime.value;
      projectToMove(project);
    }
  })


}

const makeCard = (project) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = project.id;
  const status = project.status;

  const button = document.createElement('button');
    button.classList.add('move-status-button');
    button.classList.add('button');
    button.classList.add('is-info');
    button.textContent = "Move To Next";
    button.addEventListener('click', (event) => {
      console.log(event);
      console.log(event.target.parentElement);

      const thisCard = event.target.parentElement;
      const cutTime = thisCard.querySelector('.cut-time');

      if (cutTime.value.length < 1) {
        cutTime.classList.add('invalid-error');
      } else {
        moveToNewStatus(thisCard, status, cutTime);
        thisCard.remove();
      }
    });

  const cardContent = `<div class="card-content">
                  <p class="client">${project.client_name}</p>
                  <p class="project">${project.project_name}</p>
                  <div class="ranking">${
                    (function() {
                      if(status == 'pending') {                
                        const projectRanking = '<p class="project-ranking" data-ranking="' + project.pending_ranking + '"><span class="rank-increase">^</span>&nbsp;&nbsp;&nbsp;<span class="rank-decrease">v</span></p><br/>'
                        return projectRanking;
                      } else {
                        console.log('projectRanking')
                      }
                    })()
                  }
                  </div>
                  <p class="status">${project.status}</p>
                  <p class="details-button">Show Details</p>
                  <div class="details-panel">
                  <p><span>${project.thickness} </span><span>${project.unit} - </span><span>${project.material}</span></p>
                  <p>Quantity: ${project.quantity}</p>
                  <hr/>
            
                  <hr/>
                  <p>Comments: ${project.comments}</p>
                  <hr/>
                  <p>Files: <br/>
                  <p>${
                    (function() {
                      const projectFiles = project.fileNamesList;
                      if (projectFiles != null) {
                        const projectFilesSplit = projectFiles.split(',');
                        let projectFileSpans = '';
                        console.log(projectFiles);
                        projectFilesSplit.forEach((item, index) => {
                          projectFileSpans += '<span class="project-file" data-file-name="' + item + '">' + item + '</span><br/>'
                        });
                        return projectFileSpans;
                      } else {
                        console.log('projectFiles ==> ', projectFiles,  null)
                      }
                    })()
                  }</p>
                  </p>
                  <br/>
                  <br/>
                  <label for="cut-time">Cut Time
                    <input class="cut-time" name="cut-time" id="cut-time" /> Minutes
                  </label>
                  <hr/>
                  </div>
                  </div>`;

  card.insertAdjacentHTML("beforeend", cardContent);

  if (status != 'inProgress') {
    card.querySelector('.cut-time').disabled = true;
    card.querySelector('.cut-time').value = project.cut_time
    console.log(project.cut_time + ' mins')
  }

  const fileNames = card.querySelectorAll('span.project-file');
  const detailsButton = card.querySelector('p.details-button');
  const previewFilesButton = card.querySelector('preview-files');
  const details = card.querySelector('div.details-panel');
  const svgElem = document.querySelector('#svg');
  const svgToImg = document.querySelector('.svg-to-img');
  //const revise = card.querySelector('#revise');

  // revise.addEventListener('change', function(e) {
  //   if (e.target.checked) {
  //     showProjectModal(card, project);
  //   } else {
  //     console.log('naqdda');
  //   }
  // })

  if(previewFilesButton) {
    previewFilesButton.addEventListener('click', function(e) {
      if (e.target.hasAttribute('active')) {
        console.log('modal active');
      } else {
        e.target.setAttribute('active');
        showPreviewModal(card, project);
      }
    })
  }

  detailsButton.addEventListener('click', function(evt) {
    let show;
    (evt.target.textContent.includes('Show')) ? show = false : show = true;
    const act = show ? 'Show' : 'Hide'
    evt.target.textContent = act + " Details";
    evt.target.classList.toggle('hidden');
    details.classList.toggle('visible');
    if (details.style.maxHeight) {
      details.style.maxHeight = null;
    } else {
      details.style.maxHeight = details.scrollHeight + "px";
    } 
  });

  // fileNames.forEach((fileName) => {
  //   const cadView = document.getElementById('cad-view');
  //   const dxfContent = document.getElementById('dxf-content');
  //   console.log(cadView)
  //   fileName.addEventListener('click', function() {
  //     const filePath = 'X:\\waterjetDashboard\\pending\\' + project.client_name + '\\' + project.project_name + '\\' +fileName.dataset.fileName;

  //   })
  // })

  card.appendChild(button);
  return card
}

export { menuNavigation, pageChangeFade, driveLetterSpecification, makeCard }