<template>
    <h1 class="title">{{ text }}</h1>
</template>
  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            text: "Please wait...",
            hash: new URL(location).searchParams.get("token") || null,
        };
    },
    created() {
        this.hash = new URL(location).searchParams.get("token") || null;
        if (this.hash) this.goLogin();
        else location.href = `${globalThis.apiDomain}/login-admin`;
    },
    methods: {
        goLogin() {
            return axios
                .post(`${globalThis.apiDomain}/login-admin`, { token: this.hash })
                .then((e) => {
                    localStorage.setItem("access-token", e.data.token);
                    this.text = "Logged as admin!";
                })
                .catch((e) => (this.text = e.response?.data?.message || e.toString()));
        },
    },
};
</script>