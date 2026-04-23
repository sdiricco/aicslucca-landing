<template>
  <div class="bg-primaryDarker text-white p-3 flex justify-between items-center w-full" ref="outsideRef" >
    <div class="container flex items-center justify-between mx-auto">
    <img src="/assets/images/Logo_Mini.png" />
    <button @click="toggleMobileMenu" class="block lg:hidden">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
    <!-- Menu per dispositivi desktop -->
    <nav class="hidden lg:flex">
      <ul class="flex space-x-4">
        <li><NuxtLink to="/" class="hover:border-b-2 text text-lg">Home</NuxtLink></li>
        <li><NuxtLink to="/comitato" class="hover:border-b-2 text-lg">Il Comitato</NuxtLink></li>
        <li><NuxtLink to="/contatti" class="hover:border-b-2 text-lg">Contatti</NuxtLink></li>
        <li><a href="https://www.aicsnetwork.net/" class="hover:border-b-2 text-lg">Tesseramento AICS</a></li>

      </ul>
    </nav>
  </div>
    <!-- Menu a tendina per dispositivi mobili -->
    <div v-if="isMobileMenuOpen" class="lg:hidden absolute top-16 left-0 bg-primaryDarker w-full z-10">
      <ul class="flex flex-col space-y-2 p-3">
        <li><NuxtLink @click="onClickNavLink" to="/" class="text-white hover:border-b-2" >Home</NuxtLink></li>
        <li><NuxtLink @click="onClickNavLink" to="/comitato" class="text-white hover:border-b-2">Il Comitato</NuxtLink></li>
        <li><NuxtLink @click="onClickNavLink" to="/contatti" class="text-white hover:border-b-2">Contatti</NuxtLink></li>
        <li><a href="https://www.aicsnetwork.net/" class="hover:border-b-2">Tesseramento AICS</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
// Variabile di stato per il controllo del menu mobile
const isMobileMenuOpen = ref(false);

// Funzione per aprire/chiuso il menu mobile
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

const outsideRef = ref(null)

onClickOutside(outsideRef, ()=>{
  isMobileMenuOpen.value = false
})

function onClickNavLink(){
  isMobileMenuOpen.value = false
}

</script>
