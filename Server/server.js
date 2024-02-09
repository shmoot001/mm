const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Anslut till MongoDB-databas. Byt ut URL:en mot din egen.
mongoose.connect(process.env.MONGODB_URI);

// Skapa en modell för grupper
const Group = mongoose.model('Group', { name: String });

// Skapa en modell för verktyg
const Tool = mongoose.model('Tool', {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    name: String,
    lastUsed : String, //Märke
    brand : String,
    diameter : String,
    cr: String, ///C/R/°
    numCutters : String,
    apmx : String,
    rmpx : String,
    comment : String
    // Lägg till andra fält för MÄRKE, SENAST, ⌀, C/R/°, ANTAL SKÄR, APMX, RMPX, KOMMENTAR här
});

// API-endpunkt för att hämta alla grupper
app.get('/api/groups', async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ändra API-endpunkten för att hämta verktyg så att den tar emot en parameter för gruppen
app.get('/api/tools', async (req, res) => {
    try {
        // Hämta den valda gruppen från förfrågan
        const selectedGroup = req.query.group;

        // Filtrera verktygen baserat på den valda gruppen
        const tools = await Tool.find({ group: selectedGroup }).populate('group');
        
        res.status(200).json(tools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Ny route för add_tool.html
app.get('/add_tool.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_tool.html'));
});

// API-endpunkt för att skapa en ny grupp
app.post('/api/groups', async (req, res) => {
    try {
        const { name } = req.body;
        const group = new Group({ name });
        await group.save();
        res.status(201).json({ success: true, message: 'Grupp tillagd' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// API-endpunkt för att skapa ett nytt verktyg
app.post('/api/tools', async (req, res) => {
    try {
        const {
            group,
            name,
            brand,
            lastUsed,
            diameter,
            cr,
            numCutters,
            apmx,
            rmpx,
            comment
        } = req.body;

        const tool = new Tool({
            group,
            name,
            brand,
            lastUsed,
            diameter,
            cr,
            numCutters,
            apmx,
            rmpx,
            comment
        });

        await tool.save();
        res.status(201).json({ success: true, message: 'Verktyg tillagt' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// API-endpunkt för att lägga till verktyg i tabellen
app.post('/api/add-tool', async (req, res) => {
    try {
        const { group, tool, row } = req.body;

        // Hämta verktygsdata baserat på det valda verktyget
        const selectedTool = await Tool.findById(tool);

        // Hitta rätt rad i tabellen baserat på det valda radnumret
        const selectedRow = parseInt(row);

        // Uppdatera den valda raden med verktygsdatan
        const toolData = [
            selectedTool.name,
            selectedTool.brand,
            selectedTool.lastUsed,
            selectedTool.diameter,
            selectedTool.cr,
            selectedTool.numCutters,
            selectedTool.apmx,
            selectedTool.rmpx,
            selectedTool.comment
        ];

        const updatedRow = await Tool.findOneAndUpdate(
            { _id: group }, 
            { $set: { [`tool${selectedRow}`]: toolData } }, 
            { new: true }
        );

        res.status(201).json({ success: true, message: 'Verktyget har lagts till i tabellen.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// Starta servern
app.listen(PORT, () => {
    console.log(`Server lyssnar på port ${PORT}`);
});
