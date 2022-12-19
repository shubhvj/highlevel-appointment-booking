<template>
  <div class="container">
    <h2>Pick a Date and Time</h2>
    <CalendarComponentVue />
  </div>
</template>

<script>
import CalendarComponentVue from './components/CalendarComponent.vue';
export default {
  data() {
    return {

    }
  },
  components: {
    CalendarComponentVue
  }
}
</script>

<style>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
