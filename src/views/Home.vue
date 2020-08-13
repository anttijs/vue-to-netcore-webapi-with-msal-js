<template>
<div class="home">
  <br>
  <b-card-group deck>
    <b-card title="Frontend" sub-title="Vue.js" :img-src="require('../assets/vuejs.png')" img-alt="Frontend" img-top >
      <b-card-text align="left">
        The frontend is developed in Visual Studio Code using Vue single file components, Vue 3 composition api, 
        Vuex and Vue-router. For the UI, Bootstrapvue, Vue-font-awesome and vue-toasted libraries are used.
        Axios handles the webapi calls.
      </b-card-text>
      <b-card-text align="left">
        Msal.js library is used to implement OAuth 2.0 / OpenID Connect standards to sign in to Azure B2C, 
        from where jwt id and access tokens are obtained and used to gain access to the backend webapi.
      </b-card-text>
      <b-card-text align="left">
        Grid columns and form fields are dynamically created based on schema received from the backend. 
        There is only one grid view and Add/Edit view for all three entity types. The views are customized by using the schema.
      </b-card-text>
    </b-card>
    <b-card title="Backend" sub-title=".NET Core 3" :img-src="require('../assets/netcore.png')" img-alt="Backend" img-top>
      <b-card-text align="left">
        The backend is developed in Visual Studio 2019 using .Net Core 3 WebApi.
        EntityFrameWork Core is used for object/relational mapping. 
        EF Core code first approach generates the database creation scripts for SQL Server database.
        AutoMapper handles mappings between dto and datamodel classes. 
      </b-card-text>
      <b-card-text align="left">
        The backend uses jwt token authentication to protect the delete endpoints. Other endpoints (get, put, post) are public for testing purposes.
      </b-card-text>
      <b-card-text align="left">
        Backend uses reflection and attributes to generate a schema describing the object properties.
        The schema is passed to the frontend, which uses it to generate the UI.
      </b-card-text>
    </b-card>
    <b-card title="Hosting" sub-title="Microsoft Azure" :img-src="require('../assets/azure.png')" img-alt="Hosting" img-top>
      <b-card-text align="left">
        Both frontend and backend are hosted in the same Microsoft Azure AppService. 
        The database is an Azure Sql database. IIS has rewrite rules for SPA. 
      </b-card-text>
      <b-card-text align="left">
        Both frontend and backend are registered applications in Azure AD B2C.
        The backend exposes an api and the frontend is granted access for the api.
        Google is set up as an external identity provider or the user can sign up with a verified e-mail account.
      </b-card-text>
      <b-card-text align="left">
        Microsoft Devops is used for deploying the application to Azure.
        GIT is used for version control. I have put the sources to GitHub. 
        Check out the <b-link href="https://github.com/anttijs/vue-to-netcore-webapi-with-msal-js" target="_blank">frontend</b-link>
        and the <b-link href="https://github.com/anttijs/schemagenerator" target="_blank">backend.</b-link>
      </b-card-text>
    </b-card>
  </b-card-group>
</div>  
</template>

<script>
export default {
  name: 'Home',
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