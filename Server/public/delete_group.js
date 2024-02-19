document.addEventListener("DOMContentLoaded", function() {
    var deleteGroupForm = document.getElementById("deleteGroupForm");

    // Lägg till en händelselyssnare för formuläret för att radera en grupp
    deleteGroupForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Förhindra standardformulärsubmission

        var selectedGroup = document.getElementById("groupName").value;

        if (selectedGroup) {
            // Skicka en DELETE-förfrågan för att radera den valda gruppen
            deleteGroup(selectedGroup);
        } else {
            alert("Vänligen välj en grupp att radera.");
        }
    });

    // Ladda grupperna när sidan laddas
    laddaGrupper();
});

// Funktion för att hämta och fylla select-elementet med grupperna från databasen
function laddaGrupper() {
    var groupSelect = document.getElementById("groupName");

    fetch('/api/groups')
        .then(response => response.json())
        .then(groups => {
            groups.forEach(group => {
                var option = document.createElement("option");
                option.value = group._id; // Använd gruppid som värde för att radera gruppen senare
                option.textContent = group.name;
                groupSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Fel vid hämtning av grupper:', error));
}

// Funktion för att skicka en DELETE-förfrågan för att radera en grupp
function deleteGroup(groupName) {
    fetch(`/api/groups/${groupName}`, { // Använd rätt URL för DELETE-endpointen
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Gruppen har raderats framgångsrikt, vidta lämpliga åtgärder
            alert('Gruppen har raderats från databasen.');
        } else {
            // Det uppstod ett fel när gruppen skulle raderas
            alert('Ett fel uppstod när gruppen skulle raderas från databasen.');
        }
    })
    .catch(error => console.error('Fel vid radering av grupp:', error));
}
