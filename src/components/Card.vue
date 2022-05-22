<template>
  <van-col :offset="isSingle ? 6 : 0" span="12" :class="{ 'list': inList }">
      <div class="card" :class="{
        animation: ani,
        animation1: ani == 1,
        animation2: ani == 2,
        star6: star == 6,
        star5: star == 5,
        star4: star == 4,
        star3: star == 3
      }" :style="{ animationDelay: !ani ? 0 : `${750 * index}ms` }">
        <van-badge :content="isNew ? 'New' : (count > 1 ? `${count - 1} 花` : undefined)"
          class="card-inner" color="rgba(187, 134, 68, .7)" :style="{ animationDelay: !ani ? 0 : `${750 * index}ms` }">
            {{name}}
            <div class="star">{{stars.slice(0, star)}}</div>
        </van-badge>
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
    index: Number,
  },
  data () {
    return {
      stars: '★★★★★★',
    }
  }
}
</script>

<style scoped>
.list {
  padding: 4px;
}

.card {
  padding: 8px;
  border-radius: 8px;
  color: var(--van-gray-8);
  text-align: center;
  text-shadow: 0 1px 2px var(--van-gray-2);
  background-size: 200% 100%;
  background-position: 100% 0%;
}

.card-inner {
  width: 100%;
}

.star {
  color: #f4ebc4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, .3);
}

.card.animation,
.card.animation .card-inner {
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}

.card.animation1 {
  animation-name: open;
}

.card.animation1 .card-inner {
  animation-name: open-inner;
}

.card.animation2 {
  animation-name: open2;
}

.card.animation2 .card-inner {
  animation-name: open2-inner;
}

.star6 {
  background-image: linear-gradient(to right,
    #222220 0%, #222220 2%,
    #cba96c 2%, #514536 4%,
    #252420 4%, #252420 46%,
    #514536 46%, #cba96c 48%,
    #222220 48%, #222220 50%,
    #f3ecc8 50%, #eadca6 100%
  );
}

.star5 {
  background-image: linear-gradient(to right,
    #000 0%, #000 2%,
    #20304c 2%, #20304c 10%,
    #a8abb0 10%, #a8abb0 40%,
    #20304c 40%, #20304c 48%,
    #000 48%, #000 50%,
    #ebdaee 50%, #d6cee9 100%
  );
}

.star4 {
  background-image: linear-gradient(to right,
   #dccfc3 0%, #dccfc3 2%,
   #fcf6e4 2%, #fcf6e4 10%,
   #e0c3a9 10%, #e0c3a9 11%,
   #fcf6e4 11%, #fcf6e4 12%,
   #e0c3a9 12%, #e0c3a9 13%,
   #fcf6e4 13%, #fcf6e4 48%,
   #dccfc3 48%, #dccfc3 50%,
   #b7b2ce 50%, #b7b2ce 100%
  );
}

.star3 {
  background-image: linear-gradient(to right,
    #a99380 0%, #a99380 2%,
    #c6b09c 2%, #c6b09c 48%,
    #a99380 48%, #a99380 50%,
    #b5c6d8 50%, #b5c6d8 100%
  );
}

@keyframes open {
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

@keyframes open-inner {
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
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

@keyframes open2-inner {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
