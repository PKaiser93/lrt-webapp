<script setup>
import { onMounted } from 'vue'
import { useBetriebssystemStore } from '@/features/betriebssystem/store/betriebssystemStore'

const store = useBetriebssystemStore()
onMounted(() => store.fetchTrash())

function restoreItem(id) {
  store.restore(id)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-200 via-indigo-100 to-blue-100 p-4">
    <div class="relative w-full max-w-2xl rounded-3xl shadow-2xl bg-white/30 backdrop-blur-xl border border-white/40 overflow-hidden p-0">
      <!-- Glow-Gradient Hintergrund -->
      <div class="absolute inset-0 z-0 pointer-events-none"
           style="background: radial-gradient(circle at 70% 30%,rgba(236,72,153,0.13) 0,transparent 70%),radial-gradient(circle at 20% 60%,rgba(59,130,246,0.11) 0,transparent 80%);"></div>

      <div class="relative z-10 px-10 pt-10 pb-4">
        <div class="flex items-center gap-4 mb-2">
          <span class="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 via-fuchsia-500 to-blue-400 shadow-lg shadow-pink-200/30">
            <i class="bi bi-trash3 text-white text-4xl drop-shadow"></i>
          </span>
          <div>
            <h2 class="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
              Gelöschte Betriebssysteme
            </h2>
            <div class="text-fuchsia-700/80 text-base font-medium mt-1">
              Hier kannst du gelöschte Betriebssysteme wiederherstellen
            </div>
          </div>
        </div>

        <div class="overflow-x-auto w-full mt-8">
          <table class="w-full rounded-2xl overflow-hidden backdrop-blur-md bg-white/30">
            <thead>
            <tr>
              <th class="py-3 px-6 text-lg font-bold text-fuchsia-600 bg-white/40">Name</th>
              <th class="py-3 px-6 text-lg font-bold text-fuchsia-600 bg-white/40">Aktion</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="bs in store.trash"
                :key="bs._id"
                class="transition hover:scale-105 hover:shadow-xl bg-white/70 hover:bg-white/90"
            >
              <td class="py-6 px-6 flex items-center gap-4 text-lg font-semibold">
                  <span class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-fuchsia-100 via-pink-200 to-blue-100 shadow-inner shadow-pink-200">
                    <i class="bi bi-hdd-network text-fuchsia-600 text-2xl"></i>
                  </span>
                {{ bs.name }}
              </td>
              <td class="py-6 px-6 text-right">
                <button
                    class="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-blue-500 text-white font-semibold text-lg rounded-2xl px-7 py-3 shadow-lg hover:scale-105 hover:shadow-pink-200 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
                    @click="restoreItem(bs._id)"
                    title="Wiederherstellen"
                >
                  <i class="bi bi-arrow-clockwise text-2xl"></i>
                  <span class="hidden sm:inline">Wiederherstellen</span>
                </button>
              </td>
            </tr>
            <tr v-if="!store.trash.length">
              <td colspan="2" class="py-12 px-6 text-center text-fuchsia-400 text-2xl font-semibold bg-white/70">
                <i class="bi bi-emoji-laughing text-4xl mb-3"></i><br>
                Nichts im Papierkorb!
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
