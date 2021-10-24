<template>
  <div class="container d-flex align-items-center justify-content-center h-100">
    <div class="row">
      <h2>Details of Your Transaction</h2>
    </div>
    <br>
    <div class="row">
      <p>
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