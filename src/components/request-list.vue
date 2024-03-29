<template>
    <div v-if="loaded && !error">
        <div class="box main" style="max-width: 18em">
            <h1 class="title">List of requests</h1>
        </div>
        <div v-if="admin" class="box main" style="max-width: 54em; overflow: hidden">
            <div class="buttons" style="justify-content: center">
                <button @click="modal.sending ? undefined : openModal()" class="button is-success"
                    :disabled="modal.sending || null">
                    <span class="icon">
                        <i class="fa-solid fa-shuffle"></i>
                    </span>
                    <span>Choose a build</span>
                </button>
                <button @click="buttonBlActive ? addMailtoBlacklist() : undefined" class="button is-info"
                    :disabled="!buttonBlActive || null">
                    <span class="icon">
                        <i class="fa-solid fa-user-slash"></i>
                    </span>
                    <span>Add an email to blacklist</span>
                </button>
                <button @click="buttonBlActive ? removeMailFromBlacklist() : undefined" class="button is-warning"
                    :disabled="!buttonBlActive || null">
                    <span class="icon">
                        <i class="fa-solid fa-envelope-open"></i>
                    </span>
                    <span>Remove an email from blacklist</span>
                </button>
                <button @click="
                  buttonResetActive
                    ? modal.sending
                      ? undefined
                      : resetAdmin()
                    : undefined
                " class="button is-danger" :disabled="!buttonResetActive || modal.sending || null">
                    <span class="icon">
                        <i class="fa-solid fa-arrow-rotate-right"></i>
                    </span>
                    <span>Reset list</span>
                </button>
            </div>
        </div>
        <div v-if="admin" class="modal" :class="{ 'is-active': modal.active }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Choosing build request</p>
                    <button @click="modal.sending ? undefined : closeModal()" class="delete" aria-label="close"
                        :disabled="modal.sending || null"></button>
                </header>
                <section v-if="modal.selected" class="modal-card-body">
                    <p>The system has chosen...</p>
                    <br />
                    <p>
                        <strong>{{ modal.selected.build }}</strong> by
                        <small>{{ modal.selected.nickname }}</small>
                    </p>
                </section>
                <footer class="modal-card-foot" style="justify-content: center">
                    <button @click="
                      modal.sending ? undefined : chooseRequest(modal.selected._id)
                    " class="button is-success" :disabled="modal.sending || null">
                        <span class="icon">
                            <i class="fa-solid fa-circle-check"></i>
                        </span>
                        <span>Mark as chosen</span>
                    </button>
                    <button @click="modal.sending ? undefined : shuffleRequests()" class="button is-link"
                        :disabled="modal.sending || null">
                        <span class="icon">
                            <i class="fa-solid fa-shuffle"></i>
                        </span>
                        <span>Re-shuffle</span>
                    </button>
                    <button @click="
                      modal.sending
                        ? undefined
                        : deleteRequestByModal(modal.selected._id)
                    " class="button is-danger" :disabled="modal.sending || null">
                        <span class="icon">
                            <i class="fa-solid fa-trash-can"></i>
                        </span>
                        <span>Delete and re-shuffle</span>
                    </button>
                </footer>
            </div>
        </div>
        <div class="modal" :class="{ 'is-active': additional_modal.active }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Additional info</p>
                    <button class="delete" aria-label="close" @click="additional_modal.active = false"></button>
                </header>
                <section class="modal-card-body content" style="text-align: justify; white-space: pre-wrap;">
                    {{ getAdditionalInfo }}
                </section>
            </div>
        </div>
        <div class="box main" style="overflow: overlay">
            <table v-if="list.length" class="table" style="min-width: 100%">
                <thead>
                    <tr>
                        <th v-if="admin">E-mail</th>
                        <th>Public nickname</th>
                        <th>Build requested</th>
                        <th>Chosen for next video?</th>
                        <th>Additional info</th>
                        <th v-if="admin">Action</th>
                    </tr>
                </thead>
                <tbody v-for="req in list" :key="req._id" :style="req.chosen ? 'background-color: lightgreen' : ''">
                    <tr>
                        <td v-if="admin">{{ req.email }}</td>
                        <td>
                            <b>{{ req.nickname }}</b>&nbsp;<small v-if="req.fromUser">(yours)</small><small
                                v-if="admin">{{ getAnonymity(req) }}</small>
                        </td>
                        <td>{{ req.build }}</td>
                        <td>
                            <span v-if="req.chosen" class="icon">
                                <i title="Request chosen" class="fa-solid fa-circle-check"></i>
                            </span><a href="#" v-else-if="admin && !modal.sending"
                                @click="modal.sending ? undefined : chooseRequest(req._id)"><span>
                                    <i title="Mark as chosen" class="fa-solid fa-arrow-turn-up"></i>
                                </span></a>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <a href="#" @click="setAdditionalInfo(req._id)" v-if="req.additional"><span class="icon">
                                    <i title="Show additional info" class="fa-solid fa-align-left"></i>
                                </span></a><span v-else>-</span>
                        </td>
                        <td v-if="admin">
                            <a href="#" @click="deleteRequest(req._id, req.chosen)"
                                v-if="!deleting && !modal.sending"><span class="icon">
                                    <i title="Mark as completed" v-if="req.chosen"
                                        class="fa-solid fa-flag-checkered"></i>
                                    <i title="Delete" v-else class="fa-solid fa-trash-can"></i>
                                </span></a>
                            <span v-else>...</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2 class="subtitle" v-else>Without requests...</h2>
        </div>
    </div>

    <div class="box main" v-else-if="loaded && error" style="max-width: 50em">
        <h1 class="title">{{ error }}</h1>
    </div>

    <div v-else-if="!loaded" class="box main" style="max-width: 30em">
        <h1 class="title">Loading...</h1>
    </div>
