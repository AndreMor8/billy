<template>
  <router-view id="general-view" />
  <web-navbar />
</template>

<script>
import webNavbar from "./components/web-navbar.vue";
export default {
  components: { webNavbar },
};
</script>