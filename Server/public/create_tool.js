document.addEventListener("DOMContentLoaded", function() {
    var selectGroupForm = document.getElementById("selectGroupForm");
    var selectToolForm = document.getElementById("selectToolForm");
    var toolGroupSelect = document.getElementById("toolGroup");
    var toolSelect = document.getElementById("tool");
    var selectedRowSelect = document.getElementById("selectedRow");

    // Hämta grupperna från databasen vid sidbelastning
    updateGroupOptions();

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

        // Hämta den valda gruppen och verktyget
        var selectedGroup = toolGroupSelect.value;
        var selectedTool = toolSelect.value;
        var selectedRow = selectedRowSelect.value;

        // Skicka tillbaka vald grupp, verktyg och radnummer till startsidan
        var data = {
            group: selectedGroup,
            tool: selectedTool,
            row: selectedRow
        };

        // Skicka data tillbaka till startsidan och uppdatera tabellen
        fetch('/api/add-tool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert('Verktyget har lagts till i tabellen.');
                window.location.href = 'index.html'; // Navigera tillbaka till startsidan
            } else {
                alert('Ett fel uppstod vid läggning av verktyget i tabellen.');
            }
        })
        .catch(error => console.error('Fel vid läggning av verktyg i tabellen:', error));
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
        // Hämta verktygen från databasen baserat på den valda gruppen
        fetch(`/api/tools?group=${selectedGroup}`)
            .then(response => response.json())
            .then(tools => {
                // Rensa tidigare alternativ
                toolSelect.innerHTML = "";

                // Om det finns verktyg i gruppen, fyll select-elementet med verktygen
                if (tools.length > 0) {
                    tools.forEach(tool => {
                        var option = document.createElement("option");
                        option.value = tool._id;
                        option.textContent = tool.name;
                        toolSelect.appendChild(option);
                    });
                } else {
                    // Om gruppen inte har några verktyg, meddela användaren eller hantera på annat sätt
                    console.log("Den valda gruppen har inga verktyg.");
                }
            })
            .catch(error => console.error('Fel vid hämtning av verktyg:', error));
    }
});
