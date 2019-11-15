<template>
  <footer>
    <div class="link-wrapper">
      <a href="http://trueroma.ru/StormLandos" target="_blank">made by Storm</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FootBar",
  data: () => ({
    hovered: false,

  }),

}
</script>

<style scoped>
  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    /*margin-top: 1vw;*/
    width: 100%;
    height: 64px;
    transition: all .4s;
  }
  a {
    color: #000;
    width: 100%;
    height: 100%;
    justify-content: flex-end;
  }
  a, .link-wrapper {
    display: flex;
    align-items: center;
  }
  footer:hover {
    background-color: #424242;
  }
  footer:hover .link-wrapper a {
    color: #fff;
  }
  .link-wrapper {
    height: 100%;
    width: 100%;
    justify-content: center;
    padding: 0 5vw 0 0;
  }

  @media (max-width: 600px) {
    footer {
      height: 56px;
    }
  }
</style>