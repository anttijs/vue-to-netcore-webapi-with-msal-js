import Axios from 'axios'
const BLOGPOSTS_URL = 'https://jsonplaceholder.typicode.com/posts'


function getPosts({ start = 0, limit = 5 } = {}) {
  return wait(
    Axios.get(BLOGPOSTS_URL, {
      params: {
        _start: start,
        _limit: limit,
      },
    })
  )
}

const blog = {
  get: getPosts,
}


export { blog }

function wait(promise, n = 10) {
  return new Promise(res => setTimeout(() => res(promise), n))
}
