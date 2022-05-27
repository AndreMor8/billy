<template>
  <div v-if="loaded && !error" align="center">
    <div class="box main" style="max-width: 17em">
      <h1 class="title">List of requests</h1>
    </div>
    <div v-if="admin" class="box main" style="max-width: 38em">
      <div class="buttons">
        <button @click="openModal" class="button is-success">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'shuffle']" />
          </span>
          <span>Choose a build</span>
        </button>
        <button
          @click="buttonBlActive ? removeMailFromBlacklist() : undefined"
          class="button is-warning"
          :disabled="!buttonBlActive || null"
        >
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'envelope-open']" />
          </span>
          <span>Remove an email from blacklist</span>
        </button>
        <button
          @click="buttonResetActive ? resetAdmin() : undefined"
          class="button is-danger"
          :disabled="!buttonResetActive || null"
        >
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" />
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
          <button
            @click="modal.sending ? undefined : closeModal()"
            class="delete"
            aria-label="close"
            :disabled="modal.sending || null"
          ></button>
        </header>
        <section v-if="modal.selected" class="modal-card-body">
          <p>The system has chosen...</p>
          <br />
          <p>
            <strong>{{ modal.selected.build }}</strong> by
            <small>{{ modal.selected.nickname }}</small>
          </p>
        </section>
        <footer class="modal-card-foot">
          <button
            @click="
              modal.sending ? undefined : chooseRequest(modal.selected._id)
            "
            class="button is-success"
            :disabled="modal.sending || null"
          >
            <span class="icon">
              <font-awesome-icon :icon="['fas', 'circle-check']" />
            </span>
            <span>Mark as chosen</span>
          </button>
          <button
            @click="modal.sending ? undefined : shuffleRequests()"
            class="button is-link"
            :disabled="modal.sending || null"
          >
            <span class="icon">
              <font-awesome-icon :icon="['fas', 'shuffle']" />
            </span>
            <span>Re-shuffle</span>
          </button>
          <button
            @click="
              modal.sending
                ? undefined
                : deleteRequestByModal(modal.selected._id)
            "
            class="button is-danger"
            :disabled="modal.sending || null"
          >
            <span class="icon">
              <font-awesome-icon :icon="['fas', 'trash-can']" />
            </span>
            <span>Delete and re-shuffle</span>
          </button>
        </footer>
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
            <th>Additional text</th>
            <th v-if="admin">Delete</th>
          </tr>
        </thead>
        <tbody v-for="req in list" :key="req._id">
          <tr>
            <td v-if="admin">{{ req.email }}</td>
            <th>
              {{ req.nickname }} <small v-if="req.fromUser">(yours)</small>
            </th>
            <td>{{ req.build }}</td>
            <td>
              <span v-if="req.chosen" class="icon"
                ><font-awesome-icon :icon="['fas', 'circle-check']" /></span
              ><span v-else>-</span>
            </td>
            <td>
              <div
                class="modal"
                :class="{ 'is-active': req.additional_modal_active || false }"
              >
                <div class="modal-background"></div>
                <div class="modal-card">
                  <header class="modal-card-head">
                    <p class="modal-card-title">Additional</p>
                    <button
                      @click="req.additional_modal_active = false"
                      class="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section class="modal-card-body content">
                    {{ req.additional }}
                  </section>
                </div>
                <button
                  class="modal-close is-large"
                  aria-label="close"
                  @click="req.additional_modal_active = false"
                ></button>
              </div>
              <a
                @click="req.additional_modal_active = true"
                v-if="req.additional"
                ><span class="icon"
                  ><font-awesome-icon :icon="['fas', 'align-left']" /></span></a
              ><span v-else>-</span>
            </td>
            <td v-if="admin">
              <a @click="deleteRequest(req._id, req.chosen)" v-if="!deleting"
                ><span class="icon"
                  ><font-awesome-icon :icon="['fas', 'trash-can']" /></span
              ></a>
              <span v-else>...</span>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 class="subtitle" v-else>Without requests...</h2>
    </div>
  </div>
  <div v-else-if="loaded && error" align="center">
    <div class="box main" style="max-width: 50em">
      <h1 class="title">{{ error }}</h1>
    </div>
  </div>
  <div v-else-if="!loaded" align="center">
    <div class="box main" style="max-width: 30em">
      <h1 class="title">Loading...</h1>
    </div>
  </div>
</template>

<script>
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
      buttonBlActive: true,
      buttonResetActive: true,
    };
  },
  created() {
    this.getRequests();
  },
  methods: {
    getRequests() {
      const options = {};
      if (localStorage.getItem("access-token"))
        options.headers = {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        };
      return this.axios
        .get(`${window.apiDomain}/requests`, options)
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
    removeMailFromBlacklist() {
      this.buttonBlActive = false;
      const email = prompt("Email to remove from blacklist", "");
      if (email) {
        return this.axios
          .delete(`${window.apiDomain}/blacklist`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
            data: { email },
          })
          .then((e) => alert(e.data.message))
          .catch((e) => alert(e.response?.data?.message || e.toString()))
          .finally(() => (this.buttonBlActive = true));
      } else this.buttonBlActive = true;
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
    chooseRequest(id) {
      const pr = confirm("Are you sure? Make sure you wrote it down");
      if (pr) {
        this.modal.sending = true;
        return this.axios
          .put(
            `${window.apiDomain}/requests/${id}`,
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
      let reason;
      if (chosen) {
        const pr = confirm(
          "Are you sure? Chosen requests doesn't make email notifications."
        );
        if (!pr) return;
      } else {
        reason = prompt("Reason for removal", "");
        if (!reason) return alert("You need a reason...");
      }
      const data = {};
      if (chosen) data.chosen_no_reason = true;
      else data.reason = reason;
      this.deleting = true;
      return this.axios
        .delete(`${window.apiDomain}/requests/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
          data,
        })
        .then(async (e) => {
          alert(e.data.message);
          this.loaded = false;
          this.deleting = false;
          return await this.getRequests();
        })
        .catch((e) => {
          alert(e.response?.data?.message || e.toString());
          this.deleting = false;
        });
    },
    resetAdmin() {
      const pr = confirm(
        "This will clean up the build requests list. Are you sure?"
      );
      if (pr) {
        this.buttonResetActive = false;
        this.axios
          .put(
            `${window.apiDomain}/reset-admin`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            }
          )
          .then((e) => {
            alert(e.data.message);
            this.getRequests();
            this.buttonResetActive = true;
          })
          .catch((e) => {
            alert(e.response?.data?.message || e.toString());
            this.buttonResetActive = true;
          });
      }
    },
  },
};
</script>