import * as Msal from 'msal'
import { ref, computed } from '@vue/composition-api'
//import { reject } from 'core-js/fn/promise'
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
      redirectUri: process.env.VUE_APP_POSTLOGOUTREDIRECT,
      postLogoutRedirectUri: process.env.VUE_APP_POSTLOGOUTREDIRECT,
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  }
  console.log('Initializing AuthService')
  this.email = ref('')
  this.loggedIn = ref(false)

  this.toggleLoginText = computed(()=>{
    return (this.loggedIn.value ? `Sign out ${this.email.value}` : "Sign in")

  })
  this.app = new Msal.UserAgentApplication(this.msalConfig);
 
}

getToken() {
  console.log('getting jwt token...')
  return new Promise((resolve, reject) => {  
    this.app.acquireTokenSilent(this.tokenRequest)
    .then(authResponse => { 
      this.setLoggedIn(true,authResponse)
      resolve(authResponse)
    })
    .catch(error => {
      console.log("fallback to interaction when silent call fails", error)
      this.app.acquireTokenPopup(this.tokenRequest)
      .then(authResponse => {  
        this.setLoggedIn(true,authResponse)
        resolve(authResponse)
      })
      .catch(error => {
        this.setLoggedIn(false)
        reject(error)
      })
    })
  })
}

setLoggedIn(loggedIn, authResponse) {
  this.loggedIn.value = loggedIn
  this.email.value = ''
  if (loggedIn) {
    console.log("token acquired:",authResponse);
    if ( authResponse.idToken.claims.hasOwnProperty('emails') &&
      authResponse.idToken.claims.emails.length>0) {
      this.email.value = authResponse.idToken.claims.emails[0]
    }
    console.log('logged in as ', this.email.value)
  }
}

checkLoggedIn() {
  return new Promise((resolve, reject) => {  
    this.app.acquireTokenSilent(this.tokenRequest)
    .then(authResponse => { 
      this.setLoggedIn(true, authResponse)
      resolve(authResponse)
    })
    .catch(error => {
      this.setLoggedIn(false)
      console.log('failed to acquire token silently -> not logged in')
      reject(error)
    })
  })
}

ensureLoggedIn(vm) {
  return new Promise((resolve, reject) => {
    this.checkLoggedIn()
    .then(tokenResponse => {
      resolve( { tokenResponse: tokenResponse, message: null } )
    })
    .catch(() => {
      const message = `You need to be signed in to perform this operation. Do you want to sign in now?`
      vm.$bvModal.msgBoxConfirm(message,{
        title: 'Sign in'
      })
      .then(value => {
          if (value === true) {
            this.login().then(response => {
                resolve(response)
            })
            .catch(error => {
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

// signin and acquire a token silently with POPUP flow. Fall back in case of failure with silent acquisition to popup
login() {
  return new Promise((resolve, reject) => {
    this.app.loginPopup()
    .then(loginResponse => {
      console.log('loginPopup, loginResponse', loginResponse)
      this.getToken()
      .then(tokenResponse => {
        console.log('token aquired after login, tokenresponse:',tokenResponse)
        resolve( { tokenResponse: tokenResponse, message: `You are signed in as ${this.email.value}` } )
      })
      .catch(error  => {
        console.log('loginResponseError in loginPopup:', error);
        reject(new Error(`Login failed: ${error.message}`))
      })
    })
    .catch(error  => {
      console.log('loginResponseError getToken:', error);
      reject(new Error(`Login failed: ${error.message}`))
    })
  })
}
logout() {
    this.app.logout();
    this.setLoggedIn(false)
    return { message: "You are signed out" }
}
toggleLogin() {
  return new Promise((resolve, reject) => {
  this.checkLoggedIn()
  .then(() => {
    resolve(this.logout())
  })
  .catch(()=> {
    this.login()
    .then(response => {
      resolve(response)
    })
    .catch(error => {
      reject(error)
    })
  })
})
}
}
