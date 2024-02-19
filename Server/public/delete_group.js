document.addEventListener("DOMContentLoaded", function() {
    var deleteGroupForm = document.getElementById("deleteGroupForm");

    // Lägg till en händelselyssnare för formuläret för att radera en grupp
    deleteGroupForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Förhindra standardformulärsubmission

        var selectedGroup = document.getElementById("groupName").value;

        if (selectedGroup) {
            // Skicka en DELETE-förfrågan för att radera den valda gruppen
            raderaGrupp(selectedGroup);
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
function raderaGrupp(selectedGroup) {
    fetch('/api/groups/' + selectedGroup, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Gruppen har raderats.');
            // Återställ formuläret efter att gruppen har raderats
            document.getElementById("groupName").value = "";
            window.location.href = 'index.html';

        } else {
            alert('Ett fel uppstod vid radering av gruppen.');
        }
    })
    .catch(error => console.error('Fel vid radering av grupp:', error));
}
