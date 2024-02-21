document.addEventListener("DOMContentLoaded", function() {
    var toolTypeSelect = document.getElementById("toolType");
    var addToolForm = document.getElementById("addToolForm");

    // Hämta grupperna från databasen vid sidbelastning
    updateGroupOptions();

    // Lägg till en händelselyssnare för formuläret för att lägga till ett nytt verktyg
    addToolForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Förhindra standardformulärsubmission

        var selectedGroup = toolTypeSelect.value;
        var toolName = document.getElementById("toolName").value;
        var toolBrand = document.getElementById("toolBrand").value;
        var toolLastUsed = document.getElementById("toolLastUsed").value;
        var toolDiameter = document.getElementById("toolDiameter").value;
        var toolCR = document.getElementById("toolCR").value;
        var toolNumCutters = document.getElementById("toolNumCutters").value;
        var toolAPMX = document.getElementById("toolAPMX").value;
        var toolRMPX = document.getElementById("toolRMPX").value;
        var toolComment = document.getElementById("toolComment").value;
        var toolSort = document.getElementById("toolSort").value;

        // Skicka en POST-förfrågan till servern för att lägga till det nya verktyget
        sparaNyttVerktyg(selectedGroup, toolName, toolBrand, toolLastUsed, toolDiameter, toolCR, toolNumCutters, toolAPMX, toolRMPX, toolComment);
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
                    toolTypeSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Fel vid hämtning av grupper:', error));
    }

    // Funktion för att spara nytt verktyg i databasen
    function sparaNyttVerktyg(selectedGroup, toolName, toolBrand, toolLastUsed, toolDiameter, toolCR, toolNumCutters, toolAPMX, toolRMPX, toolSort, toolComment) {
        // Skicka en POST-förfrågan till servern för att lägga till det nya verktyget
        fetch('/api/tools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group: selectedGroup,
                name: toolName,
                brand: toolBrand,
                lastUsed: toolLastUsed,
                diameter: toolDiameter,
                cr: toolCR,
                numCutters: toolNumCutters,
                apmx: toolAPMX,
                rmpx: toolRMPX,
                sort: toolSort,
                comment: toolComment
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Eventuell logik för att hantera lyckad tillägg
                console.log('Verktyg tillagt framgångsrikt');
                window.location.href = 'index.html';
                
            } else {
                // Eventuell logik för att hantera fel
                console.error('Det uppstod ett fel när du försökte lägga till verktyget.');
            }
        })
        .catch(error => {
            console.error('Fel vid POST-förfrågan:', error);
            alert('Ett oväntat fel uppstod.');
        });
    }
});
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
function navigateToShowTools(){
    window.location.href = 'all_tools.html';
}
function navigateToSelectedTools(){
    window.location.href = 'selected_tool.html';
}