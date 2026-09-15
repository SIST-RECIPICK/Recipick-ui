```vue
<template>
  <div class="container community-page">
    <h2>후기 작성</h2>

    <!-- 레시피 선택 -->
    <section class="write-section">
      <label class="form-label">사용한 레시피</label>

      <div
        v-if="!selectedRecipe"
        class="card recipe-select"
        @click="openModal"
      >
        <span class="text-secondary">
          + 레시피를 선택해 주세요.
        </span>
      </div>

      <div
        v-else
        class="card recipe-selected"
      >
        <div class="recipe-selected__info">
          <img
            :src="selectedRecipe.att_file_no_main"
            :alt="selectedRecipe.rcp_nm"
            class="recipe-selected__thumb"
          />

          <div>
            <h3>{{ selectedRecipe.rcp_nm }}</h3>
          </div>
        </div>

        <button
          type="button"
          class="btn btn--ghost"
          @click="removeSelectedRecipe"
        >
          취소
        </button>
      </div>
    </section>

    <!-- 사진 -->
    <section class="write-section">
      <label class="form-label">사진</label>

      <div class="image-upload">
        <div
          v-if="imagePreview"
          class="image-preview"
        >
          <img
            :src="imagePreview"
            alt="후기 사진 미리보기"
          />

          <button
            type="button"
            class="btn btn--ghost image-preview__remove"
            @click="removeImage"
          >
            ✕
          </button>
        </div>

        <label
          v-else
          class="card image-upload__button"
        >
          <input
            type="file"
            accept="image/*"
            class="file-input-hidden"
            @change="handleFileChange"
          />

          <span class="text-secondary">
            + 사진 추가
          </span>
        </label>
      </div>
    </section>

    <!-- 제목 -->
    <section class="write-section">
      <div class="label-group">
        <label class="form-label">제목</label>

        <span class="text-secondary">
          {{ subject.length }}/50
        </span>
      </div>

      <input
        v-model="subject"
        type="text"
        class="input"
        placeholder="제목을 입력해주세요."
        maxlength="50"
      />
    </section>

    <!-- 내용 -->
    <section class="write-section">
      <label class="form-label">내용</label>

      <textarea
        v-model="content"
        class="input write-textarea"
        placeholder="레시피를 사용한 후기를 자유롭게 작성해주세요."
        rows="8"
      ></textarea>
    </section>

    <!-- 등록 -->
    <div class="write-actions">
      <button
        type="button"
        class="btn btn--primary"
        @click="handleSubmit"
      >
        등록하기
      </button>
    </div>

    <!-- 레시피 선택 모달 -->
    <ReviewRecipeSelect
      v-if="isModalOpen"
      @close="closeModal"
      @select="handleRecipeSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ReviewRecipeSelect from './ReviewRecipeSelect.vue'

const router = useRouter()

const isModalOpen = ref(false)
const selectedRecipe = ref(null)

const subject = ref('')
const content = ref('')

const imageFile = ref(null)
const imagePreview = ref('')

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleRecipeSelect = (recipe) => {
  selectedRecipe.value = recipe
  isModalOpen.value = false
}

const removeSelectedRecipe = () => {
  selectedRecipe.value = null
}

const handleFileChange = (e) => {
  const file = e.target.files[0]

  if (!file) {
    return
  }

  const MAX_SIZE = 8 * 1024 * 1024

  if (file.size > MAX_SIZE) {
    alert('이미지 용량은 8MB를 초과할 수 없습니다.')
    e.target.value = ''
    return
  }

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }

  imageFile.value = null
  imagePreview.value = ''
}

const handleSubmit = async () => {
  if (!subject.value.trim()) {
    alert('제목을 입력해 주세요.')
    return
  }

  if (!content.value.trim()) {
    alert('내용을 입력해 주세요.')
    return
  }

  if (!selectedRecipe.value) {
    alert('사용한 레시피를 선택해 주세요.')
    return
  }

  const boardData = {
    subject: subject.value.trim(),
    content: content.value.trim(),
    rcp_seq: selectedRecipe.value.rcp_seq
  }

  const formData = new FormData()

  formData.append(
    'board',
    new Blob(
      [JSON.stringify(boardData)],
      { type: 'application/json' }
    )
  )

  if (imageFile.value) {
    formData.append('file', imageFile.value)
  }

  try {
    await axios.post(
      'http://localhost:8080/review/insert',
      formData
    )

    alert('후기가 등록되었습니다.')
    router.push('/community/reviews')
  } catch (err) {
    console.error('등록 실패:', err)
    alert(err.response?.data || '등록에 실패했습니다.')
  }
}
</script>

<style scoped>
.community-page {
  padding-block: var(--space-6);
}

.write-section {
  margin-top: var(--space-5);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: var(--weight-medium);
}

.label-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 레시피 선택 */
.recipe-select {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  border: 1px dashed var(--border);
  cursor: pointer;
}

.recipe-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3);
}

.recipe-selected__info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.recipe-selected__thumb {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: var(--radius-md);
}

/* 사진 */
.image-upload {
  display: flex;
}

.image-upload__button,
.image-preview {
  width: 120px;
  height: 120px;
}

.image-upload__button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--border);
  cursor: pointer;
}

.file-input-hidden {
  display: none;
}

.image-preview {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview__remove {
  position: absolute;
  top: var(--space-1);
  right: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: rgb(0 0 0 / 50%);
  color: #fff;
  border-radius: var(--radius-pill);
}

/* 내용 */
.write-textarea {
  height: auto;
  min-height: 200px;
  padding-block: var(--space-3);
  resize: vertical;
}

/* 등록 */
.write-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-6);
}
</style>
```
