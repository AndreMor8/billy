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
      text: "Waiting server response...",
    };
  },
  created() {
    if (this.$route.query.token) this.goBlacklist();
    else this.text = "Without token...";
  },
  methods: {
    goBlacklist() {
      this.axios
        .post(`${window.apiDomain}/blacklist`, {
          token: this.$route.query.token,
        })
        .then((e) => {
          this.text = e.data.message;
        })
        .catch((e) => {
          this.text = e.response?.data?.message || e.toString();
        });
    },
  },
};
</script>