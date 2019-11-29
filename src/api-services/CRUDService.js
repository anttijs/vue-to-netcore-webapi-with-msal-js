import Axios from 'axios'
const RESOURCE_NAME = process.env.VUE_APP_API_ENDPOINT
export default {
    getList(apiIndex) {
        var endpoint = `${RESOURCE_NAME}/${apiMethods[apiIndex].GetList}`
        console.log('Axios.get, endpoint:',endpoint, 'apiIndex:', apiIndex)
        return Axios.get(endpoint);
    },

    get(apiIndex, id) {
        var endpoint = `${RESOURCE_NAME}/${apiMethods[apiIndex].GetSingle}/${id}`
        console.log('Axios.get, endpoint:',endpoint, 'apiIndex:', apiIndex)
        return Axios.get(endpoint);
    },

    post(apiIndex, dto) {
        var endpoint = `${RESOURCE_NAME}/${apiMethods[apiIndex].Post}`
        console.log('Axios.post, endpoint:',endpoint, 'apiIndex:', apiIndex)
        return Axios.post(endpoint, dto)
    },

    put(apiIndex, dto) {
        var endpoint = `${RESOURCE_NAME}/${apiMethods[apiIndex].Put}/${dto.Id}`
        console.log('Axios.put, endpoint:',endpoint, 'apiIndex:', apiIndex, 'dto:', dto)
        return Axios.put(endpoint, dto)
    },

    delete(apiIndex, id, token) {
        var endpoint = `${RESOURCE_NAME}/${apiMethods[apiIndex].Delete}/${id}`
        console.log('Axios.delete, endpoint:',endpoint, 'apiIndex:', apiIndex)
        return Axios.delete(endpoint, { headers: {"Authorization" : `Bearer ${token}`} });
    },
    showError(toasted, error) {
        var txt=""
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            txt = `Operation failed. The server responded with error ${error.response.status}`
            toasted.show(txt, { type: "error", duration: null })
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            txt = `Operation failed. The server did not respond`
            toasted.show(txt, { type: "error", duration: null })
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            txt = `Operation failed, reason ${error.message}`
            toasted.show(txt, { type: "error", duration: null })
        }
    }

}
export const apiMethods = Object.freeze([
    { GetList: "GetPeople",  GetSingle: "GetPerson", Put: "PutPerson", Post: "PostPerson", Delete: "DeletePerson", TitleForList: "People", TitleForSingle: "Person" },
    { GetList: "GetBooks", GetSingle: "GetBook", Put: "PutBook", Post: "PostBook", Delete: "DeleteBook", TitleForList: "Books", TitleForSingle: "Book" },
    { GetList: "GetMovies",  GetSingle: "GetMovie",  Put: "PutMovie",  Post: "PostMovie",  Delete: "DeleteMovie",  TitleForList: "Movies", TitleForSingle: "Movie" },
])
