<template>
  <p>this is user page : {{ now }}</p>
</template>

<script>
  export default {
    name: "User",
    data() {
      return {}
    },
    computed: {
      now() {
        return Date.now();
      }
    }
  }
</script>

<style scoped>

</style>
