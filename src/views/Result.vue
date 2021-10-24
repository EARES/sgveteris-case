<template>
  <div class="container d-flex align-items-center justify-content-center h-100">
    <div class="row">
      <p class="title">İşleminizin detayları;</p>
    </div>
    <div class="row">
      <p class="subtitle">
        {{ result }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Result",
  data() {
    return {
      result: null,
    };
  },
  methods: {
    ...mapGetters(["getOffer"]),
  },
  created() {
    this.result = this.getOffer();
  },
};
</script>
<style lang="css" scoped>
.container {
  flex-direction: column;
}
</style>