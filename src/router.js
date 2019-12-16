import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import About from '@/views/About.vue'
import ListDTOs from '@/components/ListDTOs.vue'
import EditDTO from '@/components/EditDTO.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { 
      path: '', 
      name: 'Home', 
      components: {
        default: Home,
        main: Home
      } 
    },
    { 
      path: '/', 
      name: 'Home2', 
      components: {
        default: Home,
        main: Home
      } 
    },
    { path: '*', redirect: '/' },  
    {
      path: '/Database',
      name: 'Database',
      components: {
        default: ListDTOs,
        main: ListDTOs
      }
    },
    {
      path: '/Login',
      name: 'Login',
      components: {
        default: Login,
        main: Login
      }
    },
    {
      path: '/About',
      name: 'About',
      components: {
        default: About,
        main: About
      }
    },
    {
      path: '/Database/EditDTO/:dtoName/:apiIndex/:id',
      name: 'EditDTO',
      components: {
        default: EditDTO,
        main: EditDTO
      },
      props: ({ main: castEditDTOProps })
    }
  ]
})

function castEditDTOProps(route) {
  let id = route.params.id;
  let apiIndex = route.params.apiIndex
  let dtoName = route.params.dtoName
  if (typeof id !== "number") {
    id = Number(id);
  }
  if (typeof apiIndex !== "number") {
    apiIndex = Number(apiIndex);
  }

  return {
    id: id,
    apiIndex: apiIndex,
    dtoName: dtoName
  };
}
