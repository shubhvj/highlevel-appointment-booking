require("./database/firestore");
const Express = require('express');
const bodyParser = require('body-parser');
const app = Express();
const cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));
app.use(Express.json());
app.use(bodyParser.json());
const config = require('./config');
const PORT = config.port;

const slots = require("./controllers/slots.controller");
const events = require("./controllers/events.controller");

const getSlots = (req, res) => {
    console.log(req.url);
    slots.getFreeSlots(req, res);
}

const createEvent = (req, res) => {
    console.log(req.url);
    events.createEvent(req, res);
}

const getEvents = (req, res) => {
    console.log(req.url);
    events.getEvents(req, res);
}

app.post('/', createEvent);
app.get('/slots', getSlots);
app.get('/events', getEvents);

app.all('*', (req, res) => {
    res.send("Invalid endpoint");
})

app.listen(PORT, () => {
    console.log(`Server started at: ${PORT}`);
})