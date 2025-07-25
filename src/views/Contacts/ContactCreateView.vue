<template>
  <div class="contact-create-page container mx-auto p-4">
    <PageHeader :title="t('contacts.addContact')" :back-to="'/contacts'" />

    <div class="max-w-4xl mx-auto">
      <!-- Sélection de l'entreprise -->
      <div class="card bg-base-100 shadow-md mb-6">
        <div class="card-body">
          <h3 class="card-title text-lg mb-4">
            <Iconify icon="mdi:office-building" class="w-5 h-5" />
            {{ t('contacts.selectCompany') }}
          </h3>
          
          <CompanySearch
            v-model="selectedCompanyId"
            :label="t('common.company')"
            :placeholder="t('contacts.selectCompanyPlaceholder', 'Rechercher et sélectionner une entreprise...')"
            :error-message="!selectedCompanyId && showCompanyError ? t('validation.required') : ''"
            required
            @company-selected="onCompanySelected"
          />
        </div>
      </div>

      <!-- Formulaire de contact -->
      <div v-if="selectedCompanyId" class="card bg-base-100 shadow-md">
        <div class="card-body">
          <ContactForm
            :company-id="selectedCompanyId"
            :is-submitting="isSubmitting"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </div>

    <!-- Toast de succès -->
    <div v-if="showSuccessToast" class="toast toast-top toast-end">
      <div class="alert alert-success">
        <Iconify icon="mdi:check-circle" class="w-5 h-5" />
        <span>{{ t('contacts.contactCreatedSuccess') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CompanySearch from '@/components/common/CompanySearch.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ContactForm from '@/components/contacts/ContactForm.vue'
import { contactService } from '@/services/contact.service'
import { useCompanyStore } from '@/stores/company'
import type { ContactCreateDto } from '@/types/contact.types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const companyStore = useCompanyStore()

const selectedCompanyId = ref('')
const isSubmitting = ref(false)
const showSuccessToast = ref(false)
const showCompanyError = ref(false)

// Computed pour accéder aux entreprises du store
const companies = computed(() => companyStore.companies)

// Charger les entreprises au montage
onMounted(async () => {
  try {
    // Utiliser le store pour récupérer les entreprises
    await companyStore.fetchCompanies()
  } catch (error) {
    console.error('Erreur lors du chargement des entreprises:', error)
  }
})

async function handleSubmit(data: ContactCreateDto) {
  if (!selectedCompanyId.value) {
    showCompanyError.value = true
    return
  }

  isSubmitting.value = true
  
  try {
    const contactData = {
      ...data,
      companyId: selectedCompanyId.value
    }
    
    await contactService.createContact(contactData)
    
    // Afficher le toast de succès
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
    
    // Rediriger vers la liste des contacts après un délai
    setTimeout(() => {
      router.push('/contacts/list')
    }, 1000)
    
  } catch (error) {
    console.error('Erreur lors de la création du contact:', error)
    // TODO: Afficher un toast d'erreur
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  router.push('/contacts')
}

function onCompanySelected() {
  showCompanyError.value = false
}
</script>

<style scoped>
.toast {
  z-index: 1000;
}
</style>