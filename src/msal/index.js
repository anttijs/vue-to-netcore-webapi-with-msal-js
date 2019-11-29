import * as Msal from 'msal'

export default class AuthService {
  constructor() {
    // The current application coordinates were pre-registered in a B2C tenant.
    this.appConfig = {
      b2cScopes: ["https://oteohjelmistot.onmicrosoft.com/api/Database.CRUD"]
    }
    // request to signin - returns an idToken
    this.loginRequest = {
      scopes: this.appConfig.b2cScopes
    }
    // request to acquire a token for resource access
    this.tokenRequest = {
      scopes: this.appConfig.b2cScopes
    }
    // configuration to initialize msal
    this.msalConfig = {
        auth: {
            clientId: "f612602a-9c45-4f0f-b7b7-e18b0f9430b5", //This is your client ID
            authority: "https://oteohjelmistot.b2clogin.com/oteohjelmistot.onmicrosoft.com/b2c_1_otev2", //This is your tenant info
            validateAuthority: false,
            postLogoutRedirectUri: process.env.VUE_APP_POSTLOGOUTREDIRECT
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true
        }
    }
    console.log('Initializing AuthService')
    // instantiate MSAL
    this.app = new Msal.UserAgentApplication(this.msalConfig);
  }
  user() {
    var x = this.app.getAccount()
    if (x === null || x === undefined) {
      return null
    }
    if (!(x.user === null || x.user === undefined)) {
      return x.user
    }
    if (!(x.userName === null || x.userName === undefined)) {
      return x.userName
    }
    return null
  }
  getTime() {
    var time = new Date();
    return (
    ("0" + time.getHours()).slice(-2)   + ":" + 
    ("0" + time.getMinutes()).slice(-2) + ":" + 
    ("0" + time.getSeconds()).slice(-2) + "." + 
    ("0" + time.getMilliseconds()).slice(-2)
    )
  }

// signin and acquire a token silently with POPUP flow. Fall back in case of failure with silent acquisition to popup
signIn(vm) {
  return new Promise((resolve, reject) => {
    this.app.loginPopup().then(loginResponse => {
      console.log('loginPopup:', loginResponse)
      this.getToken(vm).then(tokenResponse => {
        console.log('token aquired after signIn')
        resolve(tokenResponse)
      })
      .catch(error  => {
        console.log('loginResponseError:', error);
        reject(error)
      })
    }).catch(error  => {
      console.log('loginResponseError:', error);
      reject(error)
    })
  })
}
//acquire a token silently
getToken(vm) {
  console.log('getting jwt token...')
  return new Promise((resolve, reject) => {  
    this.app.acquireTokenSilent(this.tokenRequest)
    .then(authResponse => { 
      vm.$store.commit('setLoggedIn', true)
      console.log("token acquired:",authResponse);
      resolve(authResponse)
    })
    .catch(error => {
      console.log("fallback to interaction when silent call fails", error);
      this.app.acquireTokenPopup(this.tokenRequest)
      .then(tokenResponse => {
        vm.$store.commit('setLoggedIn', true)
        resolve(tokenResponse)
      })
      .catch(error => {
        vm.$store.commit('setLoggedIn', false)
        reject(error)
      })
    })
  })
}

isLoggedIn(vm) {
  return new Promise((resolve, reject) => {  
    this.app.acquireTokenSilent(this.tokenRequest)
    .then(authResponse => { 
      vm.$store.commit('setLoggedIn', true)
      console.log('acquired token silently -> logged in')
      resolve(authResponse)
    })
    .catch(error => {
        this.loggedIn = false
        console.log('failed to acquire token silently -> not logged in')
        reject(error)
    })
  })
}

ensureLoggedIn(vm) {
  return new Promise((resolve, reject) => {
      this.isLoggedIn(vm).then(tokenResponse => {
          resolve(tokenResponse)
      })
      .catch(() => {
          let message = `You need to be signed in to perform this operation. Do you want to sign in now?`
          vm.$bvModal.msgBoxConfirm(message,{
          title: 'Sign in'
          })
          .then(value => {
              if (value === true) {
                  this.signIn(vm).then(loginResponse => {
                      resolve(loginResponse)
                  })
                  .catch(error => {
                      let txt = `Sign in failed with error: ${error}`
                      vm.$toasted.show(txt, { type: "error", duration: null })
                      reject(error)
                  })
              }
          })
          .catch(error => {
              reject(error)
          })
      })
  })
}

// signout the user
logout(vm) {
  // Removes all sessions, need to call AAD endpoint to do full logout
  this.app.logout();
  vm.$store.commit('setLoggedIn', false)
  this.loggedIn = false
}
}

