<template>
  <div>
    <p>The blog posts are loaded automatically when you scroll to end, 10 per time. Credits to  <b-link href="https://github.com/LinusBorg/composition-api-demos" target="_blank">composition.api-demos.</b-link>
    <div class="flex flex-col items-center text-left">
      <article v-for="(post, i) in posts" :key="i">
        <Post :post="post" />
      </article>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from '@vue/composition-api'
import usePagination from '../composables/use-pagination'
import useEndOfPage from '../composables/use-endofpage'
import usePromiseFn from '../composables/use-promise'
import { blog } from '@/lib/BlogService'
import Post from '@/components/Post.vue'
export default {
  name: 'BlogPosts',
  components: { Post },
  setup() {
    const posts = reactive([])
    console.log('begins')
    const pagination = usePagination({ perPage: 9 })
    pagination.total.value = 100

    const { loading, error, result, use: getPosts } = usePromiseFn(
      (offset, perPage) =>
        blog.get({
          start: offset,
          limit: perPage,
        })
    )
    function next() {
      console.log('next')
      !loading.value && pagination.next()
    }

    watch(pagination.currentPage, () => {
      console.log('watch')
      getPosts(pagination.offset.value, pagination.perPage.value)
    })

    watch(result, (result) => {
      console.log('wathc result',result)
      result && posts.push(...result.data)
    })

    useEndOfPage(next, 150 /* px from bottom */)

    return {
      currentPage: pagination.currentPage,
      error,
      loading,
      next,
      posts
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
