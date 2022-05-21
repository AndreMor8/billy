<template>
  <web-navbar />
  <router-view id="general-view" />
</template>

<style>
html {
  background: none !important;
}

body {
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
#general-view {
  padding: 1em;
}
</style>

<script>
import webNavbar from "./components/web-navbar.vue";
export default {
  components: { webNavbar },
};
</script>