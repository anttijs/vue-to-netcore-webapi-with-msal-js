<template>
  <div>
    <br>
    <b-tabs v-model = "apiIndex" content-class="mt-3" >
      <b-tab  v-for ="(value, index) in dtoList" 
        :key ="index" 
        @click="onTabClick(index)" 
        :title="value"
        >
        <b-container fluid>
          <b-row>
            <b-col sm="1" align-self="end">
              <router-link :to="{ name: 'EditDTO', params: { id: -1, apiIndex: apiIndex, title: titleForSingle }}"  
                v-b-tooltip.hover.top.click.blur="'Add new ' + titleForSingle.toLowerCase() ">
                <font-awesome-icon icon="plus" /> Add
              </router-link>
            </b-col>
            <b-col sm="11" class="align-left">
              <h2>{{titleForList}}</h2>
            </b-col>
          </b-row>
        </b-container>
        
      </b-tab>
    </b-tabs>
    <template v-if="state.ok">
    <b-table ref="table" striped hover 
      :items="state.dtos"
      :fields="fields">
      <template v-slot:table-colgroup="scope">
        <col :style="{ width: '80px', whiteSpace: 'nowrap' }">
      </template>
      <template v-slot:cell(Id)="row">
        <router-link :to="{ name: 'EditDTO', params: { id: row.item.Id, apiIndex: apiIndex, title: titleForSingle }}"  
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
    <b-alert v-else-if ="state.loading" show variant="primary">
      <b-spinner small variant="primary" label="Spinning"></b-spinner>  Loading data, please wait...</b-alert>
    <b-alert v-else-if  = "state.ok == false && state.loading == false" show variant="primary"><h2>Failed to load data</h2></b-alert>
      
  </div>
</template>

<script lang="javascript">
import { onMounted } from '@vue/composition-api'
import { useCrudList } from '@/lib/CRUDService'

export default {
  name: 'ListDTOs',
   props: {
  },
  
  setup(props, context) {
    
    const { state, apiIndex, doGetList, fields, dtoName, dtoList, titleForSingle, titleForList, deleteDTO, getErrorText } = useCrudList(context)

    onMounted(() => {
      doGetList(apiIndex.value)
        .then(()=>console.log('state',state))
        .catch(error => context.root.$toasted.show(error.message, { type: "error", duration: 5000 }))
    })
    
    const deleteTooltipText = (id) => {
      try {
        return `Delete ${titleForSingle.value.toLowerCase()} ${dtoName(id)}`
      }
      catch {
        return "?"
      }
    }

    const editTooltipText = (id) => {
      try {
        return `Edit ${titleForSingle.value.toLowerCase()} ${dtoName(id)}`
      }
      catch {
        return "?"
      }
    }    

    const onDelete = (id) =>  {
     context.root.$AuthService.ensureLoggedIn(context.root).then(() => {
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
    }
    
    const doDelete = (idx, id)=> {
      context.root.$AuthService.getToken(context.root)
      .then(tokenResponse => {
        deleteDTO(idx, id, tokenResponse.accessToken)
        .then(response => {
          const txt = response.data
          context.root.$toasted.show(txt, { type: "success", duration: 3000 })
          doGetList(apiIndex.value)
          .then(()=>console.log('state',state))
          .catch(error => context.root.$toasted.show(error.message, { type: "error", duration: 5000 }))
        })
        .catch(error => {
          const txt = getErrorText(error)
          context.root.$toasted.show(txt, { type: "error", duration: 5000 })
        })
      })		
    }
    const onTabClick = (index) => {
      apiIndex.value = index
      doGetList(index)
        .then(()=>console.log('state',state))
        .catch(error => context.root.$toasted.show(error.message, { type: "error", duration: 5000 }))
      
    }
    return { state, doGetList, fields, dtoName, dtoList, titleForSingle, 
    titleForList, deleteTooltipText,editTooltipText, apiIndex, onDelete, onTabClick }
  }  
}
</script>
