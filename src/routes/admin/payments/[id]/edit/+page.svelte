<script lang="ts">
  export let data;
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  let payment = data.payment;
  let error = '';
  let success = '';
  let amount = payment?.amount || 0;
  let status = payment?.status || 'pending';
  let date = payment?.date || '';
  let proof_file_path = payment?.proof_file_path || '';

  $: if (data.error) error = data.error;
  $: if (data.success) success = data.success;

  onMount(() => {
    if (!payment) error = 'Pagamento não encontrado.';
  });
</script>

<div class="admin-dashboard">
  <h1>Editar Pagamento</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  {#if error}
    <div class="error">{error}</div>
  {/if}
  {#if success}
    <div class="success">{success}</div>
  {/if}
  {#if payment}
    <form method="POST">
      <label>Valor:
        <input type="number" name="amount" min="0" step="0.01" bind:value={amount} required />
      </label>
      <label>Status:
        <select name="status" bind:value={status}>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
        </select>
      </label>
      <label>Data:
        <input type="date" name="date" bind:value={date} required />
      </label>
      <button type="submit" name="update">Salvar</button>
    </form>
    <form method="POST" style="margin-top:1em;">
      <button type="submit" name="delete" class="delete-btn" onclick="return confirm('Tem certeza que deseja deletar este pagamento?')">Deletar Pagamento</button>
    </form>
  {/if}
</div>

<style>
.admin-dashboard {
  max-width: 480px;
  margin: 32px auto;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}
label {
  display: block;
  margin-bottom: 1em;
  text-align: left;
}
input, select {
  width: 100%;
  padding: 0.5em;
  margin-top: 0.3em;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  background: #0077cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6em 1.5em;
  font-size: 1em;
  cursor: pointer;
}
.delete-btn {
  background: #a00;
}
.error {
  color: #a00;
  margin-bottom: 1em;
}
.success {
  color: #007700;
  margin-bottom: 1em;
}
</style>
<style>
.back-btn {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #207520;
  background: #e6ffe6;
  border: 1px solid #b2e5b2;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}
.back-btn:hover {
  background: #207520;
  color: #fff;
}
</style>
