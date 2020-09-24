<template>
  <div>
    <br><h2>{{ formTitle() }}</h2><br>
    <b-alert v-if ="loading" show variant="primary">
      <b-spinner small variant="primary" label="Spinning"></b-spinner>  Loading data, please wait...</b-alert>
    <b-alert v-else-if  = "error" show variant="primary">Failed to load data</b-alert>
    <template v-else-if = "dto && schematool">
      <form id="submitForm" @submit="onOK">
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
              :state="getState(item, dto[item.Name])">
              <template v-if="item.Type === 'enum'">
                <b-form-select
                  :id="item.Id" 
                  :state="getState(item, dto[item.Name])"
                  v-model="dto[item.Name]" 
                  :options="item.PropEnums">
                </b-form-select>
              </template>
              <template v-else-if ="item.Type === 'bool'">
                <b-form-checkbox
                  :id="item.Id"
                  :state="getState(item, dto[item.Name])"
                  v-model="dto[item.Name]">
                  {{ schematool.labelForCheckBox(item) }}
                </b-form-checkbox>
              </template>
              <template v-else>
                <b-form-input
                  :id="item.Id"
                  v-model="dto[item.Name]" 
                  :state="getState(item, dto[item.Name])"
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
  </div>
</template>

<script>

import { watch, ref } from '@vue/composition-api'
import { useCrudSingle } from '@/lib/CrudService'
import { isEqual } from 'lodash'
import usePromiseFn from '../composables/use-promise'

export default {
  name: 'EditDto',
  props: {
    id: Number,
    title: String
  },
  setup(props, context) {

    const submitAttempted = ref(false)
  
    const { loading, error, use, dto, schematool, copydto, post, put, editFields, titleForSingle,apiIndex, apiIndexFromTitle } = useCrudSingle(context)    
    const id = () => props.id
    watch([apiIndex, id], ([idx, id]) => {
      use(idx, id)
    })

    watch(error, (error) => {
      error && context.root.$toasted.show(error, { type: "error", duration: 5000 })
    })
    
    const formTitle = () => {
      const oper = (props.id === -1) ? "Add" : "Edit"
      return `${oper} ${titleForSingle(apiIndex.value).toLowerCase()}`
    }

    const validFeedback = () => {
      return ''
    }
    
    const invalidFeedback = (prop, dtoObj) => {
      if (submitAttempted.value === false)
        return ''
      return schematool.value.invalidFeedback(prop,dtoObj)
    }
    
    const getState = (prop, dtoObj) => {
      if (submitAttempted.value === false)
        return null
      return schematool.value.state(prop,dtoObj)
    }
    

    // handle Add/Update
    const { error: errorOK, result: resultOK, use: useOK } = usePromiseFn((props.id === -1) ? post : put)
    const onOK = (e) => {
      e.preventDefault()
      submitAttempted.value = true
      if (isEqual(dto.value,copydto.value) && props.id !== -1) {
        context.root.$toasted.show('No changes where made.', { type: "success", duration: 3000 })
        context.root.$router.push({ name: 'RouteForList', params: { title: props.title }})
        return
      }
      if (schematool.value.isValidState(dto.value) === false) {
        context.root.$toasted.show('Check field values', { type: "error", duration: 3000 })
        return
      }
      useOK(apiIndex.value, dto.value)
    }
    watch(errorOK, (errorOK) => {
      errorOK && context.root.$toasted.show(errorOK, { type: "error", duration: 5000 })
    })
    watch(resultOK,(resultOK) => {
      if (resultOK) {
        context.root.$toasted.show(resultOK.data, { type: "success", duration: 3000 })
        context.root.$router.push({ name: 'RouteForList', params: { title: props.title }})
      }
    }) 
    
    const onCancel = () => {
      context.root.$router.push({ name: 'RouteForList', params: { title: props.title }})
    }

    return  { loading, error, dto, schematool, copydto, 
    editFields, formTitle, validFeedback, invalidFeedback, onOK, onCancel, getState, apiIndexFromTitle }
  },
  beforeRouteUpdate (to, from, next) {
    this.apiIndex = this.apiIndexFromTitle(to.params.title)
    next()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.apiIndex = vm.apiIndexFromTitle(to.params.title))
  }
}
</script>