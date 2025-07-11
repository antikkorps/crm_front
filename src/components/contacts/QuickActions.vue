<template>
  <div class="quick-actions card bg-base-100 shadow-md mb-4">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h3 class="card-title">
          <Iconify icon="mdi:lightning-bolt" class="w-5 h-5 mr-2 text-primary" />
          {{ t('contacts.quickActions') }}
        </h3>
        <div class="dropdown dropdown-end">
          <button class="btn btn-ghost btn-sm" tabindex="0">
            <Iconify icon="mdi:dots-vertical" class="w-4 h-4" />
          </button>
          <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
            <li>
              <button @click="showAllActions = !showAllActions">
                <Iconify icon="mdi:eye" class="w-4 h-4" />
                {{ showAllActions ? t('common.showLess') : t('common.showMore') }}
              </button>
            </li>
            <li>
              <button @click="customizeActions">
                <Iconify icon="mdi:cog" class="w-4 h-4" />
                {{ t('common.customize') }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Actions principales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          class="quick-action-btn btn btn-primary btn-outline hover:btn-primary transition-all duration-200"
          @click="navigateTo('contact-create')"
          :title="t('contacts.addContact')"
        >
          <div class="flex flex-col items-center">
            <Iconify icon="mdi:account-plus" class="w-6 h-6 mb-1" />
            <span class="text-sm font-medium">{{ t('contacts.addContact') }}</span>
          </div>
        </button>

        <button
          class="quick-action-btn btn btn-secondary btn-outline hover:btn-secondary transition-all duration-200"
          @click="navigateTo('segment-create')"
          :title="t('segments.createSegment')"
        >
          <div class="flex flex-col items-center">
            <Iconify icon="mdi:filter-plus" class="w-6 h-6 mb-1" />
            <span class="text-sm font-medium">{{ t('segments.createSegment') }}</span>
          </div>
        </button>

        <button
          class="quick-action-btn btn btn-accent btn-outline hover:btn-accent transition-all duration-200"
          @click="navigateTo('contacts-list')"
          :title="t('contacts.viewAllContacts')"
        >
          <div class="flex flex-col items-center">
            <Iconify icon="mdi:format-list-bulleted" class="w-6 h-6 mb-1" />
            <span class="text-sm font-medium">{{ t('contacts.viewAllContacts') }}</span>
          </div>
        </button>

        <button
          class="quick-action-btn btn btn-info btn-outline hover:btn-info transition-all duration-200"
          @click="navigateTo('segments')"
          :title="t('segments.viewAllSegments')"
        >
          <div class="flex flex-col items-center">
            <Iconify icon="mdi:filter-variant" class="w-6 h-6 mb-1" />
            <span class="text-sm font-medium">{{ t('segments.viewAllSegments') }}</span>
          </div>
        </button>
      </div>

      <!-- Actions supplémentaires (cachées par défaut) -->
      <div v-if="showAllActions" class="mt-4 pt-4 border-t border-base-300">
        <h4 class="text-sm font-medium mb-3 text-base-content/70">
          {{ t('common.additionalActions') }}
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            class="quick-action-btn btn btn-ghost btn-sm"
            @click="navigateTo('contact-import')"
            :title="t('contacts.importContacts')"
          >
            <Iconify icon="mdi:upload" class="w-4 h-4 mr-2" />
            {{ t('contacts.importContacts') }}
          </button>

          <button
            class="quick-action-btn btn btn-ghost btn-sm"
            @click="navigateTo('contact-export')"
            :title="t('contacts.exportContacts')"
          >
            <Iconify icon="mdi:download" class="w-4 h-4 mr-2" />
            {{ t('contacts.exportContacts') }}
          </button>

          <button
            class="quick-action-btn btn btn-ghost btn-sm"
            @click="navigateTo('contact-duplicates')"
            :title="t('contacts.findDuplicates')"
          >
            <Iconify icon="mdi:account-multiple-check" class="w-4 h-4 mr-2" />
            {{ t('contacts.findDuplicates') }}
          </button>

          <button
            class="quick-action-btn btn btn-ghost btn-sm"
            @click="navigateTo('contact-bulk-edit')"
            :title="t('contacts.bulkEdit')"
          >
            <Iconify icon="mdi:account-edit" class="w-4 h-4 mr-2" />
            {{ t('contacts.bulkEdit') }}
          </button>

          <button
            class="quick-action-btn btn btn-ghost btn-sm"
            @click="navigateTo('contact-tags')"
            :title="t('contacts.manageTags')"
          >
            <Iconify icon="mdi:tag-multiple" class="w-4 h-4 mr-2" />
            {{ t('contacts.manageTags') }}
          </button>

          <button
            class="quick-action-btn btn btn-ghost btn-sm"
            @click="navigateTo('contact-activity')"
            :title="t('contacts.recentActivity')"
          >
            <Iconify icon="mdi:clock-outline" class="w-4 h-4 mr-2" />
            {{ t('contacts.recentActivity') }}
          </button>
        </div>
      </div>

      <!-- Indicateur de chargement -->
      <div v-if="loading" class="mt-4 flex items-center justify-center">
        <span class="loading loading-spinner loading-sm"></span>
        <span class="ml-2 text-sm text-base-content/70">{{ t('common.loading') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

interface Props {
  loading?: boolean
  showAllActionsByDefault?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showAllActionsByDefault: false,
})

const router = useRouter()
const { t } = useI18n()

const showAllActions = ref(props.showAllActionsByDefault)

// Fonction pour naviguer vers les différentes sections
function navigateTo(section: string) {
  switch (section) {
    case 'contacts-list':
      router.push('/contacts/list')
      break
    case 'segments':
      router.push('/segments')
      break
    case 'contact-create':
      router.push('/contacts/create')
      break
    case 'segment-create':
      router.push('/segments/create')
      break
    case 'contact-import':
      router.push('/contacts/import')
      break
    case 'contact-export':
      router.push('/contacts/export')
      break
    case 'contact-duplicates':
      router.push('/contacts/duplicates')
      break
    case 'contact-bulk-edit':
      router.push('/contacts/bulk-edit')
      break
    case 'contact-tags':
      router.push('/contacts/tags')
      break
    case 'contact-activity':
      router.push('/contacts/activity')
      break
    default:
      console.warn(`La section ${section} n'est pas encore implémentée`)
  }
}

// Fonction pour personnaliser les actions (placeholder pour future fonctionnalité)
function customizeActions() {
  // TODO: Implémenter la personnalisation des actions rapides
  console.log('Personnalisation des actions rapides')
}
</script>

<style scoped>
.quick-action-btn {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.2s ease-in-out;
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-action-btn:active {
  transform: translateY(0);
}

/* Animation pour l'apparition des actions supplémentaires */
.quick-actions .border-t {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .quick-action-btn {
    min-height: 70px;
  }

  .quick-action-btn span {
    font-size: 0.75rem;
  }
}
</style>
