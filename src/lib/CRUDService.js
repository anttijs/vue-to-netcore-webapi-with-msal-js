import Axios from 'axios'
import { reactive, computed } from '@vue/composition-api'
import { Schematool } from '@/lib/SchemaTool'
import { cloneDeep } from 'lodash'

const RESOURCE_NAME = process.env.VUE_APP_API_ENDPOINT

const apiMethods = Object.freeze([
  { GetList: "GetPeople",  GetSingle: "GetPerson", Put: "PutPerson", Post: "PostPerson", Delete: "DeletePerson", TitleForList: "People", TitleForSingle: "Person" },
  { GetList: "GetBooks", GetSingle: "GetBook", Put: "PutBook", Post: "PostBook", Delete: "DeleteBook", TitleForList: "Books", TitleForSingle: "Book" },
  { GetList: "GetMovies",  GetSingle: "GetMovie",  Put: "PutMovie",  Post: "PostMovie",  Delete: "DeleteMovie",  TitleForList: "Movies", TitleForSingle: "Movie" },
])

const getErrorText = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log('CrudService:',error.response.status);
    console.log('CrudService:',error.response.headers);
    return `Operation failed. The server responded with error ${error.response.status}. ${error.response.data}`
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
    return `Operation failed. The server did not respond`
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
    return `Operation failed, reason ${error.message}`
  }
}

export const useCrudSingle = () => {

  const state = reactive({ 
    ok: false, 
    loading: false, 
    dto: {}, 
    schematool: new Schematool(null), 
    submitAttempted: false, 
    copydto: {}  
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

  const doGet = (idx, id) => {
    state.loading = true
    state.ok = false
    return new Promise((resolve, reject) => {
    get(idx, id)
      .then(response => {
        state.schematool = new Schematool(response.data.schema)
        state.dto = response.data.data || {}
        state.copydto = cloneDeep(state.dto)
        state.ok = true
        resolve()
      })
      .catch(error => {
        const txt = getErrorText(error)
        state.ok = false
        reject(new Error(txt))
      })
      .finally(() => state.loading = false)
    })
  }

  const editFields = computed(() =>  {
    return state.schematool.editFields()
  })

  
  const titleForSingle = (idx) => {
    return apiMethods[idx].TitleForSingle
  }

  return { state, get, post, put, doGet, getErrorText, editFields,titleForSingle }
}

export const useNaming = (context) => {

  const apiIndex = computed({
    get: () => { 
      return (context.root.$store.state.apiIndex && context.root.$store.state.apiIndex >= 0) ? context.root.$store.state.apiIndex : 0},
    set: val => {
      context.root.$store.commit('setApiIndex', val)
    }
  })
  
  const dtoList = computed(() => apiMethods.map(obj => obj.TitleForList))
  const titleForList = computed(() => apiMethods[apiIndex.value].TitleForList )
  
  return { apiIndex, dtoList, titleForList }
}

export const useCrudList = (context) => {
  const state = reactive({
    dtos: [],
    schema: {},
    loading: false,
    ok: false
  })
  
  const { apiIndex, dtoList, titleForList } = useNaming(context)
  
  const getList = (idx) => {
    const endpoint = `${RESOURCE_NAME}/${apiMethods[idx].GetList}`
    console.log('getList',endpoint)
    return Axios.get(endpoint);
  }

  const doGetList = (idx) => {
      state.loading = true
      state.schema = {}
      state.dtos = []
      state.ok = false
      return new Promise((resolve, reject) => {  
      getList(idx)
      .then(response => {
        state.dtos = response.data.data || []   
        state.schema = response.data.schema
        state.ok = true
        resolve(response.data) 
      })
      .catch(error => {
        state.dtos = []
        const txt = getErrorText(error)
        state.ok = false
        reject(new Error(txt))
      })
      .finally(() => {
        state.loading = false
      })
    })
  }

  const fields = computed(() =>  {
      if (!Array.isArray(state.dtos) || !state.dtos.length) {
        return []
      }
      if (!Array.isArray(state.schema.Props) || !state.schema.Props.length) {
        return []
      }
      return state.schema.Props.map(obj => {return {key: obj.Name, label: obj.Title}})
  }
  )

  const titleForSingle = computed(() => apiMethods[apiIndex.value].TitleForSingle )

  const apiIndexFromTitle = (title) => {
    return apiMethods.findIndex(obj => obj.TitleForList === title) 
  }
  
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

  return { state, apiIndex, apiIndexFromTitle, doGetList, fields, dtoName, dtoList, titleForSingle, titleForList, deleteDto, getErrorText }
}
