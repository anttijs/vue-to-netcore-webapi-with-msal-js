import * as Msal from 'msal'

export default class AuthService {
  constructor() {
    // The current application coordinates were pre-registered in a B2C tenant.
    this.appConfig = {
      b2cScopes: [process.env.VUE_APP_B2CSCOPES]
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
            clientId: process.env.VUE_APP_CLIENTID, 
            authority: process.env.VUE_APP_AUTHORITY, 
            validateAuthority: false,
            postLogoutRedirectUri: process.env.VUE_APP_POSTLOGOUTREDIRECT
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true
        }
    }
    console.log('Initializing AuthService')
    this.email=''
    this.app = new Msal.UserAgentApplication(this.msalConfig);
  }

// signin and acquire a token silently with POPUP flow. Fall back in case of failure with silent acquisition to popup
signIn(vm) {
  console.log('Authservice.signin:', this)
  return new Promise((resolve, reject) => {
    this.app.loginPopup().then(loginResponse => {
      console.log('loginPopup:', loginResponse)
      this.getToken(vm).then(tokenResponse => {
        console.log('token aquired after signIn')
        vm.$toasted.show(`You are signed in as ${this.email}`, { type: "success", duration: 3000 })
        resolve(tokenResponse)
      })
      .catch(error  => {
        console.log('loginResponseError in loginPopup:', error);
        reject(error)
      })
    }).catch(error  => {
      console.log('loginResponseError getToken:', error);
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
      this.setLoggedIn(authResponse,vm)
      resolve(authResponse)
    })
    .catch(error => {
      console.log("fallback to interaction when silent call fails", error);
      this.app.acquireTokenPopup(this.tokenRequest)
      .then(authResponse => {  
        this.setLoggedIn(authResponse,vm)
        resolve(authResponse)
      })
      .catch(error => {
        vm.$store.commit('setLoggedIn', false)
        reject(error)
      })
    })
  })
}
setLoggedIn(authResponse, vm) {
  console.log("token acquired:",authResponse);
  if ( authResponse.idToken.claims.hasOwnProperty('emails') &&
    authResponse.idToken.claims.emails.length>0) {
    this.email = authResponse.idToken.claims.emails[0]
  }
  console.log('logged in as ', this.email)
  vm.$store.commit('setLoggedIn', true)
}

isLoggedIn(vm) {
  return new Promise((resolve, reject) => {  
    this.app.acquireTokenSilent(this.tokenRequest)
    .then(authResponse => { 
      this.setLoggedIn(authResponse,vm)
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
                      vm.$toasted.show(txt, { type: "error", duration: 5000 })
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
logout(vm) {
  console.log('Authservice.signin:', this)
  this.app.logout();
  vm.$store.commit('setLoggedIn', false)
  vm.$toasted.show('You are signed out!', { type: "success", duration: 3000 })
  this.loggedIn = false
  this.email=''
}
}

