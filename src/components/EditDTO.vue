<template>
  <div>
    <template v-if="schematool.schema">
      <form id="submitForm" @submit="onOK">
        <br><h2>{{ formTitle }}</h2><br>
        <b-container align="left">
          <div v-for ="(item) in editFields" :key="item.Id">
            <b-form-group
              :id="item.Id"  
              :label="schematool.label(item)"
              :label-for="item.Id"
              label-align="right"
              label-cols="3"
              :invalid-feedback="invalidFeedback(item, dto[item.Name])"
              :valid-feedback="validFeedback()"
              :state="state(item, dto[item.Name])">
              <template v-if="item.Type === 'enum'">
                <b-form-select
                  :id="item.Id" 
                  :state="state(item, dto[item.Name])"
                  v-model="dto[item.Name]" 
                  :options="item.PropEnums">
                </b-form-select>
              </template>
              <template v-else-if ="item.Type === 'bool'">
                <b-form-checkbox
                  :id="item.Id"
                  :state="state(item, dto[item.Name])"
                  v-model="dto[item.Name]">
                  {{ schematool.labelForCheckBox(item) }}
                </b-form-checkbox>
              </template>
              <template v-else>
                <b-form-input
                  :id="item.Id"
                  v-model="dto[item.Name]" 
                  :state="state(item, dto[item.Name])"
                  :type="item.InputType" 
                  :number="schematool.isNumeric(item)"
                  :pattern="item.Pattern">
                </b-form-input>
              </template>
            </b-form-group>
           </div>
            <b-row class="my-1">  
                <b-col sm="8" align-self="end"></b-col>
                <b-col sm="2" align-self="end"><b-button type="submit" block variant="primary">OK</b-button></b-col>
                <b-col sm="2" align-self="end"><b-button block variant="light" @click="onCancel">Cancel</b-button></b-col>
            </b-row>
        </b-container>
      </form>
    </template>
    <b-alert v-else show variant="primary">Loading data, please wait...</b-alert>
  </div>
</template>

<script>

import CRUDService from '@/lib/CRUDService'
import schematool from '@/lib/SchemaTool'
import { isEqual,cloneDeep } from 'lodash'

export default {
  name: 'EditDTO',
  props: {
    id: Number,
    apiIndex: Number,
    dtoName: String
  },
  data () { 
    return {dto: {}, schematool: schematool, submitAttempted: false, copydto: {}  }
  },
  computed: {
    editFields() {
        return this.schematool.editFields()
    },
    formTitle() {
      const oper = (this.id === -1) ? "Add" : "Edit"
      return `${oper} ${this.dtoName.toLowerCase()}`
    }
  },
  methods: {
    validFeedback() {
      return ''
    },
    invalidFeedback(prop, dtoObj) {
      if (this.submitAttempted === false)
        return ''
      return this.schematool.invalidFeedback(prop,dtoObj)
    },
    state(prop, dtoObj) {
      if (this.submitAttempted === false)
        return null
      return this.schematool.state(prop,dtoObj)
    },
    getDTO() {
        CRUDService.get(this.apiIndex, this.id)
          .then(response => {
            this.schematool.schema = response.data.schema
            this.dto = response.data.data || {}
            this.copydto = cloneDeep(this.dto)
          })
          .catch(error => {
            CRUDService.showError(this.$toasted, error)
          });
    },
    onOK(e) {
      e.preventDefault()
      this.submitAttempted = true
      if (isEqual(this.dto,this.copydto) && this.id !== -1) {
        this.$toasted.show('No changes where made.', { type: "success", duration: 3000 })
        this.$router.push('/Database')
        return
      }
      if (this.schematool.isValidState(this.dto) === false) {
        this.$toasted.show('Check field values', { type: "error", duration: 3000 })
        return
      }
      let fn = (this.id === -1) ? CRUDService.post : CRUDService.put
      fn(this.apiIndex, this.dto)
        .then( response => {
          let txt = response.data
          console.log(response.data)
          console.log(response)
          this.$toasted.show(txt, { type: "success", duration: 3000 })
          this.$router.push('/Database')
        })
        .catch(error => {
            CRUDService.showError(this.$toasted, error)
        });
    },
    onCancel() {
      this.$router.push('/Database')
    }
  },
  created() {
    this.getDTO()
  }
}
</script>