<template>
  <div>
    <b-form-group
      label-cols="6"
      id="fieldset-1"
      description="dfdf"
      :label="label"
      label-for="input-1"
      :invalid-feedback="invalidFeedback"
      :valid-feedback="validFeedback"
      :state="state"
    >
      <b-form-input
      ref="input" 
      id="input-1" 
      v-model="valuestr"
      @input="onInput"
      @blur="onBlur" 
      :state="state" trim></b-form-input>
    </b-form-group>
    <div class="ico-input">
    <input type="text" hidden style="display:none;">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CustomInput',
    props: {
        id: Number,
        value: Number,
        min: Number,
        max: Number,
        type: String,
        label: String
    },
    watch: {
        state: function() {
            this.$emit('state', {id: this.id, state: this.state})
        }
    },
    computed: {
      state() {
        const x = this.asFloat(this.valuestr.toString())
        return x <= this.max && x >= this.min
      },
      invalidFeedback() {
        if (this.state===false)
          return `Enter value between ${this.toLocale(this.min)} and ${this.toLocale(this.max)}`
       return ''
      },
      validFeedback() {
        return this.state === true ? 'valid feedback' : ''
      },
      maxFractionDigits() {
        if (this.type === 'float')
            return 2
        return 0
      },
      minFractionDigits() {
        if (this.type === 'float')
            return 2
        return 0
      }

    },
    data() {
      return {
        valuestr: this.asFormatted(this.value.toString())
        }
    },
    methods: {
        toLocale(number) {
            return number.toLocaleString('fr-FR', { maximumFractionDigits: this.maxFractionDigits, minimumFractionDigits: this.minFractionDigits, useGrouping: true} )
        },
        asValid(str) {
            let regexp = /[^Z0-9\s-]/g
            if (this.type === 'float')
                regexp = /[^Z0-9,\s-]/g
            return str.replace(regexp,'')
        },
        asFloat(str) {
            return parseFloat(this.asValid(str).replace(',','.').replace(/\s/g,''))
        },
        asFormatted(str) {
            return this.toLocale(this.asFloat(str))
        },
        onInput(value) {
            const x = this.asValid(value.toString())
            if (x === value.toString()) {
                this.$emit('input', this.asFloat(value.toString()))
            }
            else {
                var b = this
                this.$nextTick().then(function() {
                    b.valuestr = x
                })
                
            }
        },
        onBlur() {
            const x = this.valuestr.toString();
            const y = this.asFormatted(x)
            if (x !== y) {
                this.valuestr = y
                this.$emit('input',  this.asFloat(y))
            }
            this.$emit('blur',  this.asFloat(y))
        }
    },
    created() {
        this.$emit('state', {id: this.id, state: this.state})
    }
  }
</script>