<template>
  <div class="container">
    <div>
      Home
      <div style="display: flex;">
      <v-input label="Search"></v-input>
      <v-button style="margin-left: 10px;">Search</v-button>

      </div>
    </div>
    <v-overlay v-model="overlay"></v-overlay>
    <v-snackbar v-model="message"></v-snackbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      overlay: false,
      message: '',
    }
  },

  mounted() {},
}
</script>

<style scoped>
.container {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>