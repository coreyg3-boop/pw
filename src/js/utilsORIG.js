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

const makeTableCard = (project) => {
  const card = document.createElement('div');
  // card.classList.add('card');
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

  if (project.priority != null) {
    project.priority = project.priority.toLowerCase();
    priorityDisplay = project.priority.replace(project.priority.charAt(0), project.priority.charAt(0).toUpperCase());
  } else {
    project.priority = 'normal';
    priorityDisplay = project.priority.toLowerCase().replace(project.priority.charAt(0), project.priority.charAt(0).toUpperCase());
  }

  // const button = document.createElement('button');
  //   button.classList.add('move-status-button');
  //   button.classList.add('button');
  //   button.classList.add('is-info');
  //   button.textContent = "Move To Next";
  //   button.addEventListener('click', (event) => {
  //     console.log(event);
  //     console.log(event.target.parentElement);

  //     const thisCard = event.target.parentElement;
  //     const cutTime = thisCard.querySelector('.cut-time');

  //     if (cutTime.value.length < 1) {
  //       cutTime.classList.add('invalid-error');
  //     } else {
  //       moveToNewStatus(thisCard, status, cutTime);
  //       thisCard.remove();
  //     }
  //   });

    // <div class="project-list-item">
    //           <div class="row-handle"><span></span></div>
    //           <div class="customer">
    //             <p>Rivian</p>
    //           </div>
    //           <div class="project">
    //             <p>More and More Strut Hooks</p>
    //           </div>
    //           <div class="processes">
    //             <p>Waterjet, Welding</p>
    //           </div>
    //           <div class="due-date">
    //             <p>Jan 11, 2025</p>
    //           </div>
    //           <div class="priority rush">
    //             <p>Rush</p>
    //           </div>
    //           <div class="status on-hold">
    //             <p>On Hold</p>
    //           </div>
    //           <div class="details"><p>Expand</p></div>
    //           <div class="details-pane">
    //             Details Here!
    //           </div>
    //         </div>

    console.log(project)

  // const cardContent = `<div class="row-handle"><span></span></div>
  //                       <div class="customer">
  //                         <p>${project.client_name}</p>
  //                       </div>
  //                       <div class="project">
  //                         <p>${project.project_name}</p>
  //                       </div>
  //                       <div class="processes">
  //                         <p>Waterjet, Welding</p>
  //                       </div>
  //                       <div class="due-date">
  //                         <p>Jan 11, 2025</p>
  //                       </div>
  //                       <div class="priority ${project.priority}">
  //                         <p>${priorityDisplay}</p>
  //                       </div>
  //                       <div class="status ${project.status}">
  //                         <p>${statusDisplay}</p>
  //                       </div>
  //                       <div class="details"><p>Expand</p></div>
  //                       <div class="details-pane">
  //                         <div class="details-comments"><p>Comments: ${project.comments}</p></div>
  //                         <div class="details-cut-time"><p>Cut Time: ${project.cut_time} mins. </p></div>
  //                         <div class="details-creation-date"><p>Project created on: ${project.date} </p></div>
  //                         <div class="details-file-names"><p>Filenames: ${project.fileNamesList} </p></div>
  //                         <div class="details-files"><p>Files: ${project.files} </p></div>
  //                         <div class="details-projectID"><p>Project ID: ${project.id} </p></div>
  //                         <div class="details-labor-time"><p>Labor Time: ${project.labor_time} mins </p></div>
  //                         <div class="details-pending-rank"><p>Pending Ranking: ${project.pending_ranking} </p></div>
  //                         <div class="details-procedures"><p> Procedures: ${project.procedures}</p></div>
  //                         <div class="details-quantity"><p> Quantity: ${project.quantity}</p></div>
  //                         <div class="details-material"><p> Material: ${project.thickness} ${project.unit} ${project.material} @ ${project.thickness}</p></div>
  //                         <div class="details-uniqueID"><p> UniqueID:${project.uniqueID}</p></div>
  //                      </div>`;

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
                          <p>Jan 11, 2025</p>
                        </div>
                        <div class="priority ${project.priority}">
                          <p>${priorityDisplay}</p>
                        </div>
                        <div class="status ${project.status}">
                          <p>${statusDisplay}</p>
                        </div>
                        <div class="details"><p>Expand</p></div>
                        <div class="details-pane">
                          <div class="details-comments"><p>Comments:<div style="font-size: 18px"> ${project.comments}</div></p></div>
                          <div class="details-creation-date"><p>Created:<div style="font-size: 18px"> ${project.date} </div></p></div>
                          <div class="details-procedures"><p>Procedures:<div style="font-size: 18px">${project.procedures}</div></p></div>
                          <div class="details-quantity"><p> Quantity: <div style="font-size: 18px">${project.quantity}</div></p></div>
                          <div class="details-material"><p> Material: <div style="font-size: 18px">${project.material} @ ${project.thickness} ${project.unit}</div></p></div>
                          <div class="details-time-inputs">
                          <fieldset>
                          <legend>Edit Project</legend>
                          <form name="project-updates">
                            ${(function(){
                              if (project.status == 'pending') {
                                return `
                                <div class="cut-labor-time-inputs">
                                <div class="cut-time-input">
                                <label for="cut-time-input">Cut Time:</label>
                                <input name="cut-time-input" id="cut-time-input" type="Number" style="width: 50px; padding: 5px" disabled /><span> minutes</span>
                              </div>
                              <div class="labor-time-input">
                                <label for="labor-time-input">Labor Time:</label>
                                <input name="labor-time-input" id="labor-time-input" type="Number" style="width: 50px; padding: 5px" disabled /><span> minutes</span>
                              </div>
                                </div>
                                <div class="status-input">
                                  <fieldset>
                                    <legend>Update Status</legend>
                                    <input type="radio" id="in_progress" name="status_update" value="In Progress">
                                    <label for="in_progress">In Progress</label><br />
                                    <input type="radio" id="completed" name="status_update" value="Completed" disabled>
                                    <label for="completed">Completed</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">On Hold</label>
                                  </fieldset>
                                </div>
                                `
                              } else if (project.status == 'inProgress') {
                                return `
                                <div class="cut-labor-time-inputs">
                                  <div class="cut-time-input">
                                    <label for="cut-time-input">Cut Time:</label>
                                    <input name="cut-time-input" id="cut-time-input" type="Number" style="width: 50px; padding: 5px" required /><span> minutes</span>
                                  </div>
                                  <div class="labor-time-input">
                                    <label for="labor-time-input">Labor Time:</label>
                                    <input name="labor-time-input" id="labor-time-input" type="Number" style="width: 50px; padding: 5px" required /><span> minutes</span>
                                  </div>
                                </div>
                                <div class="status-input">
                                  <fieldset>
                                    <legend>Update Status</legend>
                                    <input type="radio" id="in_progress" name="status_update" value="In Progress" disabled>
                                    <label for="in_progress">In Progress</label><br />
                                    <input type="radio" id="completed" name="status_update" value="Completed">
                                    <label for="completed">Completed</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">On Hold</label>
                                  </fieldset>
                                </div>
                                `                                    
                              } else if (project.status == 'completed') {
                                return `
                                <div class="cut-labor-time-inputs">
                                  <div class="cut-time-input">
                                    <label for="cut-time-input">Cut Time:</label>
                                    <input name="cut-time-input" id="cut-time-input" type="Number" style="width: 50px; padding: 5px" value="${project.cut_time}" disabled /><span> minutes</span>
                                  </div>
                                  <div class="labor-time-input">
                                    <label for="labor-time-input">Labor Time:</label>
                                    <input name="labor-time-input" id="labor-time-input" type="Number" style="width: 50px; padding: 5px" value="${project.labor_time}" disabled /><span> minutes</span>
                                  </div>
                                </div>
                                <div class="status-input">
                                  <fieldset>
                                    <legend>Update Status</legend>
                                    <input type="radio" id="completed" name="status_update" value="Completed" disabled>
                                    <label for="completed">Completed</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">On Hold</label><br />
                                    <input type="radio" id="archived" name="status_update" value="Archived">
                                    <label for="on_hold">Archived</label>
                                  </fieldset>
                                </div>
                                `                                    
                              } else if (project.status == 'archived') {
                                return `
                                <div class="cut-labor-time-inputs">
                                  <div class="cut-time-input">
                                    <label for="cut-time-input">Cut Time:</label>
                                    <input name="cut-time-input" id="cut-time-input" type="Number" style="width: 50px; padding: 5px" value="${project.cut_time}" disabled /><span> minutes</span>
                                  </div>
                                  <div class="labor-time-input">
                                    <label for="labor-time-input">Labor Time:</label>
                                    <input name="labor-time-input" id="labor-time-input" type="Number" style="width: 50px; padding: 5px" value="${project.labor_time}" disabled /><span> minutes</span>
                                  </div>
                                </div>
                                <div class="status-input">
                                  <fieldset>
                                    <legend>Update Status</legend>
                                    <input type="radio" id="pending" name="status_update" value="Pending">
                                    <label for="pending">Pending</label><br />
                                    <input type="radio" id="on_hold" name="status_update" value="On Hold">
                                    <label for="on_hold">On Hold</label><br />
                                    <input type="radio" id="archived" name="status_update" value="Archived" disabled>
                                    <label for="on_hold">Archived</label>
                                  </fieldset>
                                </div>
                                `                                    
                              }
                            })()}
                            <input type="submit" class="apply-updates-button" value="Apply Updates" />
                          </fieldset>
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
      const fieldSet = e.target.parentElement;
      const updatesForm = e.target.parentElement;
      const status = updatesForm.querySelector('.status-input');
      const cutInput = updatesForm.querySelector('.cut-time-input');
      const laborInput = updatesForm.querySelector('.labor-time-input');

      const thisCard = updatesForm.parentElement.parentElement.parentElement.parentElement;

      let newStatus;

      const formData = new FormData(updatesForm);

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);

        if (pair[0] == 'status_update' && pair[1] == 'On Hold') {
          newStatus = 'onHold';
        } else if (pair[0] == 'status_update' && pair[1] == 'In Progress') {
          newStatus = 'inProgress';
        } else {
          if (pair[0] == 'cut-time-input') {
            project['cut_time'] = pair[1];
          }
          if (pair[0] == 'labor-time-input') {
            project['labor_time'] = pair[1];
          }
          if (pair[0] == 'status_update') {
            newStatus = pair[1].toLowerCase();
          }
        }        
      }

      if (newStatus == undefined) {
        status.classList.add('error');
      } else if (project['cut_time'].length < 1) {
        cutInput.classList.add('error');
      } else if (project['labor_time'].length < 1) {
        laborInput.classList.add('error');
      } else {
        dbUtils.dbInteractionCall('update', newStatus, project);

        //window.location.reload();
      }

      console.log(newStatus)
      console.log(project['cut_time'])
      console.log(project['labor_time'])

      moveToNewStatus(thisCard, status, project['cut_time']);

      //dbUtils.dbInteractionCall('update', newStatus, project);

      //window.location.reload();

    })

    // if (status != 'inProgress') {
    //   card.querySelector('.cut-time').disabled = true;
    //   card.querySelector('.cut-time').value = project.cut_time
    //   console.log(project.cut_time + ' mins')
    // }

    // const fileNames = card.querySelectorAll('span.project-file');
    // const detailsButton = card.querySelector('p.details-button');
    // const previewFilesButton = card.querySelector('preview-files');
    // const details = card.querySelector('div.details-panel');
    // const svgElem = document.querySelector('#svg');
    // const svgToImg = document.querySelector('.svg-to-img');
    //const revise = card.querySelector('#revise');

    // revise.addEventListener('change', function(e) {
    //   if (e.target.checked) {
    //     showProjectModal(card, project);
    //   } else {
    //     console.log('naqdda');
    //   }
    // })

    // if(previewFilesButton) {
    //   previewFilesButton.addEventListener('click', function(e) {
    //     if (e.target.hasAttribute('active')) {
    //       console.log('modal active');
    //     } else {
    //       e.target.setAttribute('active');
    //       showPreviewModal(card, project);
    //     }
    //   })
    // }

    // detailsButton.addEventListener('click', function(evt) {
    //   let show;
    //   (evt.target.textContent.includes('Show')) ? show = false : show = true;
    //   const act = show ? 'Show' : 'Hide'
    //   evt.target.textContent = act + " Details";
    //   evt.target.classList.toggle('hidden');
    //   details.classList.toggle('visible');
    //   if (details.style.maxHeight) {
    //     details.style.maxHeight = null;
    //   } else {
    //     details.style.maxHeight = details.scrollHeight + "px";
    //   } 
    // });

    // fileNames.forEach((fileName) => {
    //   const cadView = document.getElementById('cad-view');
    //   const dxfContent = document.getElementById('dxf-content');
    //   console.log(cadView)
    //   fileName.addEventListener('click', function() {
    //     const filePath = 'X:\\waterjetDashboard\\pending\\' + project.client_name + '\\' + project.project_name + '\\' +fileName.dataset.fileName;

    //   })
    // })

    //card.appendChild(button);
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

export { menuNavigation, pageChangeFade, driveLetterSpecification, makeCard, makeTableCard }