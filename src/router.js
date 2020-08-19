import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import ListDto from '@/components/ListDto.vue'
import EditDto from '@/components/EditDto.vue'
import NavDatabase from '@/components/NavDatabase.vue'


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
    { path: '/', redirect: '' },
    {
      path: '/Database',
      components: {
        default: NavDatabase,
        main: NavDatabase
      },
      children: [
        {
          path: '',
          name: 'defaultRouteForList',
          component: ListDto
        },
        {
          path: ':title',
          name: 'RouteForList',
          component: ListDto
        },
        {
          path: ':title/:id',
          name: 'RouteForSingle',
          component: EditDto,
          props: castEditDtoProps
        }
      ]
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
      path: '/*', 
      redirect: { name: 'Home' } 
    }  
  ]
})

function castEditDtoProps(route) {
  let id = route.params.id;
  let apiIndex = route.params.apiIndex
  let title = route.params.title
  if (typeof id !== "number") {
    id = Number(id);
  }
  if (typeof apiIndex !== "number") {
    apiIndex = Number(apiIndex);
  }
  console.log('routeparams',route.params,id, apiIndex,title)
  return {
    id: id,
    apiIndex: apiIndex,
    title: title
  };
}
