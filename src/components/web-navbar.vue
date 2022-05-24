<template>
  <nav
    class="navbar is-info is-fixed-bottom has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item"
        ><img src="../assets/logo.png" alt="Billy's icon" width="32"
      /></router-link>
      <a
        role="button"
        class="navbar-burger"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <router-link to="/requests" class="navbar-item icon-text">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'list']" />
          </span>
          <span>Requests</span>
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
          @click="show"
          class="navbar-item has-dropdown has-dropdown-up"
          :class="{ 'is-active': about_clicked }"
        >
          <div class="navbar-link">© {{ year }} Billy O'Reilly</div>
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
      about_clicked: false,
    };
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
  methods: {
    show() {
      this.about_clicked = !this.about_clicked;
    }
  },
  mounted() {
    this.$nextTick(function () {
      const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
      );
      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach((el) => {
          el.addEventListener("click", () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
          });
        });
      }
    });
  },
};
</script>