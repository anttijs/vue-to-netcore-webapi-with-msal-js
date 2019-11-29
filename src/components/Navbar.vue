<template>
  <b-navbar
    toggleable="sm"
    type="dark"
    variant="primary">
    <b-navbar-nav>
      <b-nav-item  exact-active-class="active" :to="{name: 'home'}">Home</b-nav-item>
      <b-nav-item  exact-active-class="active" :active="$route.path.includes('Database')" to="/Database">Database</b-nav-item>
      <b-nav-item  exact-active-class="active" :to="{name: 'Login'}">{{ loginText }}</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
export default {
  name: 'Navbar',
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn
    },
    loginText() {
      if (this.loggedIn === true) {
        return "Sign out"
      }
      return "Sign in"
    }
  },
  data() {
    return { isLoggedIn: false }
  },
  created() {
    this.$AuthService.isLoggedIn().then(() => {
      console.log("signin initial state is", this.$AuthService.loggedIn)
      this.$store.commit('setLoggedIn', this.$AuthService.loggedIn)
    })
    .catch((error) => {
      console.log("signin initial state is false", error)
      this.$store.commit('setLoggedIn', false)
      
    })
  }
};
</script>
