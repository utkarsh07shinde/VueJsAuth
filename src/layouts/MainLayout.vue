<template>
  <v-app>
    <Topbar @toggle-drawer="toggleSidebarRail" @toggle-notify="toggleNotifyDrawer" />

    <!-- LEFT SIDEBAR RAIL -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="isRail"
      permanent
      app
      width="250"
      class="main-sidebar"
    >
      <Sidebar :isRail="isRail" :pinned="pinned" @toggle-pin="togglePin"/>
    </v-navigation-drawer>

    <!-- RIGHT NOTIFICATION DRAWER -->
    <v-navigation-drawer v-model="notifyDrawer" location="right" temporary width="360">
      <div class="notification-header pa-4">
        <div class="d-flex align-center">
          <v-icon size="24" color="#1a237e" class="mr-2">mdi-notifications</v-icon>
          <span class="text-h6 font-weight-medium">Notifications</span>
          <v-spacer></v-spacer>
          <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error"></v-badge>
        </div>
        <div class="text-caption text-medium-emphasis mt-1">System alerts and updates</div>
      </div>
      
      <v-divider />
      
      <div class="notification-list">
        <v-list class="py-0">
          <v-list-item
            v-for="n in notifications"
            :key="n.id"
            @click="markAsRead(n.id)"
            class="notification-item"
            :class="{ 'notification-unread': !n.read }"
          >
            <template #prepend>
              <v-avatar size="40" :color="getNotificationColor(n.type)" class="mr-3">
                <v-icon size="18" color="white">{{ getNotificationIcon(n.type) }}</v-icon>
              </v-avatar>
            </template>
            
            <v-list-item-title class="text-body-2 font-weight-medium mb-1">
              {{ n.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption text-medium-emphasis">
              {{ n.message }}
            </v-list-item-subtitle>
            
            <template #append>
              <div class="text-right">
                <div class="text-caption text-medium-emphasis">{{ n.time }}</div>
                <v-icon 
                  v-if="!n.read" 
                  size="12" 
                  color="primary" 
                  class="mt-1"
                >mdi-circle</v-icon>
              </div>
            </template>
          </v-list-item>
        </v-list>
        
        <div v-if="notifications.length === 0" class="text-center py-8">
          <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-bell-off-outline</v-icon>
          <div class="text-body-2 text-medium-emphasis">No notifications</div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- MAIN CONTENT -->
    <v-main class="portal-main">
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import Topbar from './Topbar.vue'
import Sidebar from './Sidebar.vue'
import bus from '../styles/eventBus'

// Shared sidebar state
const drawer = ref(true)
const isRail = ref(true)
const pinned = ref(false)

// Shared notifications state
const notifyDrawer = ref(false)
const notifications = ref([])

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})


// Pin logic
const togglePin = () => {
  pinned.value = !pinned.value
  isRail.value = pinned.value ? false : true
}

// Notification listener
bus.on('user-action', (payload) => {
  notifications.value.unshift({ 
    id: Date.now(), 
    type: payload.type || 'info',
    message: payload.message || '',
    read: false,
    ...payload 
  })
})

// Drawer open = seen
const toggleNotifyDrawer = () => {
  notifyDrawer.value = !notifyDrawer.value
}

// Each item click = mark read
const markAsRead = (id) => {
  const n = notifications.value.find(n => n.id === id)
  if (n) n.read = true
}

// Hamburger flips rail but never hides sidebar
const toggleSidebarRail = () => {
  isRail.value = !isRail.value
}

// Notification helpers
const getNotificationColor = (type) => {
  const colors = {
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336'
  }
  return colors[type] || '#757575'
}

const getNotificationIcon = (type) => {
  const icons = {
    info: 'mdi-information',
    success: 'mdi-check-circle',
    warning: 'mdi-alert',
    error: 'mdi-alert-circle'
  }
  return icons[type] || 'mdi-bell'
}
</script>

<style scoped>
.portal-main {
  background: #000000;
  min-height: 100vh;
}

.main-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* Notification Styles */
.notification-header {
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.notification-list {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.notification-item {
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s ease;
}

.notification-item:hover {
  background: #f5f5f5;
}

.notification-unread {
  background: #f3f8ff;
}

.notification-unread:hover {
  background: #e8eaf6;
}

:deep(.v-navigation-drawer__content) {
  scrollbar-width: thin;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  width: 6px;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar-thumb) {
  background-color: #e0e0e0;
  border-radius: 3px;
}
</style>