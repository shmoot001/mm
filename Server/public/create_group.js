document.addEventListener("DOMContentLoaded", function() {
    var addGroupForm = document.getElementById("addGroupForm");

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

// Funktion för att skicka en POST-förfrågan för att lägga till en ny grupp
function sparaNyGrupp(gruppNamn) {
    fetch('/api/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: gruppNamn })
    })
    .then(response => {
        if (response.ok) {
            alert('Gruppen har lagts till.');
            // Återställ formuläret efter att gruppen har lagts till
            document.getElementById("newGroupName").value = "";
            // Navigera tillbaka till index.html efter att gruppen har lagts till
            window.location.href = 'index.html';
        } else {
            alert('Ett fel uppstod vid läggning av gruppen.');
        }
    })
    .catch(error => console.error('Fel vid läggning av grupp:', error));
}
