<template>
  <div :class="{ 'user-select-none': userSelectNone }">
    <Scrollbar ref="scrollbar" v-show="!showLyrics" @set-user-select-none="handleSetUserSelectNone" />
    <Navbar ref="navbar" v-show="showNavbar" />
    <main ref="main" :style="{ overflow: enableScrolling ? 'auto' : 'hidden' }" @scroll="handleScroll">
      <keep-alive>
        <router-view v-if="route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!route.meta.keepAlive"></router-view>
    </main>
    <transition name="slide-up">
      <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
    </transition>
    <Toast/>
    <ModalAddTrackToPlaylist v-if="isAccountLogged" />
    <ModalNewPlaylist v-if="isAccountLogged" />
    <transition v-if="enablePlayer" name="slide-up">
      <Lyrics v-show="showLyrics" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import Scrollbar from "./components/Scrollbar.vue";
import Navbar from "./components/Navbar.vue";
import Toast from "./components/Toast.vue";
import ModalAddTrackToPlaylist from "./components/ModalAddTrackToPlaylist.vue";
import ModalNewPlaylist from "./components/ModalNewPlaylist.vue";
import Player from "./components/Player.vue";
import Lyrics from "./views/lyrics.vue";
import { useStore } from 'vuex'
import {computed, onMounted, ref, toRefs} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAccountLoggedIn, isLooseLoggedIn } from "./utils/auth.ts";

const store = useStore()
const { showLyrics, settings, player, enableScrolling } = toRefs(store.state)
const route = useRoute()
const router = useRouter()

const scrollbar = ref()

const isElectron = ref(process.env.IS_ELECTRON)
const userSelectNone = ref(false)
const isAccountLogged = computed(() => {
  return isAccountLoggedIn()
})
const showPlayer = computed(() => {
  return ['mv', 'loginUsername', 'login', 'loginAccount', 'lastfmCallback'].includes(route.name)
})
const enablePlayer = computed(() => {
  return player.value.enabled && route.name !== 'lastfmCallback'
})
const showNavbar = computed(() => {
  return route.name !== 'lastfmCallback'
})

const handleSetUserSelectNone = (val) => {
  userSelectNone.value = val
}
const handleScroll = () => {
    scrollbar.value?.handleScroll()
}
const handleKeydown = (e) => {
  console.log(e)
  if (e.code === 'Space') {
    if (e.target.tagName === 'INPUT') return false;
    if (route.name === 'mv') return false;
    e.preventDefault()
    player.value.playOrPause()
  }
}
const fetchData = () => {
  if (!isLooseLoggedIn()) return
  store.dispatch('fetchLikedSongs')
  store.dispatch('fetchLikedSongsWithDetails')
  store.dispatch('fetchLikedPlaylist')
  if (isAccountLoggedIn()) {
    store.dispatch('fetchLikedAlbums')
    store.dispatch('fetchLikedArtists')
    store.dispatch('fetchLikedMVs')
    store.dispatch('fetchCloudDisk')
  }
}

onMounted(() => {
  if (isElectron.value) {

  }
  window.addEventListener('keydown', handleKeydown)
  fetchData()
})
</script>

<style scoped lang="scss">
#app {
  width: 100%;
  transition: all 0.4s;
}
main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
  scrollbar-width: none; // firefox
}

@media (max-width: 1336px) {
  main {
    padding: 64px 5vw 96px 5vw;
  }
}

main::-webkit-scrollbar {
  width: 0px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
