import Axios from 'axios'
import { reactive, computed, watch, toRefs } from '@vue/composition-api'
import { Schematool } from '@/lib/SchemaTool'
import { cloneDeep } from 'lodash'
import usePromiseFn from '../composables/use-promise'

const RESOURCE_NAME = process.env.VUE_APP_API_ENDPOINT

const apiMethods = Object.freeze([
  { GetList: "GetPeople",  GetSingle: "GetPerson", Put: "PutPerson", Post: "PostPerson", Delete: "DeletePerson", TitleForList: "People", TitleForSingle: "Person" },
  { GetList: "GetBooks", GetSingle: "GetBook", Put: "PutBook", Post: "PostBook", Delete: "DeleteBook", TitleForList: "Books", TitleForSingle: "Book" },
  { GetList: "GetMovies",  GetSingle: "GetMovie",  Put: "PutMovie",  Post: "PostMovie",  Delete: "DeleteMovie",  TitleForList: "Movies", TitleForSingle: "Movie" },
])

export const useNaming = (context) => {

  const apiIndex = computed({
    get: () => { 
      return (context.root.$store.state.apiIndex && context.root.$store.state.apiIndex >= 0) ? context.root.$store.state.apiIndex : 0},
    set: val => {
      context.root.$store.commit('setApiIndex', val)
    }
  })

  const apiIndexFromTitle = (title) => {
    return apiMethods.findIndex(obj => obj.TitleForList === title) 
  }

  const dtoList = computed(() => apiMethods.map(obj => obj.TitleForList))

  const titleForList = computed(() => apiMethods[apiIndex.value].TitleForList )

  const titleForSingle = (idx) => apiMethods[idx].TitleForSingle

  return { apiIndex, apiIndexFromTitle, dtoList, titleForList, titleForSingle }
}

export const useCrudSingle = (context) => {
  const state = reactive({ 
    dto: null, 
    schematool: null, 
    copydto: null  
  })

  const get = (idx, id) => {
    const endpoint = `${RESOURCE_NAME}/${apiMethods[idx].GetSingle}/${id}`
    console.log('Axios.get, endpoint:',endpoint, 'apiIndex:', idx)
    return Axios.get(endpoint)
  }

  const post = (idx, dto) => {
    const endpoint = `${RESOURCE_NAME}/${apiMethods[idx].Post}`
    console.log('Axios.post, endpoint:',endpoint, 'apiIndex:', idx)
    return Axios.post(endpoint, dto)
  }

  const put = (idx, dto) => {
    const endpoint = `${RESOURCE_NAME}/${apiMethods[idx].Put}/${dto.Id}`
    console.log('Axios.put, endpoint:',endpoint, 'apiIndex:', idx, 'dto:', dto)
    return Axios.put(endpoint, dto)
  }

  const { loading, error, result, use } = usePromiseFn(get)

  const { apiIndex, apiIndexFromTitle, titleForSingle } = useNaming(context)

  watch(result, (result) => {
    if (result) {
      state.schematool = new Schematool(result.data.schema)
      state.dto = result.data.data || {}
      state.copydto = cloneDeep(state.dto)
  }
  })
  
  const editFields = computed(() =>  {
    return state.schematool.editFields()
  })
  
  return { loading, error, use, ...toRefs(state), post, put, editFields, titleForSingle, apiIndex, apiIndexFromTitle }
}

export const useCrudList = (context) => {

  const state = reactive( { 
    dtos: null,
    schema: null

  })
  
  const getList = (idx) => {
    const endpoint = `${RESOURCE_NAME}/${apiMethods[idx].GetList}`
    console.log('Axios.get, endpoint:',endpoint, 'apiIndex:', idx)
    return Axios.get(endpoint)
  }

  const { apiIndex, apiIndexFromTitle, dtoList, titleForList } = useNaming(context)
  
  const { loading, error, result, use } = usePromiseFn(getList)

  watch(result, (result) => {
    if (result) {
      state.dtos = result.data.data
      state.schema = result.data.schema
    }
  })
  
  const fields = computed(() =>  {
      if (!Array.isArray(state.dtos) || !state.length) {
        return []
      }
      if (!Array.isArray(state.schema.Props) || !state.schema.Props.length) {
        return []
      }
      return state.schema.Props.map(obj => {return {key: obj.Name, label: obj.Title}})
  }
  )

  const titleForSingle = computed(() => apiMethods[apiIndex.value].TitleForSingle )
    
  const dtoName = (id) => {
    const x = state.dtos.find(obj => obj.Id === id)
    if (x !== undefined) {
      return x.Name
    }
    return "?"
  }

  const deleteDto = (idx, id, token) => {
    const endpoint = `${RESOURCE_NAME}/${apiMethods[idx].Delete}/${id}`
    console.log('Axios.delete, endpoint:',endpoint, 'apiIndex:', idx)
    return Axios.delete(endpoint, { headers: {"Authorization" : `Bearer ${token}`} });
  }

  return { ...toRefs(state), loading, error, use, apiIndex, apiIndexFromTitle, fields, 
          dtoName, dtoList, titleForSingle, titleForList, deleteDto }
}
