# vue-to-netcore-webapi-with-msal-js
The frontend is developed in Visual Studio Code using Vue single file components, Vue 3 composition api,
Vuex and Vue-router. For the UI, Bootstrapvue, Vue-font-awesome and vue-toasted libraries are used.
Axios handles the webapi calls.   

Msal.js library is used to implement OAuth 2.0 / OpenID Connect standards to sign in to Azure B2C, 
from where jwt id and access tokens are obtained and used to gain access to the backend webapi.   

Grid columns and form fields are dynamically created based on schema received from the backend. 
There is only one grid view and Add/Edit view for all three entity types. The views are customized by using the schema.  

## Project setup
```
npm install
```

Edit the files .env.development and .env.production and set your Azure settings there.  
In order to test the database, the backend needs to be running.

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
