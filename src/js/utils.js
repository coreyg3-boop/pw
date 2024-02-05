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
  if (!window.localStorage.getItem('specifiedDriveLetter')) {
    window.localStorage.setItem('specifiedDriveLetter', 'Z');
  } else {
    window.localStorage.setItem('specifiedDriveLetter', driveLetter);
  }
}

const projectToMove = (project) => {
  let newStatus;
  let removePending = false;
  const currentStatus = project.status;

  switch (project.status) {
    case 'pending':
      newStatus = 'inProgress';
      break;
    case 'inProgress':
      newStatus = 'completed';
      break;
    case 'completed':
      newStatus = 'archived';
      removePending = true;
      break;
    default:
      newStatus = 'pending';
  }

  project.status = newStatus;

  dbUtils.dbInteractionCall('update', newStatus, project);

  if (removePending) {
    fileHandler.createOrRelocateDirectory('remove', project);
  }

}

const moveToNewStatus = (thisCard, status, cutTime) => {
  const cardID = thisCard.dataset.id;
  const projects = JSON.parse(window.sessionStorage.getItem(status));

  if (typeof(projects) == 'object') {
    for (let project in projects) {
      if(project['id'] == cardID) {
        projectToMove(projects[project]);
      }
    }
  } else {
    projects.forEach((project) => {
      if(project['id'] == cardID) {
        projectToMove(project);
      }
    })
  }
}

