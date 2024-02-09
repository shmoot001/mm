document.addEventListener("DOMContentLoaded", function() {
    var tableBody = document.querySelector("#myTable tbody");
    var addGroupForm = document.getElementById("addGroupForm");
    var deleteGroupForm = document.getElementById("deleteGroupForm");
    var deleteToolForm = document.getElementById("deleteToolForm");

    // Hämta grupplistan vid sidbelastning
    updateGroupList();

    for (var i = 1; i <= 24; i++) {
        var row = document.createElement("tr");

        // Lägg till första kolumnen med numrering
        var numCell = document.createElement("td");
        numCell.textContent = i;
        row.appendChild(numCell);

        // Ändrade antalet kolumner till 10 (från kolumn 2 till kolumn 11)
        for (var j = 2; j <= 11; j++) {
            var cell = document.createElement("td");
          //  cell.contentEditable = true; // Gör cellen redigerbar
            row.appendChild(cell);
        }

        // Lägg till raden i tabellen
        tableBody.appendChild(row);
    }

    // Funktion för att radera grupp
    deleteGroupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        updateGroupOptions();
        var selectedGroup = document.getElementById("groupName").value;
        deleteGroup(selectedGroup);
    });

    // Funktion för att radera verktyg
    deleteToolForm.addEventListener("submit", function(event) {
        event.preventDefault();
        updateToolOptions();
        var selectedTool = document.getElementById("toolName").value;
        deleteTool(selectedTool);
    });

    // Lägg till en händelselyssnare för formuläret för att lägga till en ny grupp
    addGroupForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Förhindra standardformulärsubmission

        var newGroupName = document.getElementById("newGroupName").value;

        if (newGroupName) {
            // Skicka en POST-förfrågan för att lägga till den nya gruppen
            sparaNyGrupp(newGroupName);
        } else {
            alert("Vänligen ange ett gruppnamn.");
        }
    });

    // Funktion för att uppdatera den valda raden i tabellen med ny verktygsdata
    window.updateTableRow = function(row, toolData) {
        var tableRow = tableBody.children[row - 1]; // Indexet är 0-baserat
        var cells = tableRow.children;
        for (var i = 2; i <= 11; i++) {
            cells[i].textContent = toolData[i - 2];
        }
    };

});

// Funktion för att spara ny grupp i databasen
function sparaNyGrupp(gruppNamn) {
    // Denna funktion kan lämnas som den är för nu
    console.log("Spara ny grupp: " + gruppNamn);
}

// Funktion för att uppdatera grupplistan
function updateGroupList() {
    // Denna funktion kan lämnas som den är för nu
    console.log("Uppdatera grupplistan");
}

// Funktion för att radera grupp på servern
function deleteGroup(groupName) {
    fetch('/api/groups/' + groupName, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Gruppen har raderats.');
            // Uppdatera grupp-listan efter borttagning
            updateGroupOptions();
        } else {
            alert('Ett fel uppstod vid radering av gruppen.');
        }
    })
    .catch(error => console.error('Fel vid radering av grupp:', error));
}

// Funktion för att radera verktyg på servern
function deleteTool(toolName) {
    fetch('/api/tools/' + toolName, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Verktyget har raderats.');
            // Uppdatera verktygs-listan efter borttagning
            updateToolOptions();
        } else {
            alert('Ett fel uppstod vid radering av verktyget.');
        }
    })
    .catch(error => console.error('Fel vid radering av verktyg:', error));
}

// Funktion för att uppdatera gruppoptions i verktygsformuläret
function updateGroupOptions() {
    // Rensa listan
    var groupSelect = document.getElementById("groupName");
    groupSelect.innerHTML = "";
    // Hämta nya grupper från servern och fyll listan
    fetch('/api/groups')
        .then(response => response.json())
        .then(groups => {
            groups.forEach(group => {
                var option = document.createElement("option");
                option.value = group.name;
                option.textContent = group.name;
                groupSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Fel vid hämtning av grupper:', error));
}

// Funktion för att uppdatera verktygsalternativ baserat på vald grupp
function updateToolOptions() {
    // Rensa listan
    var toolSelect = document.getElementById("toolName");
    toolSelect.innerHTML = "";
    // Hämta nya verktyg från servern och fyll listan
    fetch('/api/tools')
        .then(response => response.json())
        .then(tools => {
            tools.forEach(tool => {
                var option = document.createElement("option");
                option.value = tool.name;
                option.textContent = tool.name;
                toolSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Fel vid hämtning av verktyg:', error));
}

// Funktioner för att navigera till olika sidor
function navigateToAddTool() {
    window.location.href = 'add_tool.html';
}

function navigateToCreateTool() {
    window.location.href = 'create_tool.html';
}

function navigateToCreateGroup() {
    window.location.href = 'create_group.html';
}

function navigateToDeleteGroup() {
    window.location.href = 'delete_group.html';
}

function navigateToDeleteTool() {
    window.location.href = 'delete_tool.html';
}
