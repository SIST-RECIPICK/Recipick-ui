<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <ChatView/>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import ChatView from './views/chat/ChatView.vue';
</script>
