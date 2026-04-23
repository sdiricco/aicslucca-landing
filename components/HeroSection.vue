<template>
  <div class="container-fluid flex flex-col items-center justify-center w-full mx-auto p-6 md:p-4 h-full relative overflow-hidden bg-primaryDarker ">
    <!-- Immagine di sfondo con opacità -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-40 z-10"></div>
       <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Background Image" class="absolute inset-0 w-full h-full object-cover z-0" />
    </div>

    <!-- Container flessibile per gli elementi -->
    <div class="flex flex-col items-center justify-between relative z-10 text-center">
      <!-- Prima riga -->
      <div>
        <!-- Elemento a sinistra -->
        <div>
          <div class="text-white text-left md:text-center text-4xl sm:text-6xl md:text-5xl capitalize font-bold">IL TUO SPORT SEMPRE IN TASCA</div>
        </div>
        <!-- Elemento a destra -->
        <div>
          <div>
            <img class="text-center" src="/assets/images/logo_aicslucca.png" alt="">
          </div>
        </div>
      </div>
      <!-- NuxtPage riempirà lo spazio rimanente -->
      <NuxtPage class="flex-grow" />
    </div>
  </div>
</template>
