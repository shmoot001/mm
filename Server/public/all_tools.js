document.addEventListener("DOMContentLoaded", function() {
    fetchAllTools();
});

function fetchAllTools() {
    fetch('/api/toolsWithGroups')
        .then(response => response.json())
        .then(data => {
            var toolsContainer = document.getElementById("toolsContainer");

            // Skapa ett objekt för att organisera verktygen efter grupper
            var groupedTools = {};

            data.forEach(tool => {
                // Kontrollera om tool.group är null innan du försöker komma åt name-egenskapen
                if (tool.group && tool.group.name) {
                    // Kontrollera om gruppen redan finns i objektet, annars skapa en ny array för gruppen
                    if (!groupedTools[tool.group.name]) {
                        groupedTools[tool.group.name] = [];
                    }

                    // Lägg till verktyget i den korrekta gruppen
                    groupedTools[tool.group.name].push(tool);
                }
                // Om tool.group är null eller om name-egenskapen inte finns, ignorera detta verktyg
                else {
                    console.error('Verktyget saknar grupp eller namn:', tool);
                }
            });

            // Loopa igenom varje grupp och rendera verktygen under respektive grupp
            Object.keys(groupedTools).forEach(groupName => {
                var groupTools = groupedTools[groupName];

                // Skapa en h1 för varje grupp
                var groupHeading = document.createElement("h1");
                groupHeading.textContent = groupName;
                toolsContainer.appendChild(groupHeading);

                // Skapa en tabell för verktygen i gruppen
                var table = document.createElement("table");
                table.classList.add("group-table");

                // Skapa tabellrubriker
                var tableHeader = document.createElement("thead");
                var headerRow = document.createElement("tr");
                var headers = ["Verktyg", "Märke", "Senast använd", "Diameter", "C/R/°", "Antal skär", "APMX", "RMPX", "Kommentar"];
                headers.forEach(headerText => {
                    var header = document.createElement("th");
                    header.textContent = headerText;
                    headerRow.appendChild(header);
                });
                tableHeader.appendChild(headerRow);
                table.appendChild(tableHeader);

                // Skapa tabellkropp
                var tableBody = document.createElement("tbody");
                groupTools.forEach(tool => {
                    var row = document.createElement("tr");
                    var toolName = document.createElement("td");
                    toolName.textContent = tool.name;
                    var brand = document.createElement("td");
                    brand.textContent = tool.brand;
                    var lastUsed = document.createElement("td");
                    lastUsed.textContent = tool.lastUsed;
                    var diameter = document.createElement("td");
                    diameter.textContent = tool.diameter;
                    var cr = document.createElement("td");
                    cr.textContent = tool.cr;
                    var numCutters = document.createElement("td");
                    numCutters.textContent = tool.numCutters;
                    var apmx = document.createElement("td");
                    apmx.textContent = tool.apmx;
                    var rmpx = document.createElement("td");
                    rmpx.textContent = tool.rmpx;
                    var comment = document.createElement("td");
                    comment.textContent = tool.comment;

                    // Lägg till cellerna i raden
                    row.appendChild(toolName);
                    row.appendChild(brand);
                    row.appendChild(lastUsed);
                    row.appendChild(diameter);
                    row.appendChild(cr);
                    row.appendChild(numCutters);
                    row.appendChild(apmx);
                    row.appendChild(rmpx);
                    row.appendChild(comment);

                    // Lägg till raden i tabellkroppen
                    tableBody.appendChild(row);
                });

                // Lägg till tabellkroppen i tabellen
                table.appendChild(tableBody);

                // Lägg till tabellen i toolsContainer
                toolsContainer.appendChild(table);
            });
        })
        .catch(error => console.error('Fel vid hämtning av verktyg:', error));
}
