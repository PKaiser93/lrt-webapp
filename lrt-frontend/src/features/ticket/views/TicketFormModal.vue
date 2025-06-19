<template>
  <div class="modal-backdrop fade show"></div>
  <div class="modal fade show d-block">
    <div class="modal-dialog">
      <div class="modal-content rounded-4">
        <div class="modal-header">
          <h5 class="modal-title">{{ ticket?._id ? 'Ticket bearbeiten' : 'Neues Ticket' }}</h5>
          <button class="btn-close" @click="$emit('close')"></button>
        </div>
        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="mb-3"><label>Title</label>
              <input v-model="form.title" class="form-control" required/>
            </div>
            <div class="mb-3"><label>Description</label>
              <textarea v-model="form.description" class="form-control" required/>
            </div>
            <div class="mb-3">
              <label>Status</label>
              <select v-model="form.status" class="form-select">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div class="mb-3">
              <label>Priority</label>
              <select v-model="form.priority" class="form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="mb-3"><label>Creator</label>
              <input v-model="form.creator" class="form-control" required/>
            </div>
            <div class="mb-3"><label>Assignee</label>
              <input v-model="form.assignee" class="form-control"/>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close')" type="button">Abbrechen</button>
            <button class="btn btn-success" type="submit">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useTicketStore } from '@/features/ticket/store/ticketStore';

const props = defineProps({ ticket: Object });
const emit  = defineEmits(['close','saved']);
const store = useTicketStore();

const form = reactive({
  title:       props.ticket?.title || '',
  description: props.ticket?.description || '',
  status:      props.ticket?.status || 'open',
  priority:    props.ticket?.priority || 'medium',
  creator:     props.ticket?.creator || '',
  assignee:    props.ticket?.assignee || ''
});

async function save() {
  if (props.ticket?._id) {
    await store.update(props.ticket._id, form);
  } else {
    await store.create(form);
  }
  emit('saved');
}
</script>
