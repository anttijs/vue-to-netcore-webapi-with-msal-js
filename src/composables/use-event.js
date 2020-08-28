import { onMounted, onBeforeUnmount, ref } from '@vue/composition-api'
import { unwrap } from '@/composables/utils'
export default function useEvent(el = ref(document), name, handler) {
  el = unwrap(el)
  const remove = () => el && el.removeEventListener(name, handler)

  onMounted(() => el && el.addEventListener(name, handler))
  onBeforeUnmount(remove)

  return remove
}
