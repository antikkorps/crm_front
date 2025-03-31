<template>
  <div class="auth-layout">
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-bold">Mon CRM</h1>
        </div>

        <!-- Slot pour le contenu d'authentification -->
        <slot />
      </div>
    </div>
  </div>
</template>
