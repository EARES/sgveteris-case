<template>
  <div class="container d-flex align-items-center justify-content-center h-100">
    <div class="row">
      <div class="col-12">
        <h2>Currency to Coin Calculator</h2>
      </div>
    </div>
    <br />
    <div class="row">
      <div class="col-12 col-md-7">
        <label class="form-label">Amount the Spend</label>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <input
              v-model="currencyval"
              @keyup="changeVal()"
              type="number"
              class="form-control"
              placeholder="0,00"
            />
          </div>
          <select
            class="form-select"
            name="currency"
            v-model="currency"
            @change="onChange()"
          >
            <option
              v-for="item in currencies"
              :value="item.symbol"
              :key="item.symbol"
            >
              {{ item.symbol }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-md-5">
        <label class="form-label">Coins to Receive</label>
        <div class="input-group mb-3">
          <input
            class="form-control"
            placeholder="0,00"
            readonly
            v-model="coin"
          />
          <span class="input-group-text">BTC</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div id="countdown" :class="timerseek ? 'd-block' : 'd-none'"></div>
    </div>
    <div class="row">
      <div
        class="alert alert-secondary"
        role="alert"
        :class="showalert ? 'd-block' : 'd-none'"
      >
        {{ msg }}
      </div>
    </div>
    <div class="row">
      <button class="btn btn-primary mt-2" @click="buy()">Buy</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      currency: null,
      currencies: null,
      coin: null,
      currencyval: null,
      clearTimer: null,
      timerseek: false,
      msg: "",
      showalert: false,
    };
  },
  methods: {
    ...mapActions(["offerSetter"]),
    getCurrencies() {
      axios({
        method: "get",
        url: `https://blockchain.info/ticker`,
      })
        .then((response) => {
          this.currencies = response.data;
          this.currency = response.data["USD"]["symbol"];
          if (document.cookie.includes("currency")) {
            const cookiecurrency = document.cookie.split("; ")[1].split("=")[1];
            this.currency = cookiecurrency;
          } else {
            document.cookie = `currency=${this.currency}; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure`;
          }
        })
    },
    buy() {
      this.resetTimer();
      const result = [];
      result.push({
        currency_type: this.currency,
        coin: this.coin,
        coin_type: "BTC",
        currency: this.currencyval,
      });
      this.offerSetter(result).then(() => {
        this.$router.push({ path: "/result" });
      });
    },
    changeVal() {
      this.showalert = false;
      this.resetTimer();
      if (this.currencyval == "") {
        this.coin = null;
      } else if (this.currencyval == "0") {
        this.snackbar("Please enter a correct amount");
        this.coin = null;
      } else if (this.currencyval < 30 && this.currency == "USD") {
        this.snackbar("Min amount is 30 for USD");
        this.coin = null;
      } else if (this.currencyval < 25 && this.currency == "EUR") {
        this.snackbar("Min amount is 25 for EUR");
        this.coin = null;
      } else if (this.currencyval < 20 && this.currency == "GBP") {
        this.snackbar("Min amount is 20 for GBP");
        this.coin = null;
      } else if (
        this.currencyval > 50000 &&
        (this.currency == "GBP" ||
          this.currency == "EUR" ||
          this.currency == "USD")
      ) {
        this.snackbar(`Max limit is 50000 for ${this.currency}`);
        this.coin = null;
      } else {
        this.calculate();
      }
    },
    resetTimer() {
      clearInterval(this.clearTimer);
      this.timerseek = false;
    },
    timer() {
      this.timerseek = true;
      var timeleft = 10;
      var _that = this;
      this.clearTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(_that.clearTimer);
          document.getElementById("countdown").innerHTML = "Price Recalculated";
          _that.calculate();
        } else {
          document.getElementById("countdown").innerHTML =
            timeleft + " seconds until the price recalculates";
        }
        timeleft -= 1;
      }, 1000);
    },
    calculate() {
      this.showalert = false;
      axios({
        method: "post",
        url: `https://blockchain.info/tobtc?currency=${this.currency}&value=${this.currencyval}`,
      })
        .then((response) => {
          this.coin = response.data;
          this.timer();
        })
    },
    snackbar(msg) {
      this.msg = msg;
      this.showalert = true;
    },
    onChange() {
      this.resetTimer();
      this.calculate();
      document.cookie = `currency=${this.currency}; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure`;
    },
  },
  created() {
    this.getCurrencies();
  },
};
</script>
<style lang="css" scoped>
.container {
  flex-direction: column;
}
</style>