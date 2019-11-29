<template>
  <div>
    <template v-if="schematool.schema">
      <form id="submitForm" @submit="onOK">
        <br><h2>{{ formTitle }}</h2><br>
        <b-container>
            <div v-for ="(item) in editFields" :key="item.Id">
                <b-row class="my-1">
                <b-col sm="3">
                    <label for="first_">{{ schematool.title(item.Name) }}</label>
                </b-col>
                <template v-if="item.Type === 'Enum'">
                  <b-col sm="9">
                      <b-form-select v-model="dto[item.Name]" :options="schematool.selectOptions(item.Name) "></b-form-select>
                  </b-col>
                </template>
                <template v-else-if ="item.Type === 'Int32'">
                  <b-col sm="9">
                      <b-form-input v-model.number="dto[item.Name]" type="number"></b-form-input>
                  </b-col>
                </template>
                <template v-else>
                  <b-col sm="9">
                      <b-form-input v-model="dto[item.Name]" :type="schematool.inputType(item.Name)" required></b-form-input>
                  </b-col>
                </template>
            </b-row>
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
import CRUDService from '@/api-services/CRUDService'
import schematool from '@/lib/mylib'
export default {
  name: 'EditDTO',
  props: {
    id: Number,
    apiIndex: Number,
    dtoName: String
  },
  data () { 
    return {dto: {}, schematool: schematool }
  },
  computed: {
    editFields() {
      return this.schematool.schema.Props.filter( obj => { return !obj.Hidden })
    },
    formTitle() {
      var oper = (this.id === -1) ? "Add" : "Edit"
      return `${oper} ${this.dtoName.toLowerCase()}`
    }  
  },
  methods: {
    getDTO() {
        CRUDService.get(this.apiIndex, this.id)
          .then(response => {
            this.schematool.schema = response.data.schema
            this.dto = response.data.data || {}
          })
          .catch(error => {
            CRUDService.showError(this.$toasted, error)
          });
    },
    onOK(e) {

      e.preventDefault()
      var fn = (this.id === -1) ? CRUDService.post : CRUDService.put
      fn(this.apiIndex, this.dto)
        .then( response => {
          var txt = response.data
          console.log(response.data)
          console.log(response)
          this.$toasted.show(txt, { type: "success", duration: 3000 })
          this.$router.go(-1)
        })
        .catch(error => {
            CRUDService.showError(this.$toasted, error)
        });
    },
    onCancel() {
      this.$router.go(-1)
    }
  },
  created() {
    this.getDTO()
  }
}
</script>