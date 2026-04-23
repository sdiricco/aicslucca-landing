<template>
  <div class="container-fluid mx-auto p-4 md:p-6 w-full h-full md:min-h-[750px] ">
    <div class="container mx-auto">
      <div class="flex gap-4 items-start">
        <ContattiLocation />
      </div>
 
      <ContattiMap />

    </div>
  </div>
</template>

<script setup>
useHead({
  title:'Contatti',
})


</script>
