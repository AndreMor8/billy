<template>
    <div v-if="loaded">
        <form v-if="!no_request_list && !admin" @submit.prevent="sended ? undefined : sendRequest()">
            <div class="box main" style="max-width: 58em">
                <h2 v-if="with_token" class="subtitle">
                    Welcome back. Here you can edit your request
                </h2>
                <h2 v-else class="subtitle">
                    Please complete the following information
                </h2>
                <div class="field">
                    <div class="control has-icons-left">
                        <input class="input is-danger" type="email" placeholder="Contact e-mail"
                            :disabled="with_token || sended" v-model="form.email" required />
                        <span class="icon is-small is-left">
                            <i class="fa-solid fa-envelope"></i>
                        </span>
                    </div>
                    <p class="help" align="left" v-if="!with_token">
                        This email will never be published and will only be used to notify
                        you of your request.
                    </p>
                </div>
                <div class="field">
                    <div class="control has-icons-left">
                        <input class="input is-warning" type="text"
                            placeholder="Nickname (can also be a YouTube or Discord username)" v-model="form.nickname"
                            :disabled="sended" required />
                        <span class="icon is-small is-left">
                            <i class="fa-solid fa-user"></i>
                        </span>
                    </div>
                </div>
                <div class="field" align="left">
                    <div class="control">
                        <label class="radio">
                            <input type="radio" name="anonymity" v-model="form.anonymity" :value="0" checked
                                :disabled="sended" />
                            -> Make this name public <strong>all time</strong> </label><br />
                        <label class="radio">
                            <input type="radio" name="anonymity" v-model="form.anonymity" :value="1"
                                :disabled="sended" />
                            -> Make this name public
                            <strong>only if my request is chosen</strong> </label><br />
                        <label class="radio">
                            <input type="radio" name="anonymity" v-model="form.anonymity" :value="2"
                                :disabled="sended" />
                            -> <strong>Never</strong> make this name public
                        </label>
                    </div>
                </div>
                <div class="field">
                    <div class="control has-icons-left">
                        <input class="input is-success" type="text"
                            placeholder="Windows version and build (eg. Windows Whistler build 2462)"
                            v-model="form.build" :disabled="sended" required />
                        <span class="icon is-small is-left">
                            <i class="fa-brands fa-windows"></i>
                        </span>
                    </div>
                    <p class="help" align="left">Only 1 build per request!</p>
                    <p class="help" align="left">Check <a
                            href="https://www.youtube.com/playlist?list=PLUS6aV5qyWCkH9J5lAMjDfU2jZCrASZco"
                            target="_blank">Billy's playlist</a> to make sure Billy hasn't done the build you ask for
                    </p>
                </div>
                <div class="field">
                    <div class="control">
                        <textarea class="textarea is-info" placeholder="Additional info (optional, will be public)"
                            v-model="form.additional" :disabled="sended" />
                    </div>
                </div>
                <br v-if="sended_text !== 'Please wait...' || sended" />
                <span v-if="sended_text !== 'Please wait...' || sended" class="form-span">{{ sended_text }}</span>
                <br v-if="sended_text !== 'Please wait...' || sended" />
                <br v-if="sended_text !== 'Please wait...' || sended" />
                <div class="field is-grouped buttons">
                    <div class="control">
                        <button type="submit" class="button is-link" :disabled="sended || null">
                            <span class="icon">
                                <i class="fa-solid fa-paper-plane"></i>
                            </span>
                            <span>{{ with_token ? "Modify" : "Submit" }}</span>
                        </button>
                    </div>
                    <div class="control">
                        <button type="button" @click="sended ? undefined : clear()" class="button is-link is-light"
                            :disabled="sended || null">
                            <span class="icon">
                                <i class="fa-solid fa-broom"></i>
                            </span>
                            <span>Clear</span>
                        </button>
                    </div>
                    <div class="control">
                        <button type="button" v-if="with_token" @click="sended ? undefined : deleteRequest()"
                            class="button is-danger" :disabled="sended || null">
                            <span class="icon">
                                <i class="fa-solid fa-trash-can"></i>
                            </span>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div class="box main" style="max-width: 58em" v-else-if="admin">
            <h2 class="subtitle">
                You are logged in as administrator, use the Requests button in the
                navbar to control them.
            </h2>
        </div>
        <div class="box main" style="max-width: 58em" v-else>
            <h2 class="subtitle">
                There is no active request list; maybe Billy isn't getting requests
                right now.
            </h2>
        </div>
    </div>
    <div class="box main" style="max-width: 58em" v-else>
        <h1 class="title">Loading form...</h1>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            form: {
                email: "",
                nickname: "",
                anonymity: 0,
                build: "",
                additional: "",
                resend: false,
            },
            original: {
                nickname: "",
                anonymity: 0,
                build: "",
                additional: "",
            },
            admin: false,
            with_token: false,
            loaded: false,
            no_request_list: false,
            sended: false,
            resend: false,
            sended_text: "Please wait...",
        };
    },
    async created() {
        if (localStorage.getItem("access-token")) await this.getTokenInfo();
        await this.getInfo();
        this.loaded = true;
    },
    methods: {
        getInfo() {
            return axios
                .get(`${globalThis.apiDomain}/check-active-request-list`)
                .then((e) => {
                    this.no_request_list = !e.data.enabled;
                })
                .catch(() => (this.no_request_list = true));
        },
        getTokenInfo() {
            this.with_token = true;
            return axios
                .get(`${globalThis.apiDomain}/get-token-info`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                    },
                })
                .then((e) => {
                    if (e.data.admin) {
                        this.admin = true;
                    } else {
                        this.form.email = e.data.email;
                        this.form.nickname = this.original.nickname = e.data.nickname;
                        this.form.anonymity = this.original.anonymity = e.data.anonymity;
                        this.form.build = this.original.build = e.data.build;
                        this.form.additional = this.original.additional = e.data.additional;
                    }
                })
                .catch((e) => {
                    if (e.response?.data?.clearToken)
                        localStorage.removeItem("access-token");
                    this.with_token = false;
                });
        },
        sendRequest() {
            if (
                this.form.nickname === this.original.nickname &&
                this.form.anonymity === this.original.anonymity &&
                this.form.build === this.original.build &&
                this.form.additional === this.original.additional
            )
                return (this.sended_text = "Without changes, nothing to do.");
            const options = {};
            if (this.with_token)
                options.headers = {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                };
            this.sended = true;
            this.sended_text = "Please wait...";
            axios
                .post(`${globalThis.apiDomain}/do-request`, this.form, options)
                .then((e) => {
                    this.sended_text = e.data.message;
                    this.original.nickname = this.form.nickname;
                    this.original.anonymity = this.form.anonymity;
                    this.original.build = this.form.build;
                    this.original.additional = this.form.additional;
                    if (this.with_token) this.sended = false;
                })
                .catch((e) => {
                    this.sended_text = e.response?.data?.message || e.toString();
                    this.form.resend = e.response?.data?.resend || false;
                    if (e.response?.data?.clearToken) {
                        localStorage.removeItem("access-token");
                        this.with_token = false;
                        this.clear();
                    }
                    this.sended = false;
                });
        },
        deleteRequest() {
            const pr = confirm("Are you sure? Irreversible action.");
            if (pr) {
                this.sended = true;
                this.sended_text = "Please wait...";
                axios
                    .delete(`${globalThis.apiDomain}/do-request`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                        },
                    })
                    .then((e) => {
                        this.sended_text === e.data.message;
                        localStorage.removeItem("access-token");
                        this.with_token = false;
                        this.clear();
                        this.original.nickname = "";
                        this.original.anonymity = 0;
                        this.original.build = "";
                        this.original.additional = "";
                        this.sended = false;
                    })
                    .catch((e) => {
                        this.sended_text === e.response?.data?.message;
                        if (e.response?.data?.clearToken) {
                            localStorage.removeItem("access-token");
                            this.with_token = false;
                            this.clear();
                            this.sended = false;
                        }
                    });
            }
        },
        clear() {
            if (!this.with_token) this.form.email = "";
            this.form.nickname = "";
            this.form.anonymity = 0;
            this.form.build = "";
            this.form.additional = "";
        },
    },
};
</script>