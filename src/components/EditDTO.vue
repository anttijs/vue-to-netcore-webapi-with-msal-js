<template>
  <div>
    <br><h2>{{ formTitle() }}</h2><br>
    <template v-if="state.ok && state.schematool.schema">
      <form id="submitForm" @submit="onOK">
        <b-container align="left">
          <div v-for ="(item) in editFields" :key="item.Id">
            <b-form-group
              :id="item.Id"  
              :label="state.schematool.label(item)"
              :label-for="item.Id"
              label-align="right"
              label-cols="3"
              :invalid-feedback="invalidFeedback(item, state.dto[item.Name])"
              :valid-feedback="validFeedback()"
              :state="getstate(item, state.dto[item.Name])">
              <template v-if="item.Type === 'enum'">
                <b-form-select
                  :id="item.Id" 
                  :state="getstate(item, state.dto[item.Name])"
                  v-model="state.dto[item.Name]" 
                  :options="item.PropEnums">
                </b-form-select>
              </template>
              <template v-else-if ="item.Type === 'bool'">
                <b-form-checkbox
                  :id="item.Id"
                  :state="getstate(item, state.dto[item.Name])"
                  v-model="state.dto[item.Name]">
                  {{ state.schematool.labelForCheckBox(item) }}
                </b-form-checkbox>
              </template>
              <template v-else>
                <b-form-input
                  :id="item.Id"
                  v-model="state.dto[item.Name]" 
                  :state="getstate(item, state.dto[item.Name])"
                  :type="item.InputType" 
                  :number="state.schematool.isNumeric(item)"
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
    <b-alert v-else-if ="state.loading" show variant="primary">
      <b-spinner small variant="primary" label="Spinning"></b-spinner>  Loading data, please wait...</b-alert>
    <b-alert v-else-if  = "state.ok == false && state.loading == false" show variant="primary"><h2>Failed to load data</h2></b-alert>
  </div>
</template>

<script>

import { onMounted, ref } from '@vue/composition-api'
import { useCrudSingle } from '@/lib/CRUDService'
import { isEqual } from 'lodash'

export default {
  name: 'EditDTO',
  props: {
    id: Number,
    apiIndex: Number,
    title: String
  },
  setup(props, context) {

    const { state, get, post, put, doGet, getErrorText, editFields, formTitle } = useCrudSingle(props, context)    
    const submitAttempted = ref(false)

    onMounted(() => {
      console.log('onMounted')
      doGet(props.apiIndex, props.id)
        .then(()=>console.log('lopussa, state',state))
        .catch(error => context.root.$toasted.show(error.message, { type: "error", duration: 5000 }))
    })

    const validFeedback = () => {
      return ''
    }
    
    const invalidFeedback = (prop, dtoObj) => {
      if (submitAttempted.value === false)
        return ''
      return state.schematool.invalidFeedback(prop,dtoObj)
    }
    
    const getstate = (prop, dtoObj) => {
      if (submitAttempted.value === false)
        return null
      return state.schematool.state(prop,dtoObj)
    }
    
    const onOK = (e) => {
      console.log('onOK',state)
      e.preventDefault()
      submitAttempted.value = true
      if (isEqual(state.dto,state.copydto) && props.id !== -1) {
        context.root.$toasted.show('No changes where made.', { type: "success", duration: 3000 })
        context.root.$router.push('/Database')
        return
      }
      if (state.schematool.isValidState(state.dto) === false) {
        context.root.$toasted.show('Check field values', { type: "error", duration: 3000 })
        return
      }
      const fn = (props.id === -1) ? post : put
      fn(props.apiIndex, state.dto)
        .then( response => {
          const txt = response.data
          console.log(response.data)
          console.log(response)
          context.root.$toasted.show(txt, { type: "success", duration: 3000 })
          context.root.$router.push('/Database')
        })
        .catch(error => {
            const txt = getErrorText(error)
            context.root.$toasted.show(txt, { type: "error", duration: 5000 })
        });
    } 
    
    const onCancel = () => {
      console.log('onCancel')
      context.root.$router.push('/Database')
    }

    return  { state, get, post, put, doGet, getErrorText, editFields, formTitle, validFeedback, invalidFeedback, onOK, onCancel, getstate }
  }
}
</script>