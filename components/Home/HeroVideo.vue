<template>
  <div class="relative" style="height: calc(100vh - 70px - 116.42px);">
    <!-- Video Hero -->
    <video class="w-full h-full object-cover" autoplay muted loop>
      <source src="/assets/video/calcioHero.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <!-- Overlay per consentire l'accesso al menu -->
    <div class="absolute top-0 left-0 w-full h-full bg-primaryDarker opacity-40"></div>
    <!-- Header Content -->
    <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <div class="container relative gap-1 items-center mx-auto flex flex-col md:flex-row">
        <!-- Blocco sinistro con testo e pulsante -->
        <div class="w-full md:w-1/2 text-center md:text-left">
          <div>
            <img class="w-1/3 mx-auto md:mx-0" src="/assets/images/logo_aicslucca.png" alt="" />
            <!-- Titolo con hashtag -->
            <h2 class="text-4xl md:text-5xl font-bold text-white mt-4 px-4 py-2"
              style="-webkit-text-stroke: 1px #183462; text-shadow: 0 0 10px rgba(24, 52, 98, 0.7);">
              #FOREVERYONE
            </h2>
            <!-- Titolo principale -->
            <h1 class="text-5xl md:text-7xl font-bold text-white mt-4">
              IL TUO SPORT<br />
              SEMPRE CON TE
            </h1>
            <p class="mt-4 text-lg md:text-2xl text-white px-12 md:px-0 text-left">
              Entra nel mondo AICS e diventi protagonista del tuo sport!
            </p>
          </div>
        </div>
        <!-- Blocco destro con immagine -->
        <div class="md:block md:w-2/3 md:mt-0">
          <!-- <img
            src="/assets/images/hero.png"
            alt="Immagine squadra calcio"
            class="w-full h-90 object-cover"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>
