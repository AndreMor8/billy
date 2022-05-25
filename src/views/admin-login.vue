<template>
  <div align="center">
    <div class="box main" style="max-width: 50em">
      <h1 class="title">{{ text }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "Please wait...",
      hash: this.$route.query.token || null,
    };
  },
  created() {
    this.hash = this.$route.query.token || null;
    if (this.hash) this.goLogin();
    else location.href = `${window.apiDomain}/login-admin`;
  },
  methods: {
    goLogin() {
      return this.axios
        .post(`${window.apiDomain}/login-admin`, { token: this.hash })
        .then((e) => {
          localStorage.setItem("access-token", e.data.token);
          this.text = "Logged as admin!";
        })
        .catch((e) => (this.text = e.response?.data?.message || e.toString()));
    },
  },
};
</script>