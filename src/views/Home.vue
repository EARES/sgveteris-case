<template>
  <div class="container d-flex align-items-center justify-content-center h-100">
    <div class="row">
      <div class="col-7">
        <label class="form-label">Amount the Spend</label>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <input
              v-model="currencyval"
              @keyup="changeVal('currency')"
              type="decimal"
              class="form-control"
              placeholder="0,00"
            />
          </div>
          <select class="form-select" name="currency" v-model="currency">
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
      <div class="col-5">
        <label class="form-label">Coins to Receive</label>
        <div class="input-group mb-3">
          <input
            type="decimal"
            class="form-control"
            placeholder="0,00"
            v-model="coin"
            @keyup="changeVal('coin')"
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
      <button class="btn btn-primary mt-2" @click="buy()">Satın Al</button>
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
          this.currency = response.data.USD.symbol;
        })
        .catch(() => {
          this.$buefy.toast.open({
            duration: 3000,
            message: "Bir hata oluştu",
            position: "is-bottom",
            type: "is-danger",
          });
        });
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
    changeVal(type) {
      if (type === "coin") {
        if (this.coin == "") {
          this.snackbar("Lütfen bir miktar giriniz");
          this.currencyval = null;
        } else if (this.coin == "0") {
          this.snackbar("Lütfen doğru bir miktar giriniz");
          this.currencyval = null;
        } else if (this.coin < 30) {
          this.snackbar("Lütfen doğru bir miktar giriniz");
          this.currencyval = null;
        }
      } else {
        if (this.currencyval == "") {
          this.snackbar("Lütfen bir miktar giriniz");
          this.coin = null;
          this.resetTimer();
        } else if (this.currencyval == "0") {
          this.snackbar("Lütfen doğru bir miktar giriniz");
          this.coin = null;
          this.resetTimer();
        } else if (this.currencyval < 30 && this.currency == "USD") {
          this.snackbar("Lütfen minimum 30 USD giriniz");
          this.coin = null;
          this.resetTimer();
        } else if (this.currencyval < 25 && this.currency == "EUR") {
          this.snackbar("Lütfen minimum 25 EUR giriniz");
          this.coin = null;
          this.resetTimer();
        } else if (this.currencyval < 20 && this.currency == "GBP") {
          this.snackbar("Lütfen minimum 20 GBP giriniz");
          this.coin = null;
          this.resetTimer();
        } else if (
          this.currencyval > 50000 &&
          (this.currency == "GBP" ||
            this.currency == "EUR" ||
            this.currency == "USD")
        ) {
          this.snackbar(`Lütfen maximum 50000 ${this.currency} giriniz`);
          this.coin = null;
          this.resetTimer();
        } else {
          this.calculate();
        }
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
          document.getElementById("countdown").innerHTML =
            "Fiyat Yeniden Hesaplandı";
          _that.calculate();
        } else {
          document.getElementById("countdown").innerHTML =
          "Fiyatın yeniden hesaplanmasına "  + timeleft + " saniye kaldı";
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
          this.resetTimer();
          this.timer();
        })
        .catch(() => {
          this.$buefy.toast.open({
            duration: 3000,
            message: "Bir hata oluştu",
            position: "is-bottom",
            type: "is-danger",
          });
        });
    },
    snackbar(msg) {
      this.msg = msg;
      this.showalert = true;
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