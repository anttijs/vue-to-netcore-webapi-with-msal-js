<template>
  <div>
    <br>
    <b-container fluid>
      <b-row>
        <b-col sm="1" align-self="end">
          <router-link :to="{ name: 'RouteForSingle', params: { id: -1, apiIndex: apiIndex, title: titleForList }}"  
            v-b-tooltip.hover.top.click.blur="'Add new ' + titleForSingle.toLowerCase() ">
            <font-awesome-icon icon="plus" /> Add
          </router-link>
        </b-col>
        <b-col sm="11" class="align-left">
          <h2>{{titleForList}}</h2>
        </b-col>
      </b-row>
    </b-container>
    <template v-if="state.ok">
    <b-table ref="table" striped hover 
      :items="state.dtos"
      :fields="fields">
      <template v-slot:table-colgroup="scope">
        <col :style="{ width: '80px', whiteSpace: 'nowrap' }">
      </template>
      <template v-slot:cell(Id)="row">
        <router-link :to="{ name: 'RouteForSingle', params: { id: row.item.Id, apiIndex: apiIndex, title: titleForList }}"  
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
import { watch } from '@vue/composition-api'
import { useCrudList } from '@/lib/CRUDService'

export default {
  name: 'ListDto',
  props: {
  },
  setup(props, context) {

    const { state, apiIndex, apiIndexFromTitle, doGetList, fields, dtoName, dtoList, titleForSingle, titleForList, deleteDto, getErrorText } = useCrudList(context)

    watch(apiIndex, () => {
      doGetList(apiIndex.value)
        .catch(error => context.root.$toasted.show(error.message, { type: "error", duration: 5000 }))
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
        deleteDto(idx, id, tokenResponse.accessToken)
        .then(response => {
          const txt = response.data
          context.root.$toasted.show(txt, { type: "success", duration: 3000 })
          doGetList(apiIndex.value)
          .catch(error => context.root.$toasted.show(error.message, { type: "error", duration: 5000 }))
        })
        .catch(error => {
          const txt = getErrorText(error)
          context.root.$toasted.show(txt, { type: "error", duration: 5000 })
        })
      })		
    }

    return { state, doGetList, fields, dtoName, dtoList, titleForSingle, 
    titleForList, deleteTooltipText,editTooltipText, apiIndex, apiIndexFromTitle, onDelete }
  },
  beforeRouteUpdate (to, from, next) {
    this.apiIndex = this.apiIndexFromTitle(to.params.title)
    next()
  }
}
</script>