const makeTableCard = (project) => {
  const card = document.createElement('div');
  card.classList.add('project-list-item');
  card.dataset.id = project.id;
  const status = project.status;

  const expandDetails = document.querySelectorAll('.details p');
      expandDetails.forEach((item, index) => {
        item.addEventListener(('click'), (e) => {
          const parentCard = e.target.parentElement.parentElement;
          parentCard.classList.toggle('expanded');
        })
      });

  let statusDisplay = project.status.toLowerCase().replace(project.status.charAt(0), project.status.charAt(0).toUpperCase());
  console.log(statusDisplay);
  let priorityDisplay = '';

  if (statusDisplay == 'Inprogress') {
    statusDisplay = 'In Progress'
  }

  if (statusDisplay == 'Onhold') {
    statusDisplay = 'On Hold'
  }

  if (project.priority != null) {
    project.priority = project.priority.toLowerCase();
    priorityDisplay = project.priority.replace(project.priority.charAt(0), project.priority.charAt(0).toUpperCase());
  } else {
    project.priority = 'normal';
    priorityDisplay = project.priority.toLowerCase().replace(project.priority.charAt(0), project.priority.charAt(0).toUpperCase());
  }

  const cardContent = `<div class="row-handle"><span></span></div>
                        <div class="customer">
                          <p>${project.client_name}</p>
                        </div>
                        <div class="project">
                          <p>${project.project_name}</p>
                        </div>
                        <div class="processes">
                          <p>${project.procedures}</p>
                        </div>
                        <div class="due-date">
                          <p>${
                            (function() {
                                const dueDate = project['due_date'];
                                return new Date(dueDate).toDateString();
                            })()
                          }</p>
                        </div>
                        <div class="priority ${project.priority}">
                          <p>${priorityDisplay}</p>
                        </div>
                        <div class="status ${project.status}">
                          <p>${statusDisplay}</p>
                        </div>
                        <div class="details"><p>Expand</p></div>
                        <div class="details-pane no-show">
                          <div class="details-comments"><p>Comments:<div style="font-size: 18px"> ${project.comments}</div></p></div>
                          <div class="details-creation-date"><p>Created:<div style="font-size: 18px"> ${project.date} </div></p></div>
                          <div class="details-procedures"><p>Procedures:<div style="font-size: 18px">${project.procedures}</div></p></div>
                          <div class="details-quantity"><p> Quantity: <div style="font-size: 18px">${project.quantity}</div></p></div>
                          <div class="details-material"><p> Material: <div style="font-size: 18px">${project.material} @ ${project.thickness} ${project.unit}</div></p></div>
                          <div class="details-time-inputs">
                            ${(function(){
                              if (project.status == 'pending') {
                                return `
                                  <div class="cut-time-input">
                                    <label for="cut-time-input">Cut Time:</label>
                                    <input name="cut-time-input" id="cut-time-input" type="number" disabled /><span> minutes</span>
                                  </div>
                                  <div class="labor-time-input">
                                    <label for="labor-time-input">Labor Time:</label>
                                    <input name="labor-time-input" id="labor-time-input" type="number" disabled /><span> minutes</span>
                                  </div>
                                <div class="status-input">
                                    <input type="radio" id="in_progress" name="status_update" value="In Progress">
                                    <label for="in_progress">Move To In Progress</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">Put On Hold</label>
                                </div>
                                `
                              } else if (project.status == 'inProgress') {
                                return `
                                  <div class="cut-time-input">
                                    <label for="cut-time-input">Cut Time:</label>
                                    <input name="cut-time-input" id="cut-time-input" type="number" required /><span> minutes</span>
                                  </div>
                                  <div class="labor-time-input">
                                    <label for="labor-time-input">Labor Time:</label>
                                    <input name="labor-time-input" id="labor-time-input" type="number" required /><span> minutes</span>
                                </div>
                                <div class="status-input">
                                    <input type="radio" id="completed" name="status_update" value="Completed">
                                    <label for="completed">Move To Completed</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">Put On Hold</label>
                                </div>
                                `                                    
                              } else if (project.status == 'onHold') {
                                return `
                                <div class="status-input">
                                    <input type="radio" id="pending" name="status_update" value="Pending">
                                    <label for="pending">Move To Pending</label><br />
                                    <input type="radio" id="in_progress" name="status_update" value="In Progress">
                                    <label for="in_progress">Move To In Progress</label><br />
                                    <input type="radio" id="completed" name="status_update" value="Completed">
                                    <label for="completed">Move To Completed</label><br />
                                    <input type="radio" id="archived" name="status_update" value="Archived">
                                    <label for="archived">Move To Archived</label><br />
                                </div>
                                `                                    
                              } else if (project.status == 'completed') {
                                return `
                                  <div class="cut-time-input">
                                    <label for="cut-time-input">Cut Time:</label>
                                    <input name="cut-time-input" id="cut-time-input" type="number" value="${project.cut_time}" disabled /><span> minutes</span>
                                  </div>
                                  <div class="labor-time-input">
                                    <label for="labor-time-input">Labor Time:</label>
                                    <input name="labor-time-input" id="labor-time-input" type="number" value="${project.labor_time}" disabled /><span> minutes</span>
                                  </div>
                                <div class="status-input">
                                    <input type="radio" id="archived" name="status_update" value="Archived">
                                    <label for="on_hold">Move To Archived</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">Put On Hold</label>
                                </div>
                                `                                    
                              } else if (project.status == 'archived') {
                                return `
                                  <div class="cut-time-input">
                                    <label for="cut-time-input">Cut Time:</label>
                                    <input name="cut-time-input" id="cut-time-input" type="number" value="${project.cut_time}" disabled /><span> minutes</span>
                                  </div>
                                  <div class="labor-time-input">
                                    <label for="labor-time-input">Labor Time:</label>
                                    <input name="labor-time-input" id="labor-time-input" type="number" value="${project.labor_time}" disabled /><span> minutes</span>
                                  </div>
                                <div class="status-input">
                                    <input type="radio" id="pending" name="status_update" value="Pending">
                                    <label for="pending">Move To Pending</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">Move To On Hold</label><br />
                                </div>
                                `                                    
                              }
                            })()}
                            <input type="submit" class="apply-updates-button" value="Apply Updates" />
                          </div>
                       </div>`;
                  

    card.insertAdjacentHTML("beforeend", cardContent);

    const expandDetailsButton = card.querySelector('.details');
    const applyUpdatesButton = card.querySelector('.apply-updates-button');

    expandDetailsButton.addEventListener(('click'), (e) => {
      const parentCard = e.target.parentElement.parentElement;
      parentCard.classList.toggle('expanded');
    });

    const checkError = () => {

    }

    applyUpdatesButton.addEventListener(('click'), (e) => {
      e.preventDefault();
      const updateInputsParent = e.target.parentElement;
      const updateInputs = updateInputsParent.querySelectorAll('input');
      const status = updateInputsParent.querySelector('.status-input');
      const cutInput = updateInputsParent.querySelector('.cut-time-input');
      const laborInput = updateInputsParent.querySelector('.labor-time-input');
      const thisCard = updateInputsParent.parentElement.parentElement;

      let newStatus;

      updateInputs.forEach((input) => {
        if (input.type == 'number') {
          if (input.value != '') {
            if (input.name="cut-time-input") {
                project['cut_time'] = input.value
            }
            if (input.name="labor-time-input") {
                project['labor_time'] = input.value
            }
          }
        }
        if (input.type == 'radio') {
          if (input.checked) {
            if (input.value.split(' ').length > 1) {
              newStatus = input.value.toLowerCase().split(' ')[0] + input.value.toLowerCase().split(' ')[1].charAt(0).toUpperCase() + input.value.toLowerCase().split(' ')[1].substring(1);
            } else {
              newStatus = input.value.toLowerCase();
            }
        
          }
        }
      })

      if (newStatus == undefined) {
        status.classList.add('error');
      } else if (project['cut_time'].length < 1) {
        cutInput.classList.add('error');
      } else if (project['labor_time'].length < 1) {
        laborInput.classList.add('error');
      } else {
        dbUtils.dbInteractionCall('update', newStatus, project);
      }

      if (newStatus != 'archived') {
        if (newStatus == 'pending') {
          fileHandler.createOrRelocateDirectory('revive', project);
        }
      } else {
        fileHandler.createOrRelocateDirectory('remove', project);
      }

      console.log(newStatus)
      console.log(project['cut_time'])
      console.log(project['labor_time'])

      window.location.reload();
    })

    return card

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
        console.log('aboutToMoveToNewStatus');
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

  card.appendChild(button);
  return card
}

export { menuNavigation, pageChangeFade, driveLetterSpecification, makeCard, makeTableCard }