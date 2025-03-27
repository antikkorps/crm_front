<template>
  <Card>
    <template #title
      ><div class="flex justify-between items-center">
        <div>{{ title }}</div>
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon :name="icon" class="w-5 h-5 text-blue-600" />
        </div></div
    ></template>

    <template #content>
      <p class="m-0 text-3xl font-bold">
        {{ value }}
      </p>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  icon: {
    type: String,
    default: "carbon:chart-line",
  },
})
</script>
