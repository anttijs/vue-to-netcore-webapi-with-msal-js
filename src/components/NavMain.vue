<template>
  <b-navbar
    toggleable="sm"
    type="dark"
    variant="primary">
    <b-navbar-nav>
      <b-nav-item  exact-active-class="active" :to="{name: 'Home'}">Home</b-nav-item>
      <b-nav-item  exact-active-class="active" :active="$route.path.includes('Database')" :to="{name: 'RouteForList', params: { title: titleForList }}">Database</b-nav-item>
      <b-nav-item  exact-active-class="active" :to="{name: 'About'}">About</b-nav-item>
    </b-navbar-nav>
    <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-button exact-active-class="active" variant="primary" 
          @click="toggleLogin()">{{ $AuthService.toggleLoginText.value }}</b-button>
        </b-nav-form>
      </b-navbar-nav>
  </b-navbar>
</template>
<script>
import { useNaming } from '@/lib/CRUDService'
export default {
  name: 'NavMain',
  props: {
  },
  setup(props, context) {
    const { titleForList } = useNaming(context)
    const toggleLogin = () => {
      context.root.$AuthService.toggleLogin(context.root)
    }
    //refresh signed in status
    context.root.$AuthService.checkLoggedIn(context.root)
    return { toggleLogin, titleForList }
  }
}
</script>
