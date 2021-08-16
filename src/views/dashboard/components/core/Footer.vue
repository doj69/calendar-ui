<template>
  <v-footer
    id="dashboard-core-footer"
    class="pa-1"
  >
    <v-container fluid>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          cols="12"
          md="auto"
          class="text-center"
        >
          <div class="body-1 font-weight-light pt-6 pt-md-0">
            &copy; {{ new Date().getFullYear() }}, made with
            <v-icon size="18">
              mdi-heart
            </v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'DashboardCoreFooter',

    data: () => ({

    }),
  }
</script>
