<template>
  <div v-if="loaded" align="center">
    <div class="box main" style="max-width: 23em">
      <h1 class="title">Build requests website</h1>
    </div>
    <div class="box main" style="max-width: 47em">
      <p>
        Here you will be able to choose a build of Windows that you would like
        Billy to test in his next video.
      </p>
      <p>
        The build will be chosen randomly, once chosen, Billy will present said
        build in his next video.
      </p>
    </div>
    <form
      v-if="!no_request_list"
      @submit.prevent="sended ? undefined : sendRequest()"
    >
      <div class="box main" style="max-width: 58em">
        <h3 class="subtitle">Please complete the following information</h3>
        <div class="field">
          <div class="control has-icons-left">
            <input
              class="input is-danger"
              type="email"
              placeholder="Contact e-mail"
              :disabled="with_token || sended"
              v-model="form.email"
            />
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'envelope']" />
            </span>
          </div>
          <p class="help" align="left" v-if="!with_token">
            This email will never be published and will only be used to notify
            you of your request.
          </p>
        </div>
        <div class="field">
          <div class="control has-icons-left">
            <input
              class="input is-warning"
              type="text"
              placeholder="Nickname (can also be a YouTube or Discord username)"
              v-model="form.nickname"
              :disabled="sended"
            />
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'user']" />
            </span>
          </div>
        </div>
        <div class="field" align="left">
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                name="anonymity"
                v-model="form.anonymity"
                :value="0"
                checked
                :disabled="sended"
              />
              -> Make this name public <strong>all time</strong> </label
            ><br />
            <label class="radio">
              <input
                type="radio"
                name="anonymity"
                v-model="form.anonymity"
                :value="1"
                :disabled="sended"
              />
              -> Make this name public
              <strong>only if my request is chosen</strong> </label
            ><br />
            <label class="radio">
              <input
                type="radio"
                name="anonymity"
                v-model="form.anonymity"
                :value="2"
                :disabled="sended"
              />
              -> <strong>Never</strong> make this name public
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control has-icons-left">
            <input
              class="input is-success"
              type="text"
              placeholder="Windows version and build (eg. Windows Whistler build 2462)"
              v-model="form.build"
              :disabled="sended"
            />
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fab', 'windows']" />
            </span>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <textarea
              class="textarea is-info"
              placeholder="Additional info"
              v-model="form.additional"
              :disabled="sended"
            />
          </div>
        </div>
        <br v-if="sended_text !== 'Please wait...' || sended" />
        <span
          v-if="sended_text !== 'Please wait...' || sended"
          class="form-span"
          >{{ sended_text }}</span
        >
        <br v-if="sended_text !== 'Please wait...' || sended" />
        <br v-if="sended_text !== 'Please wait...' || sended" />
        <div class="field is-grouped">
          <div class="control">
            <input
              type="submit"
              class="button is-link"
              value="Submit"
              :disabled="sended || null"
            />
          </div>
          <div class="control">
            <button
              @click.prevent="sended ? undefined : clear()"
              class="button is-link is-light"
              :disabled="sended || null"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </form>
    <div class="box main" style="max-width: 58em" v-else>
      <h2 class="subtitle">
        There is no active request list; maybe Billy isn't getting requests
        right now.
      </h2>
    </div>
  </div>
  <div align="center" v-else>
    <div class="box main" style="max-width: 50em">
      <h1 class="title">Loading form...</h1>
    </div>
  </div>
</template>

<style>
.form-span {
  padding: 3px;
  margin-top: 10px;
  font-size: 20px;
  color: #000;
  background-color: rgb(181, 200, 255);
  max-width: 50em;
}
</style>

<script>
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
      return this.axios
        .get("http://152.70.198.159:3075/check-active-request-list")
        .then((e) => {
          this.no_request_list = !e.data.enabled;
        })
        .catch(() => (this.no_request_list = true));
    },
    getTokenInfo() {
      this.with_token = true;
      return this.axios
        .get("http://152.70.198.159:3075/get-token-info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        })
        .then((e) => {
          this.form.email = e.data.email;
          this.form.nickname = e.data.nickname;
          this.form.anonymity = e.data.anonymity;
          this.form.build = e.data.build;
          this.form.additional = e.data.additional;
        })
        .catch((e) => {
          if (e.response?.data?.clearToken)
            localStorage.removeItem("access-token");
          this.with_token = false;
        });
    },
    sendRequest() {
      const options = {};
      if (this.with_token)
        options.headers = {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        };
      this.sended = true;
      this.sended_text = "Please wait...";
      this.axios
        .post("http://152.70.198.159:3075/do-request", this.form, options)
        .then((e) => {
          this.sended_text = e.data.message;
          if (this.with_token) this.sended = false;
        })
        .catch((e) => {
          console.log(e.response.data);
          this.sended_text = e.response?.data?.message || e.toString();
          this.form.resend = e.response?.data?.resend || false;
          this.sended = false;
        });
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