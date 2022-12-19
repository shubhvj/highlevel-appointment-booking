const db = require('../database/firestore');
const moment = require("moment")
const { doc, collection, setDoc, getDocs, updateDoc } = require("firebase/firestore");

const createEvent = async (req, res) => {
    try {
        const { date, slot } = req.body;
        const data = collection(db, "events");
        if(!date || !slot) {
            res.status(503).send("Dat or Slot time missing");
        }
        let events = await getDocs(data);
        let slots = []
        events.docs.filter(doc => {
            if (doc.id == date) {
                slots.push(doc.data());
            }
        });

        if (slots.length > 0) {
            slots = slots[0].slots;
            if (!slots.includes(slot[0])) {
                slots.push(...slot);
                slots = new Set(slots);
                slots = [...slots];
                await updateDoc(doc(db, '/events', date), {
                    slots: slots
                }, { merge: true });
                res.status(200).send("Appointment Created.");
            } else {
                res.status(422).send("Appointment already exists.");
            }

        } else {
            setDoc(doc(db, "/events", date), {
                slots: slot
            })
            res.status(200).send("Appointment Created.");
        }
    } catch (error) {
        res.status(400).send("Something went wrong.")
    }

}

const getEvents = async (req, res) => {

   try {
    
    let { startDate, endDate } = req.query;
    startDate = moment(parseInt(startDate)).format("YYYY-MM-DD");
    endDate = moment(parseInt(endDate)).format("YYYY-MM-DD");

    if(endDate <= startDate) {
        res.status(400).send("Invalid arguemnts passed.");
        return;
    }
    const data = collection(db, "events");

    let events = await getDocs(data);
    let slots = []
    events.docs.filter(doc => {
        if (doc.id >= startDate && doc.id <= endDate) {
            let dateTimeSlots = {};
            dateTimeSlots.date = doc.id;
            dateTimeSlots.slots = doc.data().slots;
            slots.push(dateTimeSlots);
        }
    });

    if(slots.length == 0) {
        res.status(200).send("No Appointments found.");
        return;
    }
    res.status(200).send(slots);

   } catch (error) {
        res.status(400).send("Something went wrong.")
   }
    
}

module.exports = {
    createEvent, getEvents
}