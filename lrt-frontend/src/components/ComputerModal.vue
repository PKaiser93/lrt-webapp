<template>
  <div class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1" @click="$emit('close')">
    <div class="modal-dialog modal-lg modal-dialog-centered" @click.stop>
      <div class="modal-content shadow-lg rounded-4">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            🖥️ {{ computer.dnsName || 'Computer-Details' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>

        <div class="modal-body">
          <!-- 💾 Hardware -->
          <section class="mb-3">
            <h6 class="text-primary">💾 Hardware</h6>
            <ul class="list-unstyled">
              <li><strong>Marke:</strong> {{ computer.marke }}</li>
              <li><strong>Typ:</strong> {{ computer.typ }}</li>
              <li><strong>CPU:</strong> {{ computer.cpu }}</li>
              <li><strong>RAM:</strong> {{ computer.ram }}</li>
              <li><strong>Speicher:</strong> {{ computer.hddssd }}</li>
              <li><strong>Grafik:</strong> {{ computer.grafikkarte }}</li>
              <li><strong>Chipsatz:</strong> {{ computer.chipsatz }}</li>
              <li><strong>TPM:</strong> {{ computer.tpm }}</li>
            </ul>
          </section>

          <!-- 💽 Betriebssystem -->
          <section class="mb-3">
            <h6 class="text-success">💽 Betriebssystem</h6>
            <ul class="list-unstyled">
              <li><strong>OS:</strong> {{ computer.betriebssystem.name }}</li>
              <li><strong>Version:</strong> {{ computer.version }}</li>
              <li><strong>Abstraktion:</strong> {{ computer.abstraktionsebene }}</li>
            </ul>
          </section>

          <!-- 🌐 Netzwerk -->
          <section class="mb-3">
            <h6 class="text-info">🌐 Netzwerk</h6>
            <ul class="list-unstyled">
              <li><strong>DNS:</strong> {{ computer.dnsName }}</li>
              <li><strong>IP:</strong> {{ computer.ipAdresse }}</li>
              <li><strong>MAC:</strong> {{ computer.macAdresse }}</li>
              <li><strong>DHCP:</strong> {{ computer.dhcp }}</li>
            </ul>
          </section>

          <!-- 👤 Benutzer -->
          <section class="mb-3">
            <h6 class="text-warning">👤 Benutzer</h6>
            <ul class="list-unstyled">
              <li><strong>Name:</strong> {{ computer.benutzer }}</li>
              <li><strong>IdM:</strong> {{ computer.idmKennung }}</li>
              <li><strong>Betreuer:</strong> {{ computer.betreuer }}</li>
              <li><strong>Arbeit:</strong> {{ computer.artDerArbeit }}</li>
              <li><strong>Start:</strong> {{ computer.startdatum }}</li>
              <li><strong>Abgabe:</strong> {{ computer.abgabe }}</li>
            </ul>
          </section>

          <!-- 🏢 Standort -->
          <section>
            <h6 class="text-secondary">🏢 Raum</h6>
            <ul class="list-unstyled">
              <li><strong>Raumnr:</strong> {{ computer.raumnummer }}</li>
              <li><strong>Kategorie:</strong> {{ computer.kategorie.bezeichnung }}</li>
              <li><strong>Lfd. Nr:</strong> {{ computer.laufendeNummer }}</li>
              <li><strong>StudPCs:</strong> {{ computer.studPCs }}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['computer'])
</script>

<style scoped>
.modal-content {
  animation: fadeSlideIn 0.3s ease;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
