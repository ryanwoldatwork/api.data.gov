import {
  computed,
  defineComponent,
  onMounted,
  ref,
  // eslint-disable-next-line import/extensions
} from "vue/dist/vue.esm-bundler.js";

import OrganizationsTable from "../components/OrganizationsTable";
import UsageChart from "../components/UsageChart";
import useMetricsStore from "../stores/metrics";

export default defineComponent({
  components: {
    UsageChart,
    OrganizationsTable,
  },

  template: `
    <div class="home">
      <h1>api.data.gov Metrics</h1>

      <div class="container form-group custom-select-lg-container">
        <select v-model="selectedOrganization" class="custom-select custom-select-lg">
          <option value="all">All Agencies</option>
          <option v-for="name in organizationNames" v-bind:value="name">{{ name }}</option>
        </select>
      </div>

      <div class="row">
        <div class="col-md-6">
          <UsageChart
            title="Last 30 Days"
            v-bind:hits="store.hitsRecentDaily(selectedOrganization)"
            v-bind:hits-total="store.hitsRecentTotal(selectedOrganization)"
            v-bind:active-api-keys="store.activeApiKeysRecentDaily(selectedOrganization)"
            v-bind:active-api-keys-total="store.activeApiKeysRecentTotal(selectedOrganization)"
            />
        </div>
        <div class="col-md-6">
          <UsageChart
            title="All Time"
            v-bind:hits="store.hitsMonthly(selectedOrganization)"
            v-bind:hits-total="store.hitsTotal(selectedOrganization)"
            v-bind:active-api-keys="store.activeApiKeysMonthly(selectedOrganization)"
            v-bind:active-api-keys-total="store.activeApiKeysTotal(selectedOrganization)"
            />
        </div>
      </div>

      <hr>

      <div class="form-group h3 text-center font-weight-light">
        {{ organizationNames.length }} participating agencies
      </div>

      <div>
        <OrganizationsTable/>
      </div>
    </div>
  `,

  setup() {
    const selectedOrganization = ref("all");

    const store = useMetricsStore();

    const organizationNames = computed(() => {
      const names = [];
      store.organizations.forEach((organization) => {
        names.push(organization.name);
      });
      names.sort();

      return names;
    });

    onMounted(() => {
      store.fetchAnalytics();
    });

    return {
      selectedOrganization,
      organizationNames,
      store,
    };
  },
});
