<template>
<div class="home">
    <br>
    <b-card-group deck>
          <b-card title="Frontend" sub-title="Vue.js" :img-src="require('../assets/vuejs.png')" img-alt="Frontend" img-top >
            <b-card-text>
              Frontend developed in Visual Studio Code using Vue single file components, 
              Vuex, Vue-router, Bootstrapvue, Vue-font-awesome and Axios. 
              Grid columns and form fields are dynamically created based on schema received from Backend.
              Vue uses Msal.js library to implement OAuth 2.0 / OpenID Connect standards to sign in to Azure B2C 
              and obtains jwt id tokens and access tokens to be used against the Backend webapi delete methods. Other api-methods are public.
            </b-card-text>
          </b-card>
          <b-card title="Backend" sub-title=".NET Core 3" :img-src="require('../assets/netcore.png')" img-alt="Backend" img-top>
          <b-card-text>
            Backend developed in Visual Studio 2019 using .Net Core WebApi and EntityFrameWork Core.
            AutoMapper is used for mappings between dto and datamodel classes. 
            Backend uses reflection and attributes to generate a schema describing the object properties.
            The schema is passed to the frontend, which uses it to generate the UI.
            The backend protects the delete methods by checking that the http request contains the correct jwt access tokens.
          </b-card-text>
        </b-card>
          <b-card title="Hosting" sub-title="Microsoft Azure" :img-src="require('../assets/azure.png')" img-alt="Hosting" img-top>
          <b-card-text>
            Both frontend and backend are hosted in Microsoft Azure as a WebApp and registered in Azure AD B2C. 
            The database is an Azure Sql database. IIS has rewrite rules for SPA. 
            In Azure AD B2C, the backend exposes an api and the frontend is granted access for the api.
            Google is set up as an external identity provider or the user can sign up with an e-mail account, which is verified.
            Microsoft Devops is used for deplying the application to Azure and GIT for version control.
          </b-card-text>

        </b-card>
    </b-card-group>
</div>  
</template>

<script>
export default {
  name: 'home',
  components: {

  }
}
</script>
<style scoped>
.card-img-top {
    width: 100%;
    height: 15vw;
    object-fit: scale-down;
}
</style>