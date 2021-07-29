// This file is used to bind local classes to vue global context

import Vue from 'vue'
import SolanaManager from '~/utilities/SolanaManager/SolanaManager'
import SoundManager from '~/utilities/SoundManager/SoundManager'
import WebRTC from '~/utilities/WebRTC/WebRTC'
import Crypto from '~/utilities/Crypto/Crypto'

declare module 'vue/types/vue' {
  interface Vue {
    $WebRTC: typeof WebRTC
    $SolanaManager: typeof SolanaManager
    $Sounds: SoundManager
    $Crypto: Crypto
  }
}

declare module '@nuxt/types' {
  interface Context {
    $WebRTC: typeof WebRTC
    $SolanaManager: typeof SolanaManager
    $Sounds: SoundManager
    $Crypto: Crypto
  }
}

Vue.prototype.$WebRTC = new WebRTC()
Vue.prototype.$SolanaManager = new SolanaManager()
Vue.prototype.$Sounds = new SoundManager()
Vue.prototype.$Crypto = new Crypto()