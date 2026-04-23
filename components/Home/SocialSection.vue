<template>
  <div class="bg-white py-10 h-full md:max-h-[600px]">
    <div class="container mx-auto flex flex-col md:flex-row items-center justify-center md:py-16">
      <div class="text-center md:text-left md:w-1/2 px-6">
        <h2 class="text-3xl text-primaryDarker   md:text-4xl font-semibold mb-4">Seguici su Facebook</h2>
        <p class="text-lg text-paragraphText md:text-xl mb-6">Rimani sempre aggiornato su news e eventi!</p>
        <!-- Aggiungi qui un testo o un pulsante per invitare all'azione -->
        <a href="https://www.facebook.com/aicscomitatoprovinciale.lucca/" target="_blank" rel="noopener noreferrer" class="bg-primary text-white rounded-full py-2 px-6 text-lg font-semibold shadow-lg hover:bg-primaryLighter hover:text-white transition duration-300">Seguici</a>
      </div>
      <div class="md:w-1/2 mx-auto md:mx-0 hidden md:block">
        <!-- Immagine significativa che rimanda ai social -->
        <a href="https://www.facebook.com/aicscomitatoprovinciale.lucca/" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/team.png" alt="Facebook Cover Image" class="rounded-lg text-primaryDarker  hover:opacity-80 transition duration-300">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
  /* Stile per l'immagine */
  img {
    width: 100%;
    max-width: 400px; /* Limita la larghezza per adattarsi meglio allo schermo */
    height: auto;
  }
</style>
