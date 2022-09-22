<template>
    <h1 class="title">{{ text }}</h1>
</template>
  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            text: "Waiting server response...",
        };
    },
    created() {
        if (new URL(location).searchParams.get("token")) this.goBlacklist();
        else this.text = "Without token...";
    },
    methods: {
        goBlacklist() {
            axios
                .post(`${globalThis.apiDomain}/blacklist`, {
                    token: new URL(location).searchParams.get("token"),
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