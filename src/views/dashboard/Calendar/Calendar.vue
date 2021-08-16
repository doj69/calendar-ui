<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
            flat
            color="white"
          >
            <v-btn
              small
              class="mr-4"
              color="primary"
              @click="creteNewEvent"
            >
              {{ this.$t('newEvent') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="mr-4"
              color="green darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
              fab
              text
              small
              color="green darken-2"
              @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="green darken-2"
              @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              v-if="refreshBtn"
              icon
              class="mr-5"
              @click="getAllEventsAsync"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-progress-circular
              v-if="indeterminate"
              size="20"
              width="2"
              :indeterminate="indeterminate"
              color="primary"
              class="mr-9"
            />

            <v-menu
              bottom
              right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet
          height="485"
        >
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :now="today"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          />
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-btn
                  icon
                  @click="updateEventAsync(selectedEvent.id)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="deleteEventAsync(selectedEvent.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name" />
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.description" />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Create New Event -->
    <v-row justify="center">
      <v-dialog
        v-model="createDialog"
        persistent
        max-width="700"
      >
        <create-event
          v-if="createDialog"
          :close-dialog="closeCreateDialog"
          :refresh-event="getAllEventsAsync"
          :show-snackbar="showSnackbar"
        />
      </v-dialog>
    </v-row>

    <!-- Update Event -->
    <v-row justify="center">
      <v-dialog
        v-model="updateDialog"
        persistent
        max-width="700"
      >
        <update-event
          v-if="updateDialog"
          :close-dialog="closeUpdateDialog"
          :refresh-event="getAllEventsAsync"
          :show-snackbar="showSnackbar"
          :event-id="selectedEvent.id"
        />
      </v-dialog>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="colorResponse"
      right
    >
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>

  import CreateEvent from './CreateEvent.vue'
  import UpdateEvent from './UpdateEvent.vue'
  export default {
    names: 'Calender',
    components: {
      CreateEvent,
      UpdateEvent,
    },
    data: () => ({
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      createDialog: false,
      updateDialog: false,
      indeterminate: true,
      refreshBtn: true,
      text: '',
      timeout: 5000,
      colorResponse: '',
      snackbar: false,
    }),
    async mounted () {
      await this.getAllEventsAsync()
    },
    methods: {
      async getAllEventsAsync () {
        this.refreshBtn = false
        this.indeterminate = true
        await this.$axios.get('appointment')
          .then((response) => {
            this.events = response.data
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            this.refreshBtn = true
            this.indeterminate = false
          })
      },
      creteNewEvent () {
        this.createDialog = true
      },
      async deleteEventAsync (id) {
        await this.$axios.delete(`appointment/${id}`)
          .then((response) => {
            console.log(response)
            this.showSnackbar(this.$t('deleteMessage'), 'red darken-2')
          })
          .catch((error) => {
            this.showSnackbar(error.response.data, 'red darken-2')
          })
          .finally(() => {
            this.selectedOpen = false
            this.getAllEventsAsync()
          })
      },
      updateEventAsync () {
        this.updateDialog = true
      },
      closeCreateDialog () {
        this.createDialog = false
      },
      closeUpdateDialog () {
        this.updateDialog = false
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => { this.selectedOpen = true }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        this.start = start
        this.end = end
      },
      showSnackbar (text, color) {
        this.snackbar = true
        this.text = text
        this.colorResponse = color
      },
    },
  }
</script>
