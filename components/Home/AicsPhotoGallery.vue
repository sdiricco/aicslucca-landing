<template>
    <div class="bg-primaryDarker py-12 h-full md:min-h-[600px]">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-semibold mb-6 text-center text-white">AICS: un mondo di sport</h2>
        
        <!-- Galleria di immagini in griglia -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <!-- Immagine 1 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b?fit=crop&w=800&q=80" 
              alt="Soccer Ball" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
  
          <!-- Immagine 2 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?fit=crop&w=800&q=80" 
              alt="Basketball Game" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
  
          <!-- Immagine 3 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://plus.unsplash.com/premium_photo-1685207267343-1c8852b45575?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Cycling" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
  
          <!-- Immagine 4 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Tennis Court" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
  
          <!-- Immagine 5 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://images.unsplash.com/photo-1516822003754-cca485356ecb?fit=crop&w=800&q=80" 
              alt="Yoga Pose" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
  
          <!-- Immagine 6 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://images.unsplash.com/photo-1599204606472-2aa892d4b26c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Soccer Player" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
  
          <!-- Immagine 7 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://images.unsplash.com/photo-1566932769119-7a1fb6d7ce23?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Running Track" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
  
          <!-- Immagine 8 -->
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img 
              src="https://plus.unsplash.com/premium_photo-1664299916129-fe43443c9177?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Swimming" 
              class="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  /* Effetti di transizione per l'ingrandimento al passaggio del mouse */
  img {
    transition: transform 0.3s ease-in-out;
  }
  
  img:hover {
    transform: scale(1.05);
  }
  </style>
  