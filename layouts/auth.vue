<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header with theme toggle in the top right -->
    <header class="p-4 flex justify-end">
      <ThemeToggle />
    </header>

    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="p-4 text-center text-sm text-gray-500">
      <p>© {{ new Date().getFullYear() }} CRM Client Portal</p>
    </footer>
  </div>
</template>

<script setup>
// No additional script needed
</script>
