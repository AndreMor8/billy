<template>
  <router-view id="general-view" />
  <web-navbar />
</template>

<style>
html {
  background: none !important;
}

body {
  background-image: url("./assets/background.webp");
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
#general-view {
  padding: 1em;
}
.main {
  background-color: whitesmoke;
}
</style>

<script>
import webNavbar from "./components/web-navbar.vue";
export default {
  components: { webNavbar },
};
</script>