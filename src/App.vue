<template>
  <b-container fluid id="app">
    <b-row>
      <b-col>
        <nav-main />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <router-view name="main"></router-view>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import NavMain from '@/components/NavMain';
export default {
  name: 'App',
  components: {
    NavMain
  }
};
</script>

<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
  
</style>
