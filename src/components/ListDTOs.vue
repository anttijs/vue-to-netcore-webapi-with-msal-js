<template>
  <div>
    <br>
    <b-tabs v-model = "idx" content-class="mt-3" >
      <b-tab  v-for ="(value, index) in api" 
        :key ="index" 
        @click="onTabClick(index)" 
        :title="value.TitleForList"
        >
        <b-container fluid>
          <b-row>
            <b-col sm="1" align-self="end">
              <router-link :to="{ name: 'EditDTO', params: { id: -1, apiIndex: idx, dtoName: api[idx].TitleForSingle }}"  
                v-b-tooltip.hover.top.click.blur="'Add new ' + api[apiIndex].TitleForSingle.toLowerCase() ">
                <font-awesome-icon icon="plus" /> Add
              </router-link>
            </b-col>
            <b-col sm="11" class="align-left">
              <h2>{{value.TitleForList}}</h2>
            </b-col>
          </b-row>
        </b-container>
        
      </b-tab>
    </b-tabs>
    <template v-if="schematool.schema">
    <b-table ref="table" striped hover 
      :items="dtos"
      :fields="fields">
      <template v-slot:table-colgroup="scope">
        <col :style="{ width: '80px', whiteSpace: 'nowrap' }">
      </template>
      <template v-slot:cell(Id)="row">
        <router-link :to="{ name: 'EditDTO', params: { id: row.item.Id, apiIndex: idx, dtoName: api[idx].TitleForSingle }}"  
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
    <b-alert v-else-if ="loading" show variant="primary"><b-spinner small variant="primary" label="Spinning"></b-spinner>  Loading data, please wait...</b-alert>
  </div>
</template>

<script lang="javascript">
import CRUDService from '@/lib/CRUDService'
import { apiMethods } from '@/lib/CRUDService'
import schematool from '@/lib/SchemaTool'
export default {
  name: 'ListDTOs',
  components: {

  },
  computed: {
    api() {
      return apiMethods
    },
    apiIndex : {
      get: function() {
        return this.$store.state.apiIndex
      },
      set: function (newValue) {
        this.$store.commit('setApiIndex', newValue)
      }
    },
    fields() {
      if (!Array.isArray(this.dtos) || !this.dtos.length) {
        return []
      }
      if (!Array.isArray(this.schematool.schema.Props) || !this.dtos.length) {
        return []
      }
      return this.schematool.schema.Props.map(obj => {return {key: obj.Name, label: obj.Title}})
    }
  },
  data() {  
    return { dtos: [], schematool: schematool, idx: this.apiIndex, loading: false }
  },
  methods: {
    dtoName(id) {
      let x = this.dtos.find(obj => { return obj.Id === id})
      if (x !== undefined) {
        return x.Name
      }
      return "?"
    },
    deleteTooltipText(id) {
      return `Delete ${this.api[this.apiIndex].TitleForSingle.toLowerCase()} ${this.dtoName(id)}`
    },
    editTooltipText(id) {
      return `Edit ${this.api[this.apiIndex].TitleForSingle.toLowerCase()} ${this.dtoName(id)}`
    },
    onDelete(id) {
      this.$AuthService.ensureLoggedIn(this).then(() => {
        let message = `Are you sure you want to delete information about ${this.api[this.apiIndex].TitleForSingle.toLowerCase()} ${this.dtoName(id)}`
        this.$bvModal.msgBoxConfirm(message,{
          title: 'Confirmation'
        })
        .then(value => {
          if (value === true) {
            this.deleteDTO(this.apiIndex, id)
          }
        })
        .catch(error => {
          console.log(error)
        })
      })
    },
    deleteDTO(idx, id) {
      this.$AuthService.getToken(this)
      .then(tokenResponse => {
        CRUDService.delete(idx, id, tokenResponse.accessToken)
        .then(response => {
          let txt = response.data
          this.$toasted.show(txt, { type: "success", duration: 3000 })
          this.getDTOs()
        })
        .catch(error => {
          CRUDService.showError(this.$toasted, error) 
        })
      })		
    },
    onTabClick(index) {
      let x = this
      this.$nextTick().then(function() {
        // wait until idx v-model is updated
        x.apiIndex=index
        x.getDTOs()
      })
    },
    getDTOs() {
      this.loading = true
      this.schematool.schema = null
      this.dtos = []
      CRUDService.getList(this.apiIndex)
      .then(response => {
        console.log('CRUDService.getList(), retval:', response)
        this.dtos = response.data.data || []   
        this.schematool.schema = response.data.schema
        return response.data 
      })
      .catch(error => {
        this.dtos = []
        CRUDService.showError(this.$toasted, error)
      })
      .finally(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.idx = this.apiIndex
    this.getDTOs()
  }
}
</script>
