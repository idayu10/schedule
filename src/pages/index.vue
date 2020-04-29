<template>
  <v-form>
    <v-container>
      <v-row justify="center">
        <v-col></v-col>
        <v-col>
          <v-text-field
            v-model="userId"
            label="Enter ID"
            clearable
          ></v-text-field>
        </v-col>
        <v-col></v-col>
      </v-row>
      <v-row justify="center">
        <v-col></v-col>
        <v-col>
          <v-text-field
            v-model="password"
            label="Enter password"
            :append-icon="hide ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (hide = !hide)"
            :type="hide ? 'password' : 'text'"
            clearable
          ></v-text-field>
        </v-col>
        <v-col></v-col>
      </v-row>
      <v-row>
        <v-col></v-col>
        <v-col>
          <v-dialog v-model="dialog" persistent max-width="350">
            <template v-slot:activator="scope">
              <v-btn
                small
                @click="onLogin(scope)"
              >
                ログイン
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">ログインに失敗しました</v-card-title>
              <v-card-text>IDまたはパスワードが異なります</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">閉じる</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import {TimeSchedule, TimeScheduleImpl} from '@/model/time-schedule'
import {UserData} from '@/model/user-data'
import {WordSource} from '@/model/word-source'
import {HistoryData, HistoryDataImpl} from '@/model/history-data'
import {Suggest, SuggestImpl} from '@/model/suggest'

@Component({
  components: {
    SuggestInput :() => import('@/components/SuggestInput.vue'),
  }
})
export default class Index extends Vue{

  userId: string = '';
  password: string = '';
  hide: boolean = true;
  dialog: boolean = false;

  async created(): Promise<void> {
  }

  async onLogin(scope: any): Promise<void> {
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/login';
    return this.$axios.get(url, {
        params: {
          id: this.userId,
          password: this.password
        }
      })
      .then(response => {
        if (response && response.data) {
          this.$store.commit('login-state/login', response.data);
          this.$router.push('/main');
        } else {
          scope.value = true;
        }
      }).catch( error => {
        console.log("response error", error);
      });
  }
}
</script>
<style scoped>
</style>
