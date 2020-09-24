import { reactive, toRefs } from '@vue/composition-api'

const getErrorText = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const txt2 = (typeof error.response.data.title === 'string' || error.response.data.title instanceof String) ? error.response.data.title : ""
    const txt = (typeof error.response.data === 'string' || error.response.data instanceof String) ? error.response.data : txt2
    return `Operation failed. The server responded with error ${error.response.status}. ${txt}`
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return `Operation failed. The server did not respond`
  } else {
    // Something happened in setting up the request that triggered an Error
    return `Operation failed, reason ${error.message}`
  }
}
export default function usePromise(fn) {
  if (!fn) {
    throw new Error(
      `[usePromise]: 1st argument is required (must be a function)`
    )
  }

  if (typeof fn !== 'function') {
    throw new Error(
      `[usePromise]: argument has to be function, but received ${typeof fn}`
    )
  }
  const state = reactive({
    loading: false,
    error: null,
    result: null,
  })

  let lastPromise
  const use = async (...args) => {
    state.error = null
    state.loading = true
    const promise = (lastPromise = fn(...args))
    try {
      const result = await promise
      if (lastPromise === promise) {
        state.result = result
      }
    } catch (error) {
        state.error = getErrorText(error)
    } finally {
      state.loading = false
    }
  }

  return {
    ...toRefs(state),
    use,
  }
}
