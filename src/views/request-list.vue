<template>
  <div v-if="loaded && !error" align="center">
    <div class="box main" style="max-width: 17em">
      <h1 class="title">List of requests</h1>
    </div>
    <div class="box main" style="overflow: overlay;">
      <table class="table" style="min-width: 100%;">
        <thead>
          <tr>
            <th>Public nickname</th>
            <th>Build requested</th>
            <th>Chosen for next video?</th>
            <th>Additional text</th>
          </tr>
        </thead>
        <tbody v-for="req in list" :key="req._id">
          <tr>
            <th>{{ req.nickname }}</th>
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
          </tr>
        </tbody>
      </table>
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
      error: "",
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
      this.axios
        .get("http://152.70.198.159:3075/requests", options)
        .then((e) => {
          this.list = e.data;
          this.loaded = true;
        })
        .catch((e) => {
          this.error = this.response?.data?.message || e.toString();
          this.loaded = true;
        });
    },
  },
};
</script>