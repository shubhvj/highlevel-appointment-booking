const moment = require('moment');
const db = require('../database/firestore');
const { collection, getDocs } = require("firebase/firestore");
const { generateTimeSlots } = require('../utility/generateTimeSlots');

const getFreeSlots = async (req, res) => {
    try {
        // check if document exists for any date falling between the startDate and endDate
        // if no, all the slots are available for dates between startDate and endDate
        // if yes, remove the slots and return the remaining slots

        let { startDate, endDate, timezone } = req.query;

        endDate = moment(parseInt(endDate)).format("YYYY-MM-DD");

        startDate = moment(parseInt(startDate)).startOf('month').format("YYYY-MM-DD");
        
        let next31Days = [];

        for (let i = 0; i < 31 - parseInt(startDate.substring(8)) + 1; i++) {
            const day = moment(startDate).add(i, 'days');
            if (day.get('day') != 0) {
                next31Days.push(day.format("YYYY-MM-DD"));
            }
        }

        const data = collection(db, 'events');
        const events = await getDocs(data);

        let bookedEventSlots = [];
        events.docs.map(doc => {
            if (doc.id.substring(0, 7).includes(startDate.toString().substring(0, 7))) {
                bookedEventSlots.push(new Object({ date: doc.id, slots: doc.data().slots }))
            }
        });

        let generatedEventsSlots = next31Days.map(date => {
            return new Object({ date, slots: generateTimeSlots(startDate, timezone) });
        });

        if (bookedEventSlots.length != 0) {
            generatedEventsSlots.map(genSlot => {
                bookedEventSlots.map(bookedSlot => {
                    if (genSlot.date == bookedSlot.date) {
                        // console.log(genSlot.date, bookedSlot.date, bookedSlot.slots, genSlot.slots);
                        genSlot.slots = genSlot.slots.filter(time => {
                            // time = moment().tz(time, timezone).format("HH:mm");
                            return !bookedSlot.slots.includes(time);
                        })
                    }
                })
            });

        }

        res.send(generatedEventsSlots);

    } catch (error) {
        console.log('Error retrieving records.');
        res.status(400).send('Error retrieving records')
    }
}
module.exports = { getFreeSlots };