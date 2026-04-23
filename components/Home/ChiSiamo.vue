<template>
  <div class="bg-white h-fullh-full md:min-h-[600px] py-12">
    <div class="container mx-auto flex flex-col md:flex-row items-center justify-center ">
      <!-- Sezione di testo -->
      <div class="text-center md:text-left md:w-1/2 px-6 pt-6">
        <img class="w-24 md:w-30 mx-auto md:mx-0" src="/assets/images/logo_aicslucca.png" alt="Logo AICS Lucca">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primaryDark">Chi siamo</h2>
        <p class="md:text-xl mb-6 text-left text-paragraphText">
          Il Comitato Provinciale A.I.C.S. di Lucca è l’articolazione territoriale
          dell’Associazione Italiana Cultura e Sport, Ente di Promozione Sportiva
          riconosciuto dal CONI, Ente con carattere assistenziale riconosciuto dal
          Ministero degli Interni e Associazione di Promozione Sociale iscritta
          nel Registro Nazionale delle Associazioni di Promozione Sociale.
        </p>
      </div>

      <!-- Sezione dell'immagine con bilanciamento migliorato -->
      <div class="md:w-1/2 mx-auto pb-6 md:mx-0 flex justify-center items-center">
        <!-- Immagine significativa che rimanda ai social -->
        <a href="https://www.facebook.com/aicscomitatoprovinciale.lucca/" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?fit=crop&w=1200&q=80" 
            alt="Sport Image"
            class="rounded-lg img p-6 md:p-0 w-full md:min-h-[400px] hover:opacity-90 transition duration-300"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Stile per l'immagine */
.img {
  width: 100%;
  max-width: 440px; /* Limita la larghezza per adattarsi meglio allo schermo */
  height: auto;
}
</style>
