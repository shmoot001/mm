document.addEventListener("DOMContentLoaded", function() {
    var tableBody = document.querySelector("#myTable tbody");
    var addGroupForm = document.getElementById("addGroupForm");

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
            cell.contentEditable = true; // Gör cellen redigerbar
            row.appendChild(cell);
        }

        // Lägg till knappcellen i en egen kolumn
        var buttonCell = document.createElement("td");
        var addButton = document.createElement("button");
        addButton.textContent = "Lägg till";

        addButton.addEventListener("click", function() {
            // Visa sidan för att välja grupp och verktyg när knappen klickas
            window.location.href = 'create_tool.html';
        });
    
        // Lägg till en händelselyssnare för knappen
        addButton.addEventListener("click", function() {
            // Extrahera parametrar från URL:en
            var urlParams = new URLSearchParams(window.location.search);
            var selectedRow = urlParams.get('row');
            var selectedGroup = urlParams.get('group');
            var selectedTool = urlParams.get('tool');

            // Uppdatera tabellen med verktygsdata i rätt rad
            updateTable(selectedRow, selectedGroup, selectedTool);
        });

        // Lägg till knappen i cellen
        buttonCell.appendChild(addButton);

        // Lägg till knappcellen i raden
        row.appendChild(buttonCell);

        // Lägg till raden i tabellen
        tableBody.appendChild(row);
    }




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

});


function updateTable(selectedRow, selectedGroup, selectedTool) {
    // Gör en anrop till servern för att hämta verktygsdata baserat på parametrarna
    // Använd fetch eller en lämplig metod för att hämta data från servern
    // Uppdatera cellerna i rätt rad med den hämtade datan
    // Exempelvis:
    var cellsToUpdate = tableBody.querySelector(`tr:nth-child(${selectedRow})`).querySelectorAll('td');
    cellsToUpdate[1].textContent = 'Typ'; // Uppdatera med verktygsdata
    cellsToUpdate[2].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[3].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[4].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[5].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[6].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[7].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[8].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[9].textContent = 'Namn'; // Uppdatera med verktygsdata
    cellsToUpdate[10].textContent = 'Namn'; // Uppdatera med verktygsdata
    // ... Fortsätt uppdatera övriga celler med verktygsdata ...
}

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
// Funktionen läggTillNyGrupp
function läggTillNyGrupp(event) {
    // Förhindra standardformulärsubmission
    event.preventDefault();

    // Dölj formuläret för att lägga till en ny grupp
    addGroupForm.style.display = "block";

    // Hämta värdet från input-fältet
    var newGroupName = document.getElementById("newGroupName").value;

    // Skicka en POST-förfrågan till servern för att lägga till den nya gruppen
    fetch('/api/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newGroupName }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Uppdatera grupplistan
            updateGroupList();
            // Rensa input-fältet
            document.getElementById('newGroupName').value = '';
        } else {
            alert('Det uppstod ett fel när du försökte lägga till gruppen.');
        }
    })
    .catch(error => {
        console.error('Fel vid POST-förfrågan:', error);
        alert('Ett oväntat fel uppstod.');
    });
}
function navigateToAddTool() {
    // Navigera till add_tool.html
    window.location.href = 'add_tool.html';
}
addButton.addEventListener("click", function() {
    // Visa sidan för att välja grupp och verktyg när knappen klickas
    window.location.href = 'create_tool.html';
});