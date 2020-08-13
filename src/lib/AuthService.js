import * as Msal from 'msal'
import { ref, computed } from '@vue/composition-api'
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

getToken(vm) {
  console.log('getting jwt token...')
  return new Promise((resolve, reject) => {  
    this.app.acquireTokenSilent(this.tokenRequest)
    .then(authResponse => { 
      this.setLoggedIn(true,vm,authResponse)
      resolve(authResponse)
    })
    .catch(error => {
      console.log("fallback to interaction when silent call fails", error)
      this.app.acquireTokenPopup(this.tokenRequest)
      .then(authResponse => {  
        this.setLoggedIn(true,vm,authResponse)
        resolve(authResponse)
      })
      .catch(error => {
        this.setLoggedIn(false,vm)
        reject(error)
      })
    })
  })
}

setLoggedIn(loggedIn, vm, authResponse) {
  this.loggedIn.value = loggedIn
  vm.$store.commit('setLoggedIn', loggedIn)
  this.email.value=''
  if (loggedIn) {
    console.log("token acquired:",authResponse);
    if ( authResponse.idToken.claims.hasOwnProperty('emails') &&
      authResponse.idToken.claims.emails.length>0) {
      this.email.value = authResponse.idToken.claims.emails[0]
    }
    console.log('logged in as ', this.email.value)
  }
}

checkLoggedIn(vm) {
  console.log("checkLoggedIn", vm)
  return new Promise((resolve, reject) => {  
    this.app.acquireTokenSilent(this.tokenRequest)
    .then(authResponse => { 
      this.setLoggedIn(true,vm,authResponse)
      resolve(authResponse)
    })
    .catch(error => {
      this.setLoggedIn(false,vm)
      console.log('failed to acquire token silently -> not logged in')
      reject(error)
    })
  })
}

ensureLoggedIn(vm) {
  return new Promise((resolve, reject) => {
    this.checkLoggedIn(vm)
    .then(tokenResponse => {
      resolve(tokenResponse)
    })
    .catch(() => {
      const message = `You need to be signed in to perform this operation. Do you want to sign in now?`
      vm.$bvModal.msgBoxConfirm(message,{
        title: 'Sign in'
      })
      .then(value => {
          if (value === true) {
            this.login(vm).then(loginResponse => {
                resolve(loginResponse)
            })
            .catch(error => {
              const txt = `Sign in failed with error: ${error}`
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

// signin and acquire a token silently with POPUP flow. Fall back in case of failure with silent acquisition to popup
login(vm) {
  return new Promise((resolve, reject) => {
    this.app.loginPopup()
    .then(loginResponse => {
      console.log('loginPopup, loginResponse', loginResponse)
      this.getToken(vm)
      .then(tokenResponse => {
        console.log('token aquired after login, tokenresponse:',tokenResponse)
        vm.$toasted.show(`You are signed in as ${this.email.value}`, { type: "success", duration: 3000 })
        resolve(tokenResponse)
      })
      .catch(error  => {
        console.log('loginResponseError in loginPopup:', error);
        reject(error)
      })
    })
    .catch(error  => {
      console.log('loginResponseError getToken:', error);
      reject(error)
    })
  })
}
logout(vm) {
  return new Promise((resolve) => {
    this.app.logout();
    this.setLoggedIn(false,vm)
    vm.$toasted.show('You are signed out!', { type: "success", duration: 3000 })
    resolve()
  })
}
toggleLogin(vm){
  console.log("toggleLogin",vm)
  this.checkLoggedIn(vm)
  .then(() => {
    this.logout(vm).then(() => {
      console.log("You are logged out, you will be redirected to home page by openId")
    })
  })
  .catch(()=> {
    console.log("not logged in, initializing login...")
    this.login(vm)
    .then(() => {
      console.log('You are logged in')
    })
  })
}
}

