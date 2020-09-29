<template>
  <div>
    <br>
    <b-container fluid>
      <b-row>
        <b-col sm="1" align-self="end">
          <router-link :to="{ name: 'RouteForSingle', params: { id: -1, title: titleForList }}"  
            v-b-tooltip.hover.top.click.blur="'Add new ' + titleForSingle.toLowerCase() ">
            <font-awesome-icon icon="plus" /> Add
          </router-link>
        </b-col>
        <b-col sm="11" class="align-left">
          <h2>{{titleForList}}</h2>
        </b-col>
      </b-row>
    </b-container>
    <b-alert v-if = "loading" show variant="primary">
      <b-spinner small variant="primary" label="Spinning"></b-spinner>  Loading data, please wait...</b-alert>
    <b-alert v-else-if  = "error" show variant="primary">Failed to load data</b-alert>
    <template v-else-if="!error && dtos && schema">
    <b-table ref="table" striped hover 
      :items="dtos"
      :fields="fields">
      <template v-slot:table-colgroup="scope">
        <col :style="{ width: '80px', whiteSpace: 'nowrap' }">
      </template>
      <template v-slot:cell(Id)="row">
        <router-link :to="{ name: 'RouteForSingle', params: { id: row.item.Id, title: titleForList }}"  
        v-b-tooltip.hover.top.click.blur="editTooltipText(row.item.Id)">
        <font-awesome-icon icon="edit" />
        </router-link>
        &nbsp;
        <b-link  @click="onDelete(row.item.Id)" v-b-tooltip.hover.top.click.blur = "deleteTooltipText(row.item.Id)">
        <font-awesome-icon icon="trash" />
        </b-link>
      </template>
    </b-table>
    </template>
    
  </div>
</template>

<script lang="javascript">
import { watch } from '@vue/composition-api'
import { useCrudList } from '@/lib/CrudService'
import usePromiseFn from '../composables/use-promise'

export default {
  name: 'ListDto',
  props: {
  },
  setup(props, context) {

    const { dtos, schema, loading, error, use, apiIndex, apiIndexFromTitle, fields, 
            dtoName, dtoList, titleForSingle, titleForList, deleteDto } = useCrudList(context)

    watch(apiIndex, (apiIndex) => {
      use(apiIndex)
    })

    watch (error, (error) => {
      error && context.root.$toasted.show(error, { type: "error", duration: 5000 })
    })
    
    const deleteTooltipText = (id) => {
      try {
        return `Delete ${titleForSingle.value.toLowerCase()} ${dtoName(id)}`
      }
      catch (error) {
        console.log(error)
        return "?"
      }
    }

    const editTooltipText = (id) => {
      try {
        return `Edit ${titleForSingle.value.toLowerCase()} ${dtoName(id)}`
      }
      catch (error) {
        console.log(error)
        return "?"
      }
    }    

    const onDelete = (id) =>  {
     context.root.$AuthService.ensureLoggedIn(context.root).then(response => {
       if (response.message) {
         context.root.$toasted.show(response.message, { type: "success", duration: 3000, position: 'top-right' })
       }
        const message = `Are you sure you want to delete information about ${titleForSingle.value.toLowerCase()} ${dtoName(id)}`
        context.root.$bvModal.msgBoxConfirm(message, {
          title: 'Confirmation'
        })
        .then(value => {
          if (value === true) {
            doDelete(apiIndex.value, id)
          }
        })
        .catch(error => {
          console.log(error)
        })
      })
      .catch(error => {context.root.$toasted.show(error.message, { type: "error", duration: 5000 })})
    }

    const { error: error2, result: result2, use: use2 } = usePromiseFn(deleteDto)
    const doDelete = (idx, id)=> {
      context.root.$AuthService.getToken()
      .then(tokenResponse => {
        use2(idx, id, tokenResponse.accessToken)
      })		
    }
    watch(result2,(result2) => {
      console.log('result2',result2)
      if (result2) {
        context.root.$toasted.show(result2.data, { type: "success", duration: 3000 })
        use(apiIndex.value)
      }
    })
    watch(error2,(error2) => {
      console.log('error2',error2)
      error2 && context.root.$toasted.show(error2, { type: "error", duration: 5000 })
    })


    return { dtos, schema, loading, error, fields, dtoName, dtoList, titleForSingle, 
    titleForList, deleteTooltipText,editTooltipText, apiIndex, apiIndexFromTitle, onDelete }
  },
  beforeRouteUpdate (to, from, next) {
    if (this) {
      this.apiIndex = this.apiIndexFromTitle(to.params.title)
    }
    next()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.apiIndex = vm.apiIndexFromTitle(to.params.title))
  }
}
</script>
