import { PortableText } from '@portabletext/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('PortableText', PortableText)
})
