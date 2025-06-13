<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- En-tête avec icône -->
    <div class="flex items-center gap-3 pb-4 border-b border-base-200">
      <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
        <svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold">
          {{ isEditMode ? t('activities.edit.note') : t('activities.new.note') }}
        </h3>
        <p class="text-sm text-base-content/70">{{ t('activities.noteDescription') }}</p>
      </div>
    </div>

    <!-- Titre -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ t('common.title') }} *</span>
      </label>
      <input
        v-model="formData.title"
        type="text"
        class="input input-bordered w-full"
        :placeholder="t('activities.noteTitlePlaceholder')"
        required
      />
    </div>

    <!-- Contenu -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ t('common.content') }} *</span>
      </label>
      <textarea
        v-model="formData.content"
        class="textarea textarea-bordered h-48"
        :placeholder="t('activities.noteContentPlaceholder')"
        required
      ></textarea>
    </div>

    <!-- Métadonnées -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Catégorie/Tags -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-medium">{{ t('activities.note.category') }}</span>
        </label>
        <select v-model="formData.noteCategory" class="select select-bordered w-full">
          <option value="">{{ t('common.select') }}</option>
          <option value="GENERAL">{{ t('activities.note.categories.general') }}</option>
          <option value="MEETING_NOTES">{{ t('activities.note.categories.meetingNotes') }}</option>
          <option value="CALL_NOTES">{{ t('activities.note.categories.callNotes') }}</option>
          <option value="FOLLOW_UP">{{ t('activities.note.categories.followUp') }}</option>
          <option value="PERSONAL">{{ t('activities.note.categories.personal') }}</option>
          <option value="IMPORTANT">{{ t('activities.note.categories.important') }}</option>
        </select>
      </div>

      <!-- Visibilité -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-medium">{{ t('activities.note.visibility') }}</span>
        </label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.noteVisibility"
              type="radio"
              value="PRIVATE"
              class="radio radio-warning radio-sm"
            />
            <span class="text-sm">{{ t('activities.note.private') }}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.noteVisibility"
              type="radio"
              value="SHARED"
              class="radio radio-warning radio-sm"
            />
            <span class="text-sm">{{ t('activities.note.shared') }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Indicateur de longueur du contenu -->
    <div class="flex justify-between items-center text-sm text-base-content/70">
      <span>{{ getContentStats() }}</span>
      <span v-if="formData.content.length > 0" class="badge badge-outline">
        {{ formData.content.length }} {{ t('activities.note.characters') }}
      </span>
    </div>

    <!-- Aperçu formaté (si contenu Markdown détecté) -->
    <div v-if="hasMarkdownContent" class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ t('activities.note.preview') }}</span>
      </label>
      <div class="p-4 bg-base-100 border border-base-300 rounded-lg">
        <div class="prose prose-sm max-w-none" v-html="formattedContent"></div>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-between pt-6 border-t border-base-200">
      <div class="flex gap-2">
        <!-- Boutons de formatage rapide -->
        <button
          type="button"
          class="btn btn-outline btn-sm"
          @click="insertFormat('**', '**', 'Texte en gras')"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn-outline btn-sm"
          @click="insertFormat('*', '*', 'Texte en italique')"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
          </svg>
        </button>
        <button type="button" class="btn btn-outline btn-sm" @click="insertBulletList()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
            />
          </svg>
        </button>
      </div>

      <div class="flex gap-3">
        <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
          {{ t('common.cancel') }}
        </button>
        <button type="submit" class="btn btn-warning" :disabled="!isFormValid">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {{ isEditMode ? t('common.update') : t('common.create') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Activity, CreateActivityDto, UpdateActivityDto } from '@/types/activity.types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  activity?: Activity | null
  isEditMode?: boolean
}>()

const emit = defineEmits<{
  save: [data: CreateActivityDto | UpdateActivityDto]
  cancel: []
}>()

// État du formulaire
const formData = ref({
  type: 'NOTE' as const,
  title: '',
  content: '',
  noteCategory: '',
  noteVisibility: 'SHARED' as 'PRIVATE' | 'SHARED',
})

// Initialiser le formulaire si on édite
if (props.activity) {
  // Mapping des champs de l'activité vers le formulaire
  formData.value = {
    ...formData.value,
    title: props.activity.title || '',
    content: props.activity.content || '',
    noteCategory: props.activity.noteCategory || '',
    noteVisibility: (props.activity.noteVisibility as 'PRIVATE' | 'SHARED') || 'SHARED',
  }
}

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.value.title.trim().length > 0 && formData.value.content.trim().length > 0
})

// Statistiques du contenu
function getContentStats() {
  const words = formData.value.content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const lines = formData.value.content.split('\n').length
  return t('activities.note.stats', { words, lines })
}

// Détection de contenu Markdown
const hasMarkdownContent = computed(() => {
  const content = formData.value.content
  return /[*_`#\-\+\[\]]/g.test(content) && content.length > 10
})

// Contenu formaté (simulation simple de Markdown)
const formattedContent = computed(() => {
  let content = formData.value.content
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
  content = content.replace(/^- (.+)$/gm, '<li>$1</li>')
  content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  return content.replace(/\n/g, '<br>')
})

// Insérer du formatage dans le contenu
function insertFormat(before: string, after: string, defaultText: string) {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = formData.value.content.substring(start, end)
  const textToInsert = selectedText || defaultText

  const newContent =
    formData.value.content.substring(0, start) +
    before +
    textToInsert +
    after +
    formData.value.content.substring(end)

  formData.value.content = newContent

  // Repositionner le curseur
  setTimeout(() => {
    textarea.focus()
    const newPosition = start + before.length + textToInsert.length
    textarea.setSelectionRange(newPosition, newPosition)
  }, 0)
}

// Insérer une liste à puces
function insertBulletList() {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const bulletList = '\n- Élément 1\n- Élément 2\n- Élément 3\n'

  const newContent =
    formData.value.content.substring(0, start) +
    bulletList +
    formData.value.content.substring(start)

  formData.value.content = newContent

  // Repositionner le curseur
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + bulletList.length, start + bulletList.length)
  }, 0)
}

// Soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return

  const data = { ...formData.value } as Record<string, unknown>

  // Nettoyer les champs vides
  Object.keys(data).forEach((key) => {
    if (data[key] === '') {
      delete data[key]
    }
  })

  emit('save', data as CreateActivityDto | UpdateActivityDto)
}
</script>
