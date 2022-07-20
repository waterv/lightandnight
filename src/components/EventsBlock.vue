<template>
  <van-cell-group v-if="available" :title="events.name" inset>
    <template v-for="event in eventsResult" :key="event">
      <van-cell
        v-if="event.state"
        :title="event.name"
        :label="event.desc"
        center
      >
        <template #right-icon>
          <count-down
            :time="event.time"
            :state="event.state"
            :class="{
              periodic: event.periodic,
              coming: event.state == $t('common.eventStart'),
              started: event.state == $t('common.eventEnd'),
              urgent:
                event.state == $t('common.eventEnd') && event.time <= 86400000,
            }"
          />
        </template>
      </van-cell>
    </template>
  </van-cell-group>
</template>

<script>
import CountDown from '@/components/CountDown.vue'
let dayjs = require('dayjs')

export default {
  name: 'EventsBlock',
  props: {
    events: Object,
  },
  components: {
    CountDown,
  },
  data() {
    let eventsResult = this.events?.events?.map(event => {
      let now = dayjs(),
        start = dayjs.tz(event.start),
        end = dayjs.tz(event.end),
        target,
        state
      if (event.periodic) {
        state = event.state
        target = dayjs()
          .tz()
          .day(event.day)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
        if (event.state == 'start') {
          state = this.$t('common.eventStart')
          target = target.hour(5)
        } else state = this.$t('common.eventEnd')
        if (event.day <= now.day()) target = target.add(1, 'week')
      } else {
        // eslint-disable-next-line
        ;({ state, target } = now.isBefore(start)
          ? { state: this.$t('common.eventStart'), target: start }
          : now.isBefore(end)
          ? { state: this.$t('common.eventEnd'), target: end }
          : { state: undefined, target: undefined })
      }
      return { ...event, state, time: target?.diff(now) }
    })
    let available = false
    eventsResult?.forEach(event => {
      available |= event.state !== undefined
    })
    return {
      available,
      eventsResult,
    }
  },
}
</script>
