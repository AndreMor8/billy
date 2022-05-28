<template>
  <div align="center">
    <div class="box main" style="max-width: 50em">
      <h1 class="title">Route not found...</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeout: null,
    };
  },
  created() {
    const router = this.$router;
    this.timeout = setTimeout(() => router.replace("/"), 5000);
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeout);
    next();
  },
};
</script>