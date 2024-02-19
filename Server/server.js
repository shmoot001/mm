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

const SetSchema = new mongoose.Schema({
    tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
    id: {
        type: Number,
        unique: true, // Garantera att id är unikt
        required: true // Kräv ett id för varje Set
    }
});

// Pre-save hook för att kontrollera om ett Set med samma ID redan finns
SetSchema.pre('save', async function (next) {
    try {
        const existingSet = await this.constructor.findOne({ id: this.id });
        if (existingSet) {
            throw new Error('Ett Set med detta ID finns redan. Vänligen välj ett annat ID.');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Set = mongoose.model('Set', SetSchema);


// Ny API-endpunkt för att hämta datan från Set-modellen
app.get('/api/sets', async (req, res) => {
    try {
        // Hämta all data från Set-modellen
        const sets = await Set.find().populate('tool');
        // Returnera datan som JSON
        res.status(200).json(sets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/api/toolsWithGroups', async (req, res) => {
    try {
        const tools = await Tool.find().populate('group');
        res.status(200).json(tools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// Definiera en API-rutt för att radera en rad från databasen
app.delete('/api/deleteSet/:setId', async (req, res) => {
    const { setId } = req.params;

    try {
        // Hitta och radera setet från databasen baserat på set._id
        const deletedSet = await Set.findOneAndDelete({ _id: setId });

        if (deletedSet) {
            res.status(200).json({ message: 'Raden har tagits bort.' });
        } else {
            res.status(404).json({ error: 'Setet hittades inte.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ett fel uppstod vid borttagning av raden.' });
    }
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


// Server.js
app.delete('/api/groups/:id', async (req, res) => { // Ändra från '/api/deleteGroup' till '/api/groups/:id'
    try {
      const group = await Group.findByIdAndDelete(req.params.id); // Använd req.params.id för att hämta gruppid från URL
      if (!group) return res.status(404).send('Gruppen kunde inte hittas.');
  
      res.send('Gruppen har tagits bort.');
    } catch (err) {
      res.status(500).send('Ett fel uppstod när gruppen skulle tas bort.');
    }
});

// DELETE-endpunkt för att radera ett verktyg
app.delete('/api/deleteTool/:id', async (req, res) => {
    try {
        const toolId = req.params.id;

        // Hitta och radera verktyget från databasen baserat på det angivna ID:et
        const deletedTool = await Tool.findByIdAndDelete(toolId);

        if (!deletedTool) {
            return res.status(404).send('Verktyget kunde inte hittas.');
        }

        res.status(200).send('Verktyget har raderats.');
    } catch (error) {
        res.status(500).send('Ett fel uppstod vid radering av verktyg:' + error);
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

app.get('/api/toolsToDelete', async (req, res) => {
    try {
        // Hämta alla verktyg från databasen
        const tools = await Tool.find();

        // Returnera verktygen som JSON-svar
        res.json(tools);
    } catch (error) {
        // Om det uppstår ett fel, skicka ett felmeddelande till klienten
        res.status(500).json({ message: 'Ett fel uppstod vid hämtning av verktyg', error: error.message });
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

// API-endpunkt för att lägga till ett verktyg i databasen och uppdatera set
app.post('/api/addToSet', async (req, res) => {
    try {
        const { group, tool, row } = req.body;

        // Hämta verktygsdata baserat på det valda verktyget
        const selectedTool = await Tool.findById(tool);

        // Uppdatera set med det nya verktyget
        const set = new Set({
            tool: selectedTool,
            id: row
        });

        // Spara set i databasen
        await set.save();

        res.status(201).json({ success: true, message: 'Verktyget har lagts till i tabellen.' });
    } catch (error) {
        console.error('Fel vid läggning av verktyg i tabellen:', error);
        res.status(500).json({ success: false, message: 'Ett fel uppstod vid läggning av verktyget i tabellen.' });
    }
});

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
