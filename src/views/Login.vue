<template>
  <div>
  </div>
</template>

<script>
export default {
  name: "Login",
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // access to component instance via `vm`
      if (from.name !== 'Login') {
        vm.from = from
      }
      next()
    })
  },
  data() {  
    return { from: 'Home' }
  },
  methods: {
    login() {
      return new Promise((resolve, reject) => {
        this.$AuthService.signIn(this)
        .then(loginresponse => {
          resolve(loginresponse)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    logout() {
      return new Promise((resolve) => {
        this.$AuthService.logout(this)
        resolve()
      })
    }
  },
  created() {
    this.$AuthService.isLoggedIn(this)
    .then(() => {
      this.logout().then(() => {
        console.log("You are logged out, you will be redirected to home page by openId")
      })
    })
    .catch(()=> {
      this.login()
      .then(() => {
        console.log('You are logged in')
        this.$router.push(this.from)
      })
    })
  }
};
</script>
