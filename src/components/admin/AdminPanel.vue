<template>
  <section class="admin-panel">
    <slot />
  </section>
</template>

<script setup>
</script>

<style scoped>
.admin-panel {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  padding: var(--space-5);
}
</style>