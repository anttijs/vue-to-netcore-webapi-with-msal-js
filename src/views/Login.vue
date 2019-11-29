<template>
  <div>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    login() {
      return new Promise((resolve, reject) => {
        this.$AuthService.signIn()
        .then(loginresponse => {
          this.$store.commit('setLoggedIn', true)
          resolve(loginresponse)
        })
        .catch(error => {
          this.$store.commit('setLoggedIn', false)
          reject(error)
        })
      })
    },
    logout() {
      return new Promise((resolve) => {
        this.$AuthService.logout()
        this.$store.commit('setLoggedIn', false)
        resolve()
      })
    }
  },
  created() {
    console.log('created')
    this.$AuthService.isLoggedIn().
    then(() => {
      console.log('logging out')
      this.logout().then(() => {
        console.log("go back after logout")
        //this.$router.go(-1)
      })
    })
    .catch(()=> {
      console.log('logging in')
      this.login().then(() => {
        console.log("go back after login")
        this.$router.push('home')
      })
    })
  }
};
</script>
