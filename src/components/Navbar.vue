<template>
  <b-navbar
    toggleable="sm"
    type="dark"
    variant="primary">
    <b-navbar-nav>
      <b-nav-item  exact-active-class="active" :to="{name: 'home'}">Home</b-nav-item>
      <b-nav-item  exact-active-class="active" :active="$route.path.includes('Database')" to="/Database">Database</b-nav-item>
      <b-nav-item  exact-active-class="active" :to="{name: 'Login'}" replace>{{ loginText }}</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
export default {
  name: 'Navbar',
  computed: {
    loginText() {
      if (this.$store.state.loggedIn === true) {
        return "Sign out"
      }
      return "Sign in"
    }
  },
  created() {
    //refresh signed in status
    this.$AuthService.isLoggedIn(this)
  }
};
</script>
