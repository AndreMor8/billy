<template>
    <h1 class="title">{{ text }}</h1>
</template>
  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            text: "Waiting server response..."
        };
    },
    created() {
        if (new URL(location).searchParams.get("token")) this.goVerify();
        else this.text = "Without token...";
    },
    methods: {
        goVerify() {
            axios
                .post(`${globalThis.apiDomain}/verify`, {
                    token: new URL(location).searchParams.get("token"),
                })
                .then((e) => {
                    localStorage.setItem("access-token", e.data.token);
                    this.text = e.data.message;
                    setTimeout(() => location.href = "/requests", 3000);
                })
                .catch((e) => {
                    this.text = e.response?.data?.message || e.toString();
                });
        },
    },
};
</script>