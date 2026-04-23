<template>
  <div class="bg-primaryDarker py-12 min-h-full md:min-h-[600px]">
    <div class="container mx-auto flex flex-col md:flex-row gap-8 items-center justify-center md:py-20">
      <!-- Sezione immagine -->
      <div class="md:w-1/2 mx-auto md:mx-0 md:flex items-center gap-8 justify-center pb-6">
        <!-- Immagine mockup dell'app sportiva -->
        <img 
          src="@/assets/images/aicsApp.png" 
          alt="App Mockup Sportiva" 
          class=" w-80 rounded-lg hover:opacity-80 transition duration-300"
        />
      </div>
      <!-- Sezione testo e call-to-action -->
      <div class="text-white text-center md:text-left md:w-1/2 px-8">
        <h2 class=" text-3xl md:text-4xl font-semibold mb-6">
          Una nuova App gratuita per seguire i campionati di Calcio AICS!
        </h2>
        <p class="text-lg md:text-xl mb-8 hidden md:block ">
 
         clicca sul link qui sotto per accedere gratuitamente all'app.
        </p>
        <!-- Pulsante di call-to-action -->
        <a target="blank"
          href="https://aicslucca-campionati.onrender.com/#/tournaments"
          class="bg-white translate-y-1 shadow-md rounded-2xl text-primaryDarker font-semibold px-6 py-3  hover:text-primaryDark transition duration-300"
        >
          Clicca qui per accedere all'App
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Stile per migliorare la visualizzazione dell'immagine su schermi più piccoli */
img {
  max-width: 100%;
  height: auto;
}
</style>
