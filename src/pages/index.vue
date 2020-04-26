<template>
  <v-form>
    <v-container>
      <v-row justify="start">
        <v-col>
          <v-radio-group
            v-model="userNum"
            :mandatory="true"
            @change="searchSchedule"
          >
            <v-radio
              v-for="(user, index) in users"
              :key="index"
              :label="user.userId"
              :value="user.userNum"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col>
          <v-date-picker
            v-model="date"
            @input="searchSchedule"
          ></v-date-picker>
        </v-col>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
      <v-row justify="center">
        <v-col :cols="1" class="add-border">
          時間
        </v-col>
        <v-col class="add-border">
          予定
        </v-col>
        <v-col class="add-border">
          結果
        </v-col>
        <v-col class="add-border">
          ポイント
        </v-col>
      </v-row>
      <v-row
        justify="center"
        v-for="(item, index) in schedules"
        :key="index"
      >
        <v-col :cols="1" class="add-border">
          {{index+'-'+(index+1)}}
        </v-col>
        <v-col class="add-border">
          <v-text-field
            v-model="item.timeSchedule"
            clearable
          ></v-text-field>
        </v-col>
        <v-col class="add-border">
          <v-text-field
            v-model="item.timeResult"
            clearable
          ></v-text-field>
        </v-col>
        <v-col class="add-border">
          <v-text-field
            v-model="item.timePoint"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            small
            @click="onSave"
          >
            保存
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import {TimeSchedule, TimeScheduleImpl} from '@/model/time-schedule'
import {UserData} from '@/model/user-data'

@Component({
  components: {
    Logo :() => import('@/components/Logo.vue'),
  }
})
export default class Index extends Vue{

  users: UserData[] = [];
  schedules: TimeSchedule [] = [];
  date: string = new Date().toISOString().substr(0, 10);
  userNum: string = '';

  async created(): Promise<void> {
    await this.searchUser();
    this.searchSchedule();
  }

  async searchUser(): Promise<void> {
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/user';
    return this.$axios.get(url)
      .then(response => {
        this.users = response.data;
      }).catch( error => {
        console.log("response error", error);
      });
  }

  async searchSchedule(): Promise<void> {
    const yyyyymmdd: string = this.date.replace(/-/g, '');
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/date';
    return this.$axios.get(url,{
        params: {
          user: this.userNum,
          date: yyyyymmdd
        }
      }).then(response => {
        this.schedules = response.data;
        this.makeSchedule(yyyyymmdd);
      }).catch( error => {
        console.log("response error", error);
      });
  }

  private makeSchedule(yyyymmdd: string): void {
    if (this.schedules == null || this.schedules.length !== 24) {
      this.schedules = [];
      for (let i = 0; i < 24; i++) {
        const schedule = new TimeScheduleImpl();
        schedule.userNum = '1';
        schedule.targetDate = yyyymmdd;
        schedule.targetTime = ('00' + i.toString()).slice(-2);
        this.schedules.push(schedule);
      }
    }
  }

  onSave(): void {
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/insert';
    this.$axios.post(url, this.schedules)
      .catch( error => {
        console.log(error);
      });
  }
}
</script>
<style scoped>
.add-border {
  border: 0.5px solid;
  border-color: black;
}
</style>
