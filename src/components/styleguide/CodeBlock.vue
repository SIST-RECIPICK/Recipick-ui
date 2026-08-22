<script setup>
/**
 * 코드 스니펫 + 복사 버튼.
 * 스타일가이드에서 예제 코드를 보여주고 클릭 한 번으로 복사.
 */
import { ref } from 'vue'
import { IconCopy, IconCheck } from '@tabler/icons-vue'

defineProps({
  code: { type: String, required: true },
})

const copied = ref(false)

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard API 실패 시 무시 (https 아닐 때 등)
  }
}
</script>

<template>
  <div class="code-block">
    <pre class="code-block__pre"><code>{{ code }}</code></pre>
    <button class="code-block__copy" :aria-label="copied ? '복사됨' : '코드 복사'" @click="copy(code)">
      <IconCheck v-if="copied" :size="14" />
      <IconCopy v-else :size="14" />
      {{ copied ? '복사됨' : '복사' }}
    </button>
  </div>
</template>

<style scoped>
.code-block {
  position: relative;
  background: var(--neutral-900);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.code-block__pre {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  padding-right: 72px;
  overflow-x: auto;
}
.code-block__pre code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: var(--text-xs);
  line-height: 1.6;
  color: var(--neutral-200);
  white-space: pre;
}
.code-block__copy {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-1) var(--space-2);
  background: var(--neutral-800);
  color: var(--neutral-300);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  transition: background var(--dur-fast) var(--ease);
}
.code-block__copy:hover { background: var(--neutral-700); color: #fff; }
</style>