</template>
  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            loaded: false,
            list: [],
            admin: false,
            error: "",
            deleting: false,
            modal: {
                active: false,
                selected: null,
                sending: false,
            },
            additional_modal: {
                active: false,
                selected: null,
            },
            buttonBlActive: true,
            buttonResetActive: true,
        };
    },
    created() {
        this.getRequests();
    },
    computed: {
        getAdditionalInfo() {
            return (
                this.list.find((a) => a._id === this.additional_modal.selected)
                    ?.additional || ""
            );
        },
    },
    methods: {
        getRequests() {
            const options = {};
            if (localStorage.getItem("access-token"))
                options.headers = {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                };
            return axios
                .get(`${globalThis.apiDomain}/requests`, options)
                .then((e) => {
                    this.list = e.data.list;
                    this.admin = e.data.admin;
                    this.loaded = true;
                })
                .catch((e) => {
                    this.error = this.response?.data?.message || e.toString();
                    this.loaded = true;
                });
        },
        addMailtoBlacklist() {
            const email = prompt("Email to add on blacklist", "");
            if (email) {
                this.buttonBlActive = false;
                return axios
                    .put(
                        `${globalThis.apiDomain}/blacklist`,
                        { email },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                            },
                        }
                    )
                    .then((e) => alert(e.data.message))
                    .catch((e) => alert(e.response?.data?.message || e.toString()))
                    .finally(() => (this.buttonBlActive = true));
            }
        },
        removeMailFromBlacklist() {
            const email = prompt("Email to remove from blacklist", "");
            if (email) {
                this.buttonBlActive = false;
                return axios
                    .delete(`${globalThis.apiDomain}/blacklist`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                        },
                        data: { email },
                    })
                    .then((e) => alert(e.data.message))
                    .catch((e) => alert(e.response?.data?.message || e.toString()))
                    .finally(() => (this.buttonBlActive = true));
            }
        },
        openModal() {
            const list = this.list.filter((e) => !e.chosen);
            if (!list.length) return alert("There's not non-chosen build requests");
            this.shuffleRequests();
            this.modal.active = true;
        },
        shuffleRequests() {
            this.modal.selected = this.list.filter((e) => !e.chosen)[
                Math.floor(Math.random() * this.list.filter((e) => !e.chosen).length)
            ];
        },
        closeModal() {
            this.modal.active = false;
            this.modal.selected = null;
        },
        getAnonymity(doc) {
            if (doc.anonymity === 0) return "";
            if (doc.anonymity === 1 && doc.chosen) return "";
            return `(private: ${doc.anonymity})`;
        },
        chooseRequest(id) {
            const pr = confirm("Are you sure? Make sure you wrote it down");
            if (pr) {
                this.modal.sending = true;
                return axios
                    .put(
                        `${globalThis.apiDomain}/requests/${id}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                            },
                        }
                    )
                    .then((e) => {
                        alert(e.data.message);
                        this.modal.active = false;
                        this.loaded = false;
                        this.modal.sending = false;
                        return this.getRequests();
                    })
                    .catch((e) => {
                        alert(e.response?.data?.message || e.toString());
                        this.modal.sending = false;
                    });
            }
        },
        async deleteRequestByModal(id) {
            this.modal.sending = true;
            await this.deleteRequest(id);
            if (this.list.filter((e) => !e.chosen).length) this.shuffleRequests();
            else {
                this.modal.active = false;
                this.modal.selected = null;
            }
            this.modal.sending = false;
        },
        deleteRequest(id, chosen) {
            const reason = prompt(
                (chosen ? "Video info" : "Reason for removal") + " (required)",
                ""
            );
            if (!reason) return;
            this.deleting = true;
            this.modal.sending = true;
            return axios
                .delete(`${globalThis.apiDomain}/requests/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                    },
                    data: { reason },
                })
                .then(async (e) => {
                    alert(e.data.message);
                    this.loaded = false;
                    this.deleting = false;
                    this.modal.sending = false;
                    return await this.getRequests();
                })
                .catch((e) => {
                    alert(e.response?.data?.message || e.toString());
                    this.deleting = false;
                    this.modal.sending = false;
                });
        },
        resetAdmin() {
            const pr = confirm(
                "This will clean up the build requests list. Are you sure?"
            );
            if (pr) {
                this.buttonResetActive = false;
                this.modal.sending = true;
                axios
                    .put(
                        `${globalThis.apiDomain}/reset-admin`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                            },
                        }
                    )
                    .then((e) => {
                        alert(e.data.message);
                        this.buttonResetActive = true;
                        this.loaded = false;
                        this.modal.sending = false;
                        this.getRequests();
                    })
                    .catch((e) => {
                        alert(e.response?.data?.message || e.toString());
                        this.buttonResetActive = true;
                        this.modal.sending = false;
                    });
            }
        },
        setAdditionalInfo(id) {
            this.additional_modal.selected = id;
            this.additional_modal.active = true;
        },
    },
};
</script>