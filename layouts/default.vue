<template>
  <!-- Main container -->
  <div class="main-container min-h-screen">
    <!-- Header (navbar) -->
    <header class="sticky top-0 z-10">
      <HomeHeader />
    </header>
    
    <!-- Main content -->
    <main ref="homeHeadingRef" class="content overflow-auto">
      <!-- Inserisci qui il contenuto della tua pagina -->
      <slot ></slot>

    </main>
    
    <!-- Footer -->
    <footer class="footer w-full">
      <Footer />
    </footer>
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/Home/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Usa l'intera altezza della viewport */
  overflow: hidden; /* Evita overflow indesiderato */
}

.content {
  flex: 1; /* Fa in modo che il contenuto prenda tutto lo spazio disponibile */
  overflow-y: auto; /* Permetti lo scroll verticale */
  overflow-x: hidden; /* Evita lo scroll orizzontale */
}
</style>
