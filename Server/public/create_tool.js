document.addEventListener("DOMContentLoaded", function() {
    var selectGroupForm = document.getElementById("selectGroupForm");
    var selectToolForm = document.getElementById("selectToolForm");
    var toolGroupSelect = document.getElementById("toolGroup");
    var toolSelect = document.getElementById("tool");
    var selectedRowSelect = document.getElementById("selectedRow");

    // Hämta grupperna från databasen vid sidbelastning
    updateGroupOptions();
    updateTable();

    // Lägg till en händelselyssnare för formuläret för att välja grupp
    selectGroupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Hämta den valda gruppen
        var selectedGroup = toolGroupSelect.value;

        // Uppdatera verktygsalternativen baserat på den valda gruppen
        updateToolOptions(selectedGroup);

        // Visa formuläret för att välja verktyg
        selectGroupForm.style.display = "none";
        selectToolForm.style.display = "block";
    });

    // Lägg till en händelselyssnare för formuläret för att välja verktyg
    selectToolForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Hämta den valda gruppen, verktyget och raden
        var selectedGroup = toolGroupSelect.value;
        var selectedTool = toolSelect.value;
        var selectedRow = selectedRowSelect.value;

        // Skicka data till servern för att lägga till verktyget i databasen
        addToolToDatabase(selectedGroup, selectedTool, selectedRow);
    });

    // Funktion för att uppdatera gruppoptions i verktygsformuläret
    function updateGroupOptions() {
        fetch('/api/groups')
            .then(response => response.json())
            .then(groups => {
                // Fyll select-elementet med grupperna från databasen
                groups.forEach(group => {
                    var option = document.createElement("option");
                    option.value = group._id;
                    option.textContent = group.name;
                    toolGroupSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Fel vid hämtning av grupper:', error));
    }

    // Funktion för att uppdatera verktygsalternativ baserat på vald grupp
    function updateToolOptions(selectedGroup) {
        fetch(`/api/tools?group=${selectedGroup}`)
            .then(response => response.json())
            .then(tools => {
                toolSelect.innerHTML = "";

                if (tools.length > 0) {
                    tools.forEach(tool => {
                        var option = document.createElement("option");
                        option.value = tool._id;
                        option.textContent = tool.name;
                        toolSelect.appendChild(option);
                    });
                } else {
                    console.log("Den valda gruppen har inga verktyg.");
                }
            })
            .catch(error => console.error('Fel vid hämtning av verktyg:', error));
    }

    // Funktion för att lägga till valt verktyg i databasen
    function addToolToDatabase(selectedGroup, selectedTool, selectedRow) {
        // Skapa ett JSON-objekt med den data som ska skickas till servern
        var data = {
            group: selectedGroup,
            tool: selectedTool,
            row: selectedRow
        };

        // Skicka data till servern med en POST-begäran
        fetch('/api/addToSet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Om begäran är framgångsrik, lägg till verktyget i tabellen
                addToolToTable(selectedTool, selectedRow);
                alert('Verktyget har lagts till i tabellen.');
            } else {
                alert('Ett fel uppstod vid läggning av verktyget i tabellen.');
            }
        })
        .catch(error => console.error('Fel vid läggning av verktyg i tabellen:', error));
    }

    // Funktion för att lägga till valt verktyg i tabellen
    function addToolToTable(selectedTool, selectedRow) {

        updateTable();
    }

    function updateTable() {
        fetch('/api/sets')
            .then(response => response.json())
            .then(sets => {
                // Sortera sets baserat på id
                sets.sort((a, b) => a.id - b.id);
    
                // Rensa tabellen innan du lägger till nya rader
                var tableBody = document.querySelector('#selectedToolTable tbody');
                tableBody.innerHTML = '';
    
                // Loopa igenom varje set och lägg till det i tabellen
                sets.forEach(set => {
                    var row = document.createElement('tr');
                    var cellRow = document.createElement('td');
                    var cellTool = document.createElement('td');
                    var cellBrand = document.createElement('td');
                    var cellDiameter = document.createElement('td');
                    var cellCr = document.createElement('td');
                    var cellNumCutters = document.createElement('td');
                    var cellApmx = document.createElement('td');
                    var cellRmpx = document.createElement('td');
                    var cellComment = document.createElement('td');
                    var cellLastUsed = document.createElement('td');
                    var cellActions = document.createElement('td'); // Skapa cell för raderingsknapp
    
                    // Lägg till radnummer i cellen
                    cellRow.textContent = set.id;
    
                    // Kontrollera om verktyget är tillgängligt
                    if (set.tool) {
                        // Lägg till verktygsnamn och andra egenskaper i cellerna
                        cellTool.textContent = set.tool.name;
                        cellBrand.textContent = set.tool.brand;
                        cellDiameter.textContent = set.tool.diameter;
                        cellCr.textContent = set.tool.cr;
                        cellNumCutters.textContent = set.tool.numCutters;
                        cellApmx.textContent = set.tool.apmx;
                        cellRmpx.textContent = set.tool.rmpx;
                        cellComment.textContent = set.tool.comment;
                        cellLastUsed.textContent = set.tool.lastUsed;
                    } else {
                        // Om verktyget inte är tillgängligt, skriv ut ett meddelande
                        cellTool.textContent = "Verktyget saknas";
                    }
    
                    // Skapa raderingsknapp
                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Radera';
                    deleteButton.addEventListener('click', function() {
                        deleteRow(set._id); // Anropa funktionen för att radera raden med set._id
                    });
    
                    // Lägg till raderingsknapp i cellen
                    cellActions.appendChild(deleteButton);
    
                    // Lägg till cellerna i raden
                    row.appendChild(cellRow);
                    row.appendChild(cellTool);
                    row.appendChild(cellBrand);
                    row.appendChild(cellDiameter);
                    row.appendChild(cellCr);
                    row.appendChild(cellNumCutters);
                    row.appendChild(cellApmx);
                    row.appendChild(cellRmpx);
                    row.appendChild(cellComment);
                    row.appendChild(cellLastUsed);
                    row.appendChild(cellActions); // Lägg till cellen med raderingsknappen
    
                    // Lägg till raden i tabellens kropp
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Fel vid hämtning av set:', error));
    }
    
        // Funktion för att radera raden
    function deleteRow(setId) {
        fetch(`/api/deleteSet/${setId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                updateTable(); // Uppdatera tabellen efter borttagning
                alert('Raden har tagits bort.');
            } else {
                alert('Ett fel uppstod vid borttagning av raden.');
            }
        })
        .catch(error => console.error('Fel vid borttagning av raden:', error));
    }

});


function navigateToHome(){
    window.location.href = 'index.html';
}
