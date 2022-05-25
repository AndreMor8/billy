<template>
  <div align="center">
    <div class="box main" style="max-width: 50em;">
      <h1 class="title">{{ text }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "Waiting server response...",
    };
  },
  created() {
    if (this.$route.query.token) this.goVerify();
    else this.text = "Without token...";
  },
  methods: {
    goVerify() {
      this.axios
        .post(`${window.apiDomain}/verify`, {
          token: this.$route.query.token,
        })
        .then((e) => {
          this.text = e.data.message;
          localStorage.setItem("access-token", e.data.token);
        })
        .catch((e) => {
          this.text = e.response?.data?.message || e.toString();
        });
    },
  },
};
</script>