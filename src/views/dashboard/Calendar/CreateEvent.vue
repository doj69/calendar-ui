<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-card>
      <v-card-title class="headline">
        {{ this.$t('newEvent') }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="name"
                dense
                outlined
                :label="$t('name')"
                :rules="[v => !!v || `Name is required`]"
              />
            </v-col>
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-textarea
                v-model="description"
                dense
                outlined
                :label="$t('description')"
                :rules="[v => !!v || `Description is required`]"
              />
            </v-col>

            <!-- Start Date Time -->
            <v-col
              cols="12"
              sm="6"
              md="3"
              class="pa-2"
            >
              <v-menu
                v-model="startDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    dense
                    outlined
                    :label="$t('startDate')"
                    :rules="[v => !!v || `Start Date is required`]"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="startDate"
                  :min="getDatePickerMin"
                  :max="endDate"
                  @input="startDateMenu = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
              class="pa-2"
            >
              <v-menu
                ref="startTimeMenu"
                v-model="startTimeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="startTime"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startTime"
                    dense
                    outlined
                    :label="$t('startTime')"
                    :rules="[v => !!v || `Start Time is required`]"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="startTimeMenu"
                  v-model="startTime"
                  format="24hr"
                  :max="endTime"
                  @click:minute="$refs.startTimeMenu.save(startTime)"
                />
              </v-menu>
            </v-col>

            <!-- End Date Time -->
            <v-col
              cols="12"
              sm="6"
              md="3"
              class="pa-2"
            >
              <v-menu
                v-model="endDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    dense
                    outlined
                    :label="$t('endDate')"
                    :rules="[v => !!v || `End Date is required`]"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="endDate"
                  :min="startDate"
                  @input="endDateMenu = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
              class="pa-2"
            >
              <v-menu
                ref="endTimeMenu"
                v-model="endTimeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="endTime"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endTime"
                    dense
                    outlined
                    :label="$t('endTime')"
                    :rules="[v => !!v || `End Time is required`]"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="endTimeMenu"
                  v-model="endTime"
                  format="24hr"
                  :min="startTime"
                  @click:minute="$refs.endTimeMenu.save(endTime)"
                />
              </v-menu>
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="3"
              class="pa-2"
            >
              <v-text-field
                v-model="color"
                dense
                outlined
                hide-details
                readonly
                :label="$t('remarkColor')"
                :rules="[v => !!v || `Remark Color is required`]"
              >
                <template v-slot:append>
                  <v-menu
                    v-model="colorPickerMenu"
                    top
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon
                        :color="color"
                        v-on="on"
                      >
                        mdi-palette
                      </v-icon>
                    </template>
                    <v-card>
                      <v-card-text class="pa-2">
                        <v-color-picker
                          v-model="color"
                          mode="hexa"
                          hide-mode-switch
                        />
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          text
          :loading="loadingSave"
          @click="onSave"
        >
          Save
        </v-btn>
        <v-btn
          color="warning"
          text
          :disabled="disabledCloseBtn"
          @click="onClose"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
  export default {
    name: 'CreateEvent',
    props: {
      closeDialog: {
        type: Function,
        default: null,
      },
      showSnackbar: {
        type: Function,
        default: null,
      },
      refreshEvent: {
        type: Function,
        default: null,
      },
    },
    data: () => ({
      name: '',
      description: '',
      startDateMenu: false,
      startDate: null,
      startTimeMenu: false,
      startTime: null,

      endDateMenu: false,
      endDate: null,
      endTimeMenu: false,
      endTime: null,

      colorPickerMenu: false,
      color: '#1976D2FF',
      model:
        {
          name: 'String',
          start: 'Datetime String',
          end: 'Datetime String',
          color: 'Hexa',
          timed: true,
          description: 'String',
        },
      valid: true,
      disabledCloseBtn: false,
      loadingSave: false,
    }),
    computed: {
      getDatePickerMin () {
        return new Date().toISOString().substr(0, 10)
      },

    },
    methods: {
      onClose () {
        this.onReset()
        this.closeDialog()
        this.refreshEvent()
      },
      async onSave () {
        const validate = this.$refs.form.validate()
        if (validate) {
          this.model = {
            name: this.name,
            description: this.description,
            start: `${this.startDate}T${this.startTime}`,
            end: `${this.endDate}T${this.endTime}`,
            color: this.color,
            timed: true,
          }
          this.disabledCloseBtn = true
          this.loadingSave = true
          await this.$axios.post('appointment', this.model)
            .then((response) => {
              if (response.status === 201) {
                this.showSnackbar(this.$t('saveMessage'), 'success')
              }
            })
            .catch((error) => {
              console.log(error.response.data)
              this.showSnackbar(error.response.data, 'red darken-2')
            })
            .finally(() => {
              this.disabledCloseBtn = false
              this.loadingSave = false
              this.onClose()
            })
        }
      },
      onReset () {
        this.$refs.form.reset()
      },
    },

  }
</script>
