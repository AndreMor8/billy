<template>
  <nav
    class="navbar is-light is-fixed-bottom"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <div class="navbar-item">
        <img src="../assets/logo.png" />
      </div>
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
      <div class="navbar-start"></div>
      <div class="navbar-end">
        <div
          @click="show"
          class="navbar-item has-dropdown has-dropdown-up"
          :class="{ 'is-active': about_clicked }"
        >
          <div class="navbar-link">© {{ year }} Billy O'Reilly</div>
          <div class="navbar-dropdown" style="left: -196%">
            <div class="navbar-item">
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
  data: function () {
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
    },
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