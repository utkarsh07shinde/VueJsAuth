<template>
  <v-container fluid>
    <v-card elevation="2">

      <!-- Title + Global Search -->
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">Users (Server-side Pagination)</span>

        <v-text-field
          v-model="globalSearch"
          label="Global Search"
          density="compact"
          clearable
          style="max-width: 260px"
          @input="fetchUsers"
        />
      </v-card-title>

      <v-data-table-server
        :headers="headers"
        :items="users"
        :items-length="totalItems"
        :loading="loading"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        @update:options="fetchUsers"
      >

        <!-- ✅ CUSTOM HEADER ROW (NO v-slot modifiers) -->
        <template #headers="{ columns }">
          <tr>
            <th v-for="column in columns" :key="column.key">
              <div class="d-flex flex-column gap-1">

                <span>{{ column.title }}</span>

                <!-- Name filter -->
                <v-text-field
                  v-if="column.key === 'name'"
                  v-model="filters.name"
                  density="compact"
                  hide-details
                  placeholder="Filter"
                  @input="fetchUsers"
                />

                <!-- Role filter -->
                <v-select
                  v-if="column.key === 'role'"
                  v-model="filters.role"
                  :items="['Admin', 'User']"
                  density="compact"
                  hide-details
                  clearable
                  @update:modelValue="fetchUsers"
                />

                <!-- Status filter -->
                <v-select
                  v-if="column.key === 'status'"
                  v-model="filters.status"
                  :items="['Active', 'Inactive']"
                  density="compact"
                  hide-details
                  clearable
                  @update:modelValue="fetchUsers"
                />
              </div>
            </th>
          </tr>
        </template>

      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const users = ref([])
const loading = ref(false)

const globalSearch = ref('')
const filters = ref({
  name: '',
  role: null,
  status: null
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' }
]

/* Dummy DB */
const allUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@mail.com`,
  role: i % 2 === 0 ? 'Admin' : 'User',
  status: i % 3 === 0 ? 'Inactive' : 'Active'
}))

/* Fake API */
const fakeApiCall = (params) =>
  new Promise((resolve) => {
    setTimeout(() => {
      let data = [...allUsers]

      if (params.search) {
        const s = params.search.toLowerCase()
        data = data.filter(
          x => x.name.toLowerCase().includes(s) || x.email.toLowerCase().includes(s)
        )
      }

      if (params.name)
        data = data.filter(x => x.name.toLowerCase().includes(params.name.toLowerCase()))

      if (params.role)
        data = data.filter(x => x.role === params.role)

      if (params.status)
        data = data.filter(x => x.status === params.status)

      const totalCount = data.length
      const start = (params.page - 1) * params.pageSize
      const paged = data.slice(start, start + params.pageSize)

      resolve({ data: paged, totalCount })
    }, 300)
  })

const fetchUsers = async () => {
  loading.value = true

  const res = await fakeApiCall({
    page: page.value,
    pageSize: itemsPerPage.value,
    search: globalSearch.value,
    ...filters.value
  })

  users.value = res.data
  totalItems.value = res.totalCount
  loading.value = false
}

onMounted(fetchUsers)
</script>
