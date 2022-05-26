<template>
  <nav
    class="navbar is-info is-fixed-bottom has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link
        to="/"
        class="navbar-item"
        :class="{ 'is-active': $route.name === 'home' }"
        ><img src="../assets/logo.png" alt="Billy's icon" width="32"
      /></router-link>
      <a
        @click="this.mobile_clicked = !this.mobile_clicked"
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': mobile_clicked }"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': mobile_clicked }">
      <div class="navbar-start">
        <router-link
          to="/requests"
          class="navbar-item icon-text"
          :class="{ 'is-active': $route.name === 'request-list' }"
        >
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'list']" />
          </span>
          <span>Requests</span>
        </router-link>
        <router-link
          to="/privacy-policy"
          class="navbar-item icon-text"
          :class="{ 'is-active': $route.name === 'privacy-policy' }"
        >
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'user-shield']" />
          </span>
          <span>Privacy policy</span>
        </router-link>
      </div>
      <div class="navbar-end">
        <a
          href="https://www.youtube.com/user/Sonicrush007"
          target="_blank"
          class="navbar-item icon-text"
        >
          <span class="icon">
            <font-awesome-icon :icon="['fab', 'youtube']" />
          </span>
          <span>YouTube</span>
        </a>
        <a
          href="https://twitter.com/Sonicrush007"
          target="_blank"
          class="navbar-item icon-text"
        >
          <span class="icon">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </span>
          <span>Twitter</span>
        </a>
        <a
          href="https://discord.gg/W2PYJA5rMd"
          target="_blank"
          class="navbar-item icon-text"
        >
          <span class="icon">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </span>
          <span>Discord server</span>
        </a>
        <a href="mailto:sonicrush007@outlook.com" class="navbar-item icon-text">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'envelope']" />
          </span>
          <span>Contact</span>
        </a>
        <div
          @click="this.about_clicked = !this.about_clicked"
          class="navbar-item has-dropdown has-dropdown-up"
          :class="{ 'is-active': about_clicked }"
        >
          <div class="navbar-link">
            © {{ new Date().getFullYear() }} Billy O'Reilly
          </div>
          <div class="navbar-dropdown" style="left: -196%">
            <div class="navbar-item content">
              Created by AndreMor (<a
                href="https://andremor.dev"
                target="_blank"
                >andremor.dev</a
              >) for Billy O'Reilly (<a
                href="https://www.youtube.com/user/Sonicrush007"
                target="_blank"
                >youtube.com/user/Sonicrush007</a
              >)
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      mobile_clicked: false,
      about_clicked: false,
    };
  },
};
</script>