<template>
  <div>
    <transition name="fade">
      <div id="scrollbar" v-show="show" :class="{ 'on-drag': isOnDrag }" @click="handleClick">
        <div
            id="thumbContainer"
            :class="{ active }"
            :style="thumbStyle"
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave"
            @mousedown="handleDragStart"
            @click.stop
            >
          <div></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, getCurrentInstance, reactive, defineEmits} from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const emits = defineEmits(['set-user-select-none'])

const top = ref(0)
const thumbHeight = ref(0)
const hideTimer = ref(null)
const show = ref(false)
const isOnDrag = ref(false)
const onDragClientY = ref(0)
const positions = reactive({
  home: {
    scrollTop: 0,
    params: {}
  }
})
const active = ref(false)
const thumbStyle = computed(() => {
  return {
    transform: `translateY(${top.value}px)`,
    height: `${thumbHeight.value}px`
  }
})
const main = computed(() => {
  return getCurrentInstance()?.proxy?.$refs.main
})

const handleClick = (e) => {
  console.log(e)
  let scrollTop
  if (e.clientY < top.value + 84) {
    scrollTop = -256
  } else {
    scrollTop = 256
  }
  main.value.scrollBy({
    top: scrollTop,
    behavior: 'smooth'
  })
}
const handleMouseenter = () => {
  active.value = true
}
const handleMouseleave = () => {
  active.value = false
  setScrollbarHideTimeout()
}
const handleDragStart = (e) => {
  console.log(e)
  onDragClientY.value = e.clientY
  isOnDrag.value = true
  emits('set-user-select-none', true)
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
}
const handleDragMove = (e) => {
  if (!isOnDrag.value) return
  const clientHeight = main.value.clientHeight - 128
  const scrollHeight = main.value.scrollHeight - 128
  const clientY = e.clientY
  const scrollTop = main.value.scrollTop
  const offset = ~~(((clientY - onDragClientY.value) / clientHeight) * scrollHeight)
  top.value = ~~((scrollTop / scrollHeight) * clientHeight)
  main.value.scrollBy(0, offset)
  onDragClientY.value = clientY
}
const handleDragEnd = () => {
  isOnDrag.value = false
  emits('set-user-select-none', false)
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
}
const setScrollbarHideTimeout = () => {
  if (hideTimer.value !== null) clearTimeout(hideTimer.value)
  hideTimer.value = setTimeout(() => {
    if (!active.value) {
      show.value = false
    }
    hideTimer.value = null
  }, 4000)
}
const restorePosition = () => {
  if (!route.meta.savePosition || positions[route.name] === undefined || main.value === undefined) {
    return
  }
  main.value.scrollTo({ top: positions[route.name].scrollTop })
}
const handleScroll = () => {
  const clientHeight = main.value.clientHeight - 128
  const scrollHeight = main.value.scrollHeight - 128
  const scrollTop = main.value.scrollTop
  let topH = ~~((scrollTop / scrollHeight) * clientHeight)
  let thumbHeightH = ~~((clientHeight / scrollHeight) * clientHeight)

  if (thumbHeightH < 24) thumbHeightH = 24
  if (topH > clientHeight - thumbHeightH) {
    topH = clientHeight - thumbHeightH
  }
  top.value = topH
  thumbHeight.value = thumbHeightH

  if (!show.value && clientHeight !== thumbHeightH) show.value = true
  setScrollbarHideTimeout()

  if (route.meta.savePosition) {
    positions[route.name] = { scrollTop, params: route.params }
  }
}

onMounted(() => {
  router.beforeEach((to, from, next) => {
    show.value = false
    next()
  })
})
</script>



<style scoped lang="scss">
#scrollbar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 1000;

  #thumbContainer {
    margin-top: 64px;
    div {
      transition: background 0.4s;
      position: absolute;
      right: 2px;
      width: 8px;
      height: 100%;
      border-radius: 4px;
      background: rgba(128, 128, 128, 0.38);
    }
  }
  #thumbContainer.active div {
    background: rgba(128, 128, 128, 0.58);
  }
}

[data-theme='dark'] {
  #thumbContainer div {
    background: var(--color-secondary-bg);
  }
}

#scrollbar.on-drag {
  left: 0;
  width: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
