<script setup lang="ts">
import EncoderDemo from './components/Encoder.vue'
</script>

<template>
  <div className="app">
    <span className="mono">deckfmt</span> Demo
    <EncoderDemo />
  </div>
</template>

<style scoped>
.app {
  font: 16px sans-serif;
}
.mono {
  font-family: monospace;
}
</style>
