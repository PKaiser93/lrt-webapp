<template>
  <div class="container py-4">
    <h2 class="mb-4">📊 Admin Dashboard</h2>

    <StatsCards />
    <DeviceCharts class="my-4" />
    <RecentImports class="mb-4" />
    <UserTable class="mb-4" />
    <SoftDeleteView class="mb-4" />
    <SystemAlerts />
  </div>
</template>

<script setup>
import StatsCards from '../components/admin/StatsCards.vue'
import RecentImports from '../components/admin/RecentImports.vue'
import UserTable from '../components/admin/UserTable.vue'
import DeviceCharts from '../components/admin/DeviceCharts.vue'
import SoftDeleteView from '../components/admin/SoftDeleteView.vue'
import SystemAlerts from '../components/admin/SystemAlerts.vue'
</script>
