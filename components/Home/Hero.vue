<template>
  <div
    class="flex-reverse items-center md:flex justify-center  min-h-full pb-0 md:pb-60 w-full mx-auto white md:pt-2 md:mt-0 bg-white h-full"
  >
    <!-- Container flessibile per la hero section -->
    <div
      class="container relative gap-1 items-center mx-auto flex flex-col md:flex-row p-6"
    >
      <!-- Blocco sinistro con testo e pulsante -->
      <div class="w-full md:w-1/2">
        <div class="text-left">
          <img class="w-1/3" src="/assets/images/logo_aicslucca.png" alt="" />
          <div class=" text-hero font-bold text-primaryDarker">
            IL TUO SPORT<br />
            SEMPRE CON TE
          </div>
          <p class="mt-3 text-lg md:text-xl text-primary">
            Entra nel mondo AICS e diventi protagonista del tuo sport! Contenuti
            sempre aggiornati e un app dedicata per darti il massimo
          </p>
        </div>
      </div>
      <!-- Blocco destro con immagine -->
      <div class="md:block md:w-2/3 md:mt-0">
        <img
          src="/assets/images/hero.png"
          alt="Immagine squadra calcio"
          class="w-full h-90 object-cover"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-hero{
  font-size: 8rem;
  line-height: 5rem;
}
</style>

