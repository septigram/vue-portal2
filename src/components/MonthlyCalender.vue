<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

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
const holidays: { [key: string]: string } = {
  '2019/1/1': '元日',
  '2019/1/14': '成人の日',
  '2019/2/11': '建国記念の日',
  '2019/3/21': '春分の日',
  '2019/4/29': '昭和の日',
  '2019/4/30': '休日',
  '2019/5/1': '休日（祝日扱い）',
  '2019/5/2': '休日',
  '2019/5/3': '憲法記念日',
  '2019/5/4': 'みどりの日',
  '2019/5/5': 'こどもの日',
  '2019/5/6': '休日',
  '2019/7/15': '海の日',
  '2019/8/11': '山の日',
  '2019/8/12': '休日',
  '2019/9/16': '敬老の日',
  '2019/9/23': '秋分の日',
  '2019/10/14': '体育の日（スポーツの日）',
  '2019/10/22': '休日（祝日扱い）',
  '2019/11/3': '文化の日',
  '2019/11/4': '休日',
  '2019/11/23': '勤労感謝の日',
  '2020/1/1': '元日',
  '2020/1/13': '成人の日',
  '2020/2/11': '建国記念の日',
  '2020/2/23': '天皇誕生日',
  '2020/2/24': '休日',
  '2020/3/20': '春分の日',
  '2020/4/29': '昭和の日',
  '2020/5/3': '憲法記念日',
  '2020/5/4': 'みどりの日',
  '2020/5/5': 'こどもの日',
  '2020/5/6': '休日',
  '2020/7/23': '海の日',
  '2020/7/24': 'スポーツの日',
  '2020/8/10': '山の日',
  '2020/9/21': '敬老の日',
  '2020/9/22': '秋分の日',
  '2020/11/3': '文化の日',
  '2020/11/23': '勤労感謝の日',
  '2021/1/1': '元日',
  '2021/1/11': '成人の日',
  '2021/2/11': '建国記念の日',
  '2021/2/23': '天皇誕生日',
  '2021/3/20': '春分の日',
  '2021/4/29': '昭和の日',
  '2021/5/3': '憲法記念日',
  '2021/5/4': 'みどりの日',
  '2021/5/5': 'こどもの日',
  '2021/7/22': '海の日',
  '2021/7/23': 'スポーツの日',
  '2021/8/8': '山の日',
  '2021/8/9': '休日',
  '2021/9/20': '敬老の日',
  '2021/9/23': '秋分の日',
  '2021/11/3': '文化の日',
  '2021/11/23': '勤労感謝の日',
  '2022/1/1': '元日',
  '2022/1/10': '成人の日',
  '2022/2/11': '建国記念の日',
  '2022/2/23': '天皇誕生日',
  '2022/3/21': '春分の日',
  '2022/4/29': '昭和の日',
  '2022/5/3': '憲法記念日',
  '2022/5/4': 'みどりの日',
  '2022/5/5': 'こどもの日',
  '2022/7/18': '海の日',
  '2022/8/11': '山の日',
  '2022/9/19': '敬老の日',
  '2022/9/23': '秋分の日',
  '2022/10/10': 'スポーツの日',
  '2022/11/3': '文化の日',
  '2022/11/23': '勤労感謝の日',
  '2023/1/1':'元日',
  '2023/1/2':'休日',
  '2023/1/9':'成人の日',
  '2023/2/11':'建国記念の日',
  '2023/2/23':'天皇誕生日',
  '2023/3/21':'春分の日',
  '2023/4/29':'昭和の日',
  '2023/5/3':'憲法記念日',
  '2023/5/4':'みどりの日',
  '2023/5/5':'こどもの日',
  '2023/7/17':'海の日',
  '2023/8/11':'山の日',
  '2023/9/18':'敬老の日',
  '2023/9/23':'秋分の日',
  '2023/10/9':'スポーツの日',
  '2023/11/3':'文化の日',
  '2023/11/23':'勤労感謝の日',
  '2024/1/1':'元日',
  '2024/1/8':'成人の日',
  '2024/2/11':'建国記念の日',
  '2024/2/12':'休日',
  '2024/2/23':'天皇誕生日',
  '2024/3/20':'春分の日',
  '2024/4/29':'昭和の日',
  '2024/5/3':'憲法記念日',
  '2024/5/4':'みどりの日',
  '2024/5/5':'こどもの日',
  '2024/5/6':'休日',
  '2024/7/15':'海の日',
  '2024/8/11':'山の日',
  '2024/8/12':'休日',
  '2024/9/16':'敬老の日',
  '2024/9/22':'秋分の日',
  '2024/9/23':'休日',
  '2024/10/14':'スポーツの日',
  '2024/11/3':'文化の日',
  '2024/11/4':'休日',
  '2024/11/23':'勤労感謝の日',
};

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
      const ymd = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      const day = {
        ymd: ymd,
        holiday: holidays[ymd],
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
          <tr>
            <th colspan="7" class="HEAD">{{calendar.year}}/{{calendar.month}}</th>
          </tr>
          <tr>
            <template v-for="(head, hi) in heads" :key="hi">
              <th :class="heads[(hi + dayOfWeekHead) % 7]">{{heads[(hi + dayOfWeekHead) % 7]}}</th>
            </template>
          </tr>
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
  border-color: red;
}
td.HOLIDAY.SAT, td.HOLIDAY.SUN {
  border-color: transparent;
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
