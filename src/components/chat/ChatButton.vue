<template>
  <button class="chat_button" @click="$emit('open')">
    💬
  </button>
</template>

<script setup>
defineEmits(['open'])
</script>

<style scoped>
.chat_button {
  position: fixed;
  right: 30px;
  bottom: 30px;

  width: 60px;
  height: 60px;

  border: none;
  border-radius: 50%;

  background-color: white;

  font-size: 27px;

  cursor: pointer;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  z-index: 1000;

  transition: 0.2s;
}

.chat_button:hover {
  transform: scale(1.08);
}
</style>