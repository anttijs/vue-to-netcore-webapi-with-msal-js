<template>
  <b-container>
    <br/>
    <b-row>
      <b-col>
        <b-card title="About me" align="left">
          <b-card-text align="left">
            I'm a {{ profession }} working as a private IT-consultant. 
            I have worked for {{years}} years in software development and have experience with
            Javascript, Jquery, .Net Core, EF Core, mySQL and SQL Server. I mainly work with C# and C++. 
          </b-card-text>
          <b-card-text align="left">
            I have studied Information Systems Science and graduated as a Master of Science in Economics from the University of Jyväskylä. 
            You can contact me at <a :href ="emailLink">{{email}}</a>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { ref, computed } from '@vue/composition-api'
export default {
  name: 'About',
  setup() {
    const profession = ref("Full stack developer")
    const email = ref("antti.stoor@hotmail.com")
    const emailLink = computed(() => "mailto:" + email.value)
    const years = computed(()=> new Date().getFullYear()-1994)
    
    return {
      profession, email, emailLink, years
    }
  }
};
</script>
