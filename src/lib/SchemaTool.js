export class Schematool 
{
  constructor(schema) {
    this.schema = schema
  }
  editFields() {
    return !this.schema ? null : this.schema.Props.filter( ({ Hidden }) => { return !Hidden })
  }
  label(prop) {
    if (prop.Type === 'bool')
      return ''
    if (prop.Title === null)
      return prop.Name
    return prop.Title
  }
  labelForCheckBox(prop) {
    if (prop.Type !== 'bool')
      return ''
    if (prop.Title === null)
      return prop.Name
    return prop.Title
  }
  invalidFeedback(prop, dtoObj) {
    if (this.state(prop, dtoObj)===true){
      return ''
    }
    if (prop.Required === true && (dtoObj === null || dtoObj === undefined || dtoObj.length===0))
      return 'The field is required';
    if (prop.Required === true && prop.Type === 'enum' && prop.PropEnums.find( ({value}) => value === dtoObj) === undefined)
      return 'The field is required'
    if (prop.Type === 'number') {
      if ((prop.Max !== null && (dtoObj === null || dtoObj === undefined ||  dtoObj > prop.Max)) || 
          (prop.Min !== null && (dtoObj === null || dtoObj === undefined || dtoObj < prop.Min))) {
        return `Enter value between ${prop.Min} and ${prop.Max}`
      }
      if(isNaN(dtoObj)) {
        return 'Enter a valid number'
      }
    }
    if (prop.Type === 'text') {
      if ((prop.MaxLength !== null && (dtoObj === null || dtoObj === undefined  || dtoObj.length > prop.MaxLength)) || 
        (  prop.MinLength !== null && (dtoObj === null || dtoObj === undefined  || dtoObj.length < prop.MinLength))) {
        return `Text should contain between ${prop.MinLength} and ${prop.MaxLength} characters`
      }
    }
    return ''
  }
  state(prop, dtoObj) {
    if (prop.Required === false && !dtoObj) {
      return true
    }
    if (prop.Required === true && prop.Type === 'enum' && prop.PropEnums.find( ({value}) => value === dtoObj) === undefined) {
      return false
    }
    if (prop.Required === true && (dtoObj === null || dtoObj === undefined || dtoObj.length===0)) {
      return false
    }
    if (prop.Type === 'number') {
      if ((prop.Max !== null && (dtoObj === null || dtoObj === undefined || dtoObj > prop.Max)) || 
        (  prop.Min !== null && (dtoObj === null || dtoObj === undefined || dtoObj < prop.Min))) {
        return false
      }
      if(isNaN(dtoObj)) {
        return false
      }
    }
    if (prop.Type === 'text') {
      if ((prop.MaxLength !== null && (dtoObj === null || dtoObj === undefined || dtoObj.length > prop.MaxLength)) || 
          (prop.MinLength !== null && (dtoObj === null || dtoObj === undefined || dtoObj.length < prop.MinLength))) {
        return false
      }
    }
    return true
  }
  isValidState(dto) {
    return this.schema.Props.filter( ({ Hidden }) => { return !Hidden }).every(prop => this.state(prop, dto[prop.Name])===true)
  }
  isNumeric(prop) {
    return (prop.Type === 'number')
  }
}