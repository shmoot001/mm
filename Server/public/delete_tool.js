document.addEventListener("DOMContentLoaded", function() {
    var deleteToolForm = document.getElementById("deleteToolForm");

    // Lägg till en händelselyssnare för formuläret för att radera ett verktyg
    deleteToolForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Förhindra standardformulärsubmission

        var selectedTool = document.getElementById("toolName").value;

        if (selectedTool) {
            // Skicka en DELETE-förfrågan för att radera det valda verktyget
            deleteTool(selectedTool);
        } else {
            alert("Vänligen välj ett verktyg att radera.");
        }
    });

    // Ladda verktygen när sidan laddas
    laddaVerktyg();
});

// Funktion för att hämta och fylla select-elementet med verktyg från databasen
function laddaVerktyg() {
    var toolSelect = document.getElementById("toolName");

    fetch('/api/toolsToDelete')
        .then(response => response.json())
        .then(tools => {
            tools.forEach(tool => {
                var option = document.createElement("option");
                option.value = tool._id; // Använd verktygsid som värde för att radera verktyget senare
                option.textContent = tool.name;
                toolSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Fel vid hämtning av verktyg:', error));
}

// Funktion för att skicka en DELETE-förfrågan för att radera ett verktyg
function deleteTool(toolId) {
    fetch('/api/deleteTool/' + toolId, { // Lägg till verktygets ID i URL:en
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Verktyget har raderats framgångsrikt, vidta lämpliga åtgärder
            alert('Verktyget har raderats från databasen.');
            window.location.href = 'index.html';
            
        } else {
            // Det uppstod ett fel när verktyget skulle raderas
            alert('Ett fel uppstod när verktyget skulle raderas från databasen.');
        }
    })
    .catch(error => console.error('Fel vid radering av verktyg:', error));
}

