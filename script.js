const suburbData = [
  {
    name: 'Yarralumla',
    id: 'YA'
  },
  {
    name: 'Deakin',
    id: 'DE'
  },
  {
    name: 'Forrest',
    id: 'FO'
  },
  {
    name: 'Red Hill',
    id: 'RH'
  },
  {
    name: 'Barton',
    id: 'BA'
  },
  {
    name: 'Fisher',
    id: 'FI'
  },
  {
    name: 'Chapman',
    id: 'CH'
  },
  {
    name: 'Stirling',
    id: 'SI'
  },
  {
    name: 'Waramanga',
    id: 'WA'
  },
  {
    name: 'Rivett',
    id: 'RI'
  },
  {
    name: 'Hughes',
    id: 'HU'
  },
  {
    name: 'Weston',
    id: 'WE'
  },
  {
    name: 'Holder',
    id: 'HO'
  },
  {
    name: 'Duffy',
    id: 'DU'
  },
  {
    name: 'Kambah',
    id: 'KA'
  },
  {
    name: 'Lyons',
    id: 'LY'
  },
  {
    name: 'Chifley',
    id: 'CI'
  },
  {
    name: 'Pearce',
    id: 'PE'
  },
  {
    name: 'Torrens',
    id: 'TO'
  },
  {
    name: 'Curtin',
    id: 'CU'
  },
  {
    name: 'Phillip',
    id: 'PH'
  },
  {
    name: 'Garran',
    id: 'GA'
  },
  {
    name: 'Coombs',
    id: 'CO'
  },
  {
    name: 'Wright',
    id: 'WR'
  },
  {
    name: 'Denman Prospect',
    id: 'DP'
  },
  {
    name: 'Stromlo',
    id: 'ST'
  },
  {
    name: 'Narrabundah',
    id: 'NA'
  },
  {
    name: 'Kingston',
    id: 'KI'
  },
  {
    name: 'Griffith',
    id: 'GR'
  },
  {
    name: 'Symonston',
    id: 'SY'
  },
  {
    name: 'Rurals',
    id: 'ZR'
  },
];
let masterFile;
renderSuburbSelection();

function readFile() {
  var file = document.getElementById('upload-file').files[0];
  var reader = new FileReader();

  reader.addEventListener('load', () => {
    const json = JSON.parse(reader.result);
    JSON.stringify(json);

    masterFile = json;
  });

  reader.readAsText(file);
}

function filterDataBySuburb(suburbsToKeep) {
  let filteredData = [];
  let element;

  for (let i = 0; i < masterFile['features'].length; i++) {
    if (!masterFile['features'][0]['properties'].hasOwnProperty('map')) {
      element = masterFile['features'][i]['properties']['name'].slice(0, 2);
    } else {
      element = masterFile['features'][i]['properties']['map'].slice(0, 2);
    }

    for (let j = 0; j < suburbsToKeep.length; j++) {
      if (element.toUpperCase() === suburbsToKeep[j].toUpperCase()) {
        filteredData.push(masterFile['features'][i]);
      }
    }
  }

  const unique = [...new Set(filteredData)];
  downloadFiltered(unique);
}

function blockBoundaries(suburbsToKeep) {
  let filteredData = [];

  for (let i = 0; i < masterFile['features'].length; i++) {
    if (masterFile['features'][i]['geometry']['type'] === 'Point') {
      const element = masterFile['features'][i]['properties']['map'].slice(0, 2);

      for (let j = 0; j < suburbsToKeep.length; j++) {
        if (element.toUpperCase() === suburbsToKeep[j].toUpperCase()) {
          filteredData.push(masterFile['features'][i]);
        }
      }
    } else if (masterFile['features'][i]['geometry']['type'] === 'Polygon') {
      filteredData.push(masterFile['features'][i]);
    }
  }

  downloadFiltered(filteredData);
}

function downloadFiltered(features) {
  let data = {
    type: "FeatureCollection",
    features: []
  };

  data.features = features;

  var blob = new Blob([JSON.stringify(data)], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "Filtered Data.geojson");
}

function renderSuburbSelection() {
  const container = document.querySelector('.suburb-container');

  suburbData.sort((a, b) => a.name.localeCompare(b.name))

  for (let i = 0; i < suburbData.length; i++) {
    const label = document.createElement('label');
    label.innerText = suburbData[i].name;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = suburbData[i].id;
    checkbox.className = 'checkbox';

    const lineBreak = document.createElement('br');

    container.append(label);
    container.append(checkbox);
    container.append(lineBreak);
  }
}

function selectCheckboxes() {
  const selectAllEl = document.getElementById('select-all');
  const checkboxes = document.querySelectorAll('.checkbox');

  if (selectAllEl.checked) {
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });

    document.getElementById('deselect-all').checked = false;
  }
}

function deselectCheckboxes() {
  const deselectAllEl = document.getElementById('deselect-all');
  const checkboxes = document.querySelectorAll('.checkbox');

  if (deselectAllEl.checked) {
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    document.getElementById('select-all').checked = false;
  }
}

document.getElementById('filter').addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('.checkbox');
  const dataType = document.getElementById('data-type').value;

  var file = document.getElementById('upload-file').files[0];
  if (file == undefined) {
    document.getElementById('error').innerText = 'Please choose a file';
    document.getElementById('error').style.color = 'red';
    return;
  }

  document.getElementById('error').innerText = '';

  let suburbsToKeep = [];

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      suburbsToKeep.push(checkboxes[i].id);
    }
  }

  if (dataType === 'b-boundaries') blockBoundaries(suburbsToKeep);
  else filterDataBySuburb(suburbsToKeep);
});
document.getElementById('upload-file').addEventListener('change', readFile, false);