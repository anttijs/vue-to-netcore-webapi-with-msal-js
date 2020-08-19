<template>
  <div>
    <br>
    <b-nav tabs content-class="mt-3" >
      <b-nav-item  v-for ="(value, index) in dtoList" 
        :key ="index"
        exact-active-class="active" 
        :active="$route.path.includes(value)"
        :to="{ name: 'RouteForList', params: { title: value }}" 
        :title="value"
        >
        {{value}}
      </b-nav-item>
    </b-nav>
    <router-view></router-view>      
  </div>
</template>

<script lang="javascript">
import { useNaming } from '@/lib/CRUDService'

export default {
  name: 'NavDatabase',
   props: {
  },
  
  setup(props, context) {    
    const { dtoList } = useNaming(context)    
    return { dtoList }
  }  
}
</script>
