<template>
  <v-app-bar
    id="app-bar"
    app
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="drawer">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />
  </v-app-bar>
</template>

<script>

  // Utilities
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    data: () => ({
      selected: [],
    }),

    computed: {
      ...mapState(['drawer']),
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      ToogleFavorite (itm) {
        console.log(itm)
      },
    },
  }
</script>
