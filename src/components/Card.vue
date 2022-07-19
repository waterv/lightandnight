<template>
  <van-col :offset="isSingle ? 6 : 0" span="12" :class="{ 'in-list': inList }">
    <div
      class="card"
      :class="{
        animating: ani,
        'animation-type1': ani == 1,
        'animation-type2': ani == 2,
        shining: ani && shining,
        star6: star == 6,
        star5: star == 5,
        star4: star == 4,
        star3: star == 3,
      }"
    >
      <div class="card-highlight">
        <div
          class="card-background"
          :style="{ animationDelay: animationDelay }"
        >
          <van-badge
            :content="
              isNew
                ? 'New'
                : count > 1
                ? $t('gacha.cardNumber', [count - 1])
                : undefined
            "
            :offset="[-6, 0]"
            class="card-inner"
            color="rgba(187, 134, 68, .7)"
            :style="{ animationDelay: animationDelay }"
          >
            {{ name }}
            <div class="star">{{ stars.slice(0, star) }}</div>
          </van-badge>
        </div>
      </div>
    </div>
  </van-col>
</template>

<script>
import { Badge } from 'vant'

export default {
  name: 'Card',
  components: {
    [Badge.name]: Badge,
  },
  props: {
    isSingle: Boolean,
    name: String,
    star: Number,
    isNew: Boolean,
    count: Number,
    inList: Boolean,
    ani: Number,
    shining: Boolean,
    index: Number,
  },
  data() {
    return {
      stars: this.$t('gacha.stars'),
    }
  },
  computed: {
    animationDelay() {
      switch (this.ani) {
        default:
          return 0
        case 1:
          return `${750 * this.index}ms`
        case 2:
          return `${500 * this.index}ms`
      }
    },
  },
}
</script>

<style>
.card .van-badge {
  text-shadow: none;
}
</style>

<style scoped>
.in-list {
  padding: 4px;
}

.van-theme-dark .card {
  filter: brightness(0.8);
}

.card .card-background {
  padding: 8px 4px;
  box-sizing: border-box;
  border-radius: 8px;
  color: var(--van-gray-8);
  font-size: 0.8em;
  text-align: center;
  text-shadow: 0 1px 2px var(--van-gray-2);
  background-size: 200% 100%;
  background-position: 100% 0%;
}

.card,
.card .card-highlight,
.card .card-background,
.card .card-inner {
  width: 100%;
}

.card.animating .card-highlight,
.card.animating .card-background,
.card.animating .card-inner {
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}

.card.animation-type1 .card-background {
  animation-name: open1;
  animation-duration: 2s;
}

.card.animation-type1 .card-inner {
  animation-name: open1-inner;
  animation-duration: 2s;
}

.card.animation-type2 .card-background {
  animation-name: open2;
  animation-duration: 10s;
}

.card.animation-type2 .card-inner {
  animation-name: open2-inner;
  animation-duration: 10s;
}

.card.star6 .card-background {
  background-image: linear-gradient(
    to right,
    #222220 0%,
    #222220 2%,
    #cba96c 2%,
    #514536 4%,
    #252420 4%,
    #252420 46%,
    #514536 46%,
    #cba96c 48%,
    #222220 48%,
    #222220 50%,
    #f3ecc8 50%,
    #eadca6 100%
  );
}

.card.shining.star6 .card-background {
  box-shadow: 0 0 10px darkgoldenrod;
}

.card.star5 .card-background {
  background-image: linear-gradient(
    to right,
    #000 0%,
    #000 2%,
    #20304c 2%,
    #20304c 10%,
    #a8abb0 10%,
    #a8abb0 40%,
    #20304c 40%,
    #20304c 48%,
    #000 48%,
    #000 50%,
    #ebdaee 50%,
    #d6cee9 100%
  );
}

.card.shining.star5 .card-background {
  box-shadow: 0 0 10px mediumslateblue;
}

.card.animating.shining.star5 .card-highlight,
.card.animating.shining.star6 .card-highlight {
  animation-name: shine;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

.card.star4 .card-background {
  background-image: linear-gradient(
    to right,
    #dccfc3 0%,
    #dccfc3 2%,
    #fcf6e4 2%,
    #fcf6e4 10%,
    #e0c3a9 10%,
    #e0c3a9 11%,
    #fcf6e4 11%,
    #fcf6e4 12%,
    #e0c3a9 12%,
    #e0c3a9 13%,
    #fcf6e4 13%,
    #fcf6e4 48%,
    #dccfc3 48%,
    #dccfc3 50%,
    #b7b2ce 50%,
    #b7b2ce 100%
  );
}

.card.star3 .card-background {
  background-image: linear-gradient(
    to right,
    #a99380 0%,
    #a99380 2%,
    #c6b09c 2%,
    #c6b09c 48%,
    #a99380 48%,
    #a99380 50%,
    #b5c6d8 50%,
    #b5c6d8 100%
  );
}

.star {
  color: #f4ebc4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes open1 {
  0% {
    opacity: 0;
    background-position: 0% 0%;
  }
  25% {
    opacity: 1;
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

@keyframes open1-inner {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes open2 {
  0% {
    opacity: 0;
    background-position: 0% 0%;
  }
  5% {
    opacity: 1;
    background-position: 0% 0%;
  }
  60% {
    opacity: 1;
    background-position: 0% 0%;
  }
  80% {
    background-position: 100% 0%;
  }
}

@keyframes open2-inner {
  0% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
}

@keyframes shine {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.15);
  }
  100% {
    filter: brightness(1);
  }
}
</style>
