<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import SeptCollapse from './SeptCollapse.vue';
import CalendarJp, { type HolidayRule } from 'septigram-calendar-jp'
interface Day {
  ymd: string,
  holiday?: string,
  dateObject: Date,
  dayOfWeek: number,
  date: number,
  inMonth: boolean,
  class: { [key: string]: boolean },
}

interface Week {
  week: number,
  days: Day[],
}

interface Calendar {
  year: number,
  month: number,
  weeks: Week[],
}

const calendars = ref([] as Calendar[]);
const diffMonth = ref(0);
const dayOfWeekHead = ref(0); // 0:日曜始まり, 1:月曜始まり
const heads = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ];
const calendarJp = new CalendarJp();

onBeforeMount(() =>
{
  try {
    calendarJp.addRule({
      name: '年始',
      title: '年始',
      yearRange: { begin: 2010, end: 9999 },
      month: 1,
      dateRange: { begin: 2, end: 3 }
    } as HolidayRule);
    calendarJp.addRule({
      name: '年末',
      title: '年末',
      yearRange: { begin: 2010, end: 9999 },
      month: 12,
      dateRange: { begin: 29, end: 31 }
    } as HolidayRule);
  } catch (error) {
    console.error(error);
  }
});

onMounted(() => {
  updateCalender();
});

const goThisMonth = () => {
  diffMonth.value = 0
  updateCalender();
};

const addMonth = (diff: number) => {
  diffMonth.value += diff;
  updateCalender();
};

const updateCalender = () => {
  const today = new Date();
  calendars.value.splice(0, calendars.value.length);
  const thisMonth = new Date(today.getFullYear(), today.getMonth() + diffMonth.value, 1);
  addCalendar(thisMonth.getFullYear(), thisMonth.getMonth() + 1);
  const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 1);
  addCalendar(nextMonth.getFullYear(), nextMonth.getMonth() + 1);
};

function getYmd(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + (m < 10 ? '-0' : '-') + m + (d < 10 ? '-0' : '-') + d;
}

const addCalendar = (year: number, month: number) => {
  const today = new Date();
  const calendar = {
    year: year,
    month: month,
    weeks: []
  } as Calendar;
  const date = new Date(calendar.year, calendar.month - 1, 1);
  const firstDayOfWeek = date.getDay() - dayOfWeekHead.value;
  date.setTime(date.getTime() - firstDayOfWeek * 24 * 3600 * 1000);
  for (let w = 0; w < 6; w++) {
    const week = {
      week: w,
      days: []
    } as Week;
    for (let d = 0; d < 7; d++) {
      const ymd = getYmd(date);
      const day = {
        ymd: ymd,
        holiday: calendarJp.getHoliday(ymd),
        dateObject: new Date(date.getTime()),
        dayOfWeek: date.getDay(),
        date: date.getDate(),
        inMonth: calendar.month === date.getMonth() + 1,
        class: {}
      } as Day;
      day.class['TODAY'] = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
      day.class[heads[day.dayOfWeek]] = true
      day.class['HOLIDAY'] = day.holiday !== undefined
      date.setTime(date.getTime() + 24 * 3600 * 1000);
      week.days.push(day);
    }
    calendar.weeks.push(week)
  }
  calendars.value.push(calendar);
};

const n2 = (n: number): string => {
  return n > 10 ? '' : '0' + n
};

</script>

<template>
  <div class="montylyCalendar">
    <sept-collapse title="カレンダー" :isOpen="true" :showHeader="true" :state="true">
      <template #header>
        <el-button @click="goThisMonth()" circle size="small" style="float:right;"><el-icon><House/></el-icon></el-button>
      </template>
      <el-button @click="addMonth(-1)" circle size="small" class="middle"><el-icon><ArrowLeft/></el-icon></el-button>
      <template v-for="(calendar, ci) in calendars" :key="ci">
        <table class="calendar">
          <thead>
            <tr>
              <th colspan="7" class="HEAD">{{calendar.year}}/{{calendar.month}}</th>
            </tr>
            <tr>
              <template v-for="(head, hi) in heads" :key="hi">
                <th :class="heads[(hi + dayOfWeekHead) % 7]">{{heads[(hi + dayOfWeekHead) % 7]}}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-for="(week, wi) in calendar.weeks" :key="wi">
              <tr>
                <template v-for="(day, di) in week.days" :key="di">
                  <template v-if="day.inMonth">
                    <td :class="day.class" :title="day.holiday">
                      {{day.date}}
                    </td>
                  </template>
                  <template v-else>
                    <td class="NONE">&nbsp;</td>
                  </template>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
      <el-button @click="addMonth(+1)" circle size="small" class="middle"><el-icon><ArrowRight/></el-icon></el-button>
    </sept-collapse>
  </div>
</template>

<style scoped>
.el-button.top {
  position: absolute;
}
.el-button.middle {
  position: relative;
  top: 5em;
}
table.calendar {
  vertical-align: top;
  margin: 0 0.3em;
  display: inline-block;
}
th.HEAD {
  color: #82ab2c;
  font-size: small;
}
th.SUN, th.MON, th.TUE, th.WED, th.THU, th.FRI, th.SAT {
  font-size: xx-small;
  line-height: 100%;
}
th.SUN {
  color: #a02;
}
th.MON {
  color: #a40;
}
th.TUE {
  color: #9a0;
}
th.WED {
  color: #2a0;
}
th.THU {
  color: #0a4;
}
th.FRI {
  color: #09a;
}
th.SAT {
  color: #02a;
}
td.SUN, td.MON, td.TUE, td.WED, td.THU, td.FRI, td.SAT, td.NONE {
  text-align: center;
  font-weight: bold;
  padding: 0;
  font-size: small;
  line-height: 110%;
  border-style: solid;
  border-width: 0 0 2px 0;
  border-color: transparent;
}
td.SUN {
  color: #a02;
}
td.MON {
  color: #a40;
}
td.TUE {
  color: #9a0;
}
td.WED {
  color: #2a0;
}
td.THU {
  color: #0a4;
}
td.FRI {
  color: #09a;
}
td.SAT {
  color: #02a;
}
td.HOLIDAY {
  border-color: #e96;
}
td.SUN.TODAY {
  color: #fff;
  background: #b84536;
}
td.MON.TODAY {
  color: #fff;
  background: #b86936;
}
td.TUE.TODAY {
  color: #fff;
  background: #c29f28;
}
td.WED.TODAY {
  color: #fff;
  background: #82ab2c;
}
td.THU.TODAY {
  color: #fff;
  background: #28c25e;
}
td.FRI.TODAY {
  color: #fff;
  background: #2695b8;
}
td.SAT.TODAY {
  color: #fff;
  background: #3257b8;
}
</style>
