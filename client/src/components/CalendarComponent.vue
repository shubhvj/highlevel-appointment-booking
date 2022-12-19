<template>
    <div class="main">
        <div class="calendar-flex">
            <Datepicker v-model="date" inline auto-apply :min-date="new Date()" :disabled-week-days="[0]" week-start="0"
                :enable-time-picker="false" @update:model-value="updateSelectedDateTimeSlot()"
                @update-month-year="updateSelectedDateTimeSlot()" :monthChangeOnArrows=true
                :monthChangeOnScroll=false />
            <div class="slots-flex">
                <button v-for="(value, key) in this.currentDaySlots" :key="key" @click="createEvent(value)">
                    {{ convertToAmPm(value) }}
                </button>
            </div>
        </div>
    </div>
    <br>
    <br>
    <select v-model="timezone" name="timezone" id="timezone" @change="getFreeSlots(value)">
        <option v-for="(value, key) in this.timezones" :key="key">{{ value }}</option>
    </select>
    <h3>Current Date selected: {{ this.currentDate }}</h3>
    <h4 v-if="isNoAppointment">No Appointment slots available for selected Date: {{ this.currentDate }}</h4>
    <footer class="footer"><a href="https://shubhjohri.netlify.app/">made by Shubh </a></footer>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
const moment = require('moment');

export default {
    components: {
        Datepicker
    },
    data() {
        const currentDaySlots = [];
        const slotData = [];
        const date = ref(new Date());
        const todaysDate = new Date();
        const timezone = ref("Asia/Dhaka");
        const mySlots = [];
        const timezones = [
            'Pacific/Midway', // -11
            'America/Adak', // -10,
            'Pacific/Gambier', // -9
            'America/Los_Angeles', // -8
            'America/Denver', // -7
            'America/Chicago', // -6
            'America/New_York', // -5
            'America/Santiago', // -4
            'America/Sao_Paulo', // -3
            'America/Noronha', // -2
            'Atlantic/Cape_Verde', // -1
            'UTC', // utc
            'Europe/Brussels', //+1
            'Africa/Cairo', // +2
            'Europe/Minsk', // +3
            'Europe/Moscow', // +4
            'Asia/Tashkent', // +5
            'Asia/Dhaka', // +6
            'Asia/Novosibirsk', // +7
            'Australia/Perth', // +8
            'Asia/Tokyo', // +9
            'Australia/Hobart', // +10
            'Asia/Vladivostok', // +11
            'Pacific/Auckland', // +12
        ];
        return {
            date,
            timezone,
            timezones,
            slotData,
            todaysDate,
            message: "Please select a date to see Timeslots.",
            currentDaySlots,
            mySlots,
            currentDate: moment(this.date).format("YYYY-MM-DD"),
            isTimeZoneChanged: false,
            eventBooked: false,
            isNoAppointment: false
        }
    },
    watch: {
        timezone(newTimezone, oldTimezone) {
            if (newTimezone != oldTimezone) {
                this.isTimeZoneChanged = true;
                this.getFreeSlots();
            }
        },
        currentDaySlots() {
            if (this.currentDaySlots.length != 0) {
                this.isNoAppointment = false;
            }
        }
    },
    methods: {
        convertToAmPm(time) {
            if(!time) {
                return;
            }
            let hour = time.substring(0, 2);
            let minutes = time.substring(3);
            let suffix = "";
            if (hour > 11) {
                suffix = "PM";
                if(hour != 12) {
                    hour = hour % 12;
                }
                time = hour + ":" + minutes + " " + suffix;
            } else {
                suffix = "AM";
                time = hour + ":" + minutes + " " + suffix;
            }
            return time;
        },
        checkIfSlotsExist() {
            if (this.isTimeZoneChanged) {
                return false;
            }
            const formattedDate = moment(this.date).format("YYYY-MM-DD");
            if (this.slotData.length == 0) {
                return false;
            }
            let flag;
            this.slotData.map(slot => {
                if (slot.date == formattedDate) {
                    flag = true;
                }
            });
            return flag;
        },
        async updateSelectedDateTimeSlot() {
            const formattedDate = moment(this.date).format("YYYY-MM-DD");
            this.currentDate = moment(this.date).format("YYYY-MM-DD");
            let flag;
            this.slotData.map(slot => {
                if (slot.date == formattedDate) {
                    this.currentDaySlots = slot.slots;
                    this.setIsAppointment();
                    flag = true;
                }
            });

            if (!flag) {
                await this.apiCall();
            }

        },
        async getFreeSlots() {
            const flag = this.checkIfSlotsExist();
            if (flag) {
                return;
            }
            await this.apiCall();


        },
        async createEvent(value) {
            try {
                let date = moment(this.date).format("YYYY-MM-DD");
                let res = await fetch(`${process.env.VUE_APP_API_URL}`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        date: date,
                        slot: [value]
                    })
                });
                await this.apiCall();
                value = this.convertToAmPm(value);
                alert(`Appointment Created for - ${date} ${value}`);
                console.log(this.date, value, res);
            } catch (error) {
                console.log("Something went wrong.")
            }
        },
        async apiCall() {
            this.isNoAppointment = false;
            const timeInSeconds = this.date.getTime();
            let res = await fetch(`${process.env.VUE_APP_API_URL}slots?startDate=${timeInSeconds}&timezone=${this.timezone}`).then(response => {
                return response.json()
            });
            this.slotData = res;

            this.currentDaySlots = this.slotData.find(slot => {
                if (slot.date == moment(this.date).format("YYYY-MM-DD")) {
                    this.currentDate = moment(this.date).format("YYYY-MM-DD");
                    return slot;
                }
            });
            this.currentDaySlots = this.currentDaySlots.slots;
            this.setIsAppointment();
        },
        setIsAppointment() {
            if (this.currentDaySlots.length == 0) {
                this.isNoAppointment = true;
            } else {
                this.isNoAppointment = false;
            }
        }
    },
    async mounted() {
        await this.getFreeSlots();
        this.convertToAmPm();
    }

}
</script>

<style scoped>
.main {
    display: flex;
    justify-content: center;
}

.calendar-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.slots-flex {
    display: flex;
    flex-direction: row;
    padding: 10px;
}

button {
    background: none;
    border: 1px solid black;
    padding: 6px 8px;
    color: rgb(41, 43, 43);
    cursor: pointer;
}

button:hover {
    background-color: #1976d2;
}

.footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    background: PapayaWhip;
}
</style>