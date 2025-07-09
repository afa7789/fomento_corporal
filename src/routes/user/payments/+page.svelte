<script lang="ts">
  export let data;
  let statusFilter = 'all';
  let payments = data.payments || [];
  let filtered = payments;
  $: filtered = statusFilter === 'all' ? payments : payments.filter(p => p.status === statusFilter);
</script>

<div class="user-payments">
  <h1>PAGAMENTOS</h1>
  <div class="actions">
    <button class="new-btn" on:click={() => window.location.href = '/user/payments/new'}>NOVO PAGAMENTO</button>
    <select bind:value={statusFilter} class="filter-select">
      <option value="all">Todos</option>
      <option value="pending">Pendente</option>
      <option value="approved">Aprovado</option>
      <option value="rejected">Rejeitado</option>
    </select>
  </div>
  <div class="table-wrapper">
    <table class="brutal-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Data</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        {#each filtered as p}
          <tr>
            <td>{p.id}</td>
            <td>R$ {p.amount}</td>
            <td class={"status-" + p.status}>{p.status.toUpperCase()}</td>
            <td>{p.date}</td>
            <td>{p.info || '-'}</td>
          </tr>
        {/each}
        {#if filtered.length === 0}
          <tr><td colspan="5" class="empty">Nenhum pagamento encontrado.</td></tr>
        {/if}
      </tbody>
    </table>
  </div>
  <div class="back-btn-container">
    <a href="/user" class="back-btn">← Voltar ao dashboard</a>
  </div>
</div>

<style>

body, .user-payments {
  color: #000;
}

.user-payments {
  max-width: 420px;
  margin: 0 auto;
  padding: 0.5rem 0.2rem 2rem 0.2rem;
}

h1 {
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 1.2rem;
  text-transform: uppercase;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
  justify-content: center;
}
.new-btn {
  background: #fff;
  color: #000;
  font-weight: bold;
  padding: 0.6rem 0;
  font-size: 1rem;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
}
.new-btn:hover {
  background: #000;
  color: #fff;
}
.filter-select {

  font-size: 1rem;
  padding: 0.5rem;
}
.brutal-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.brutal-table th, .brutal-table td {
  padding: 0.5em 0.2em;
  text-align: center;
  font-size: 0.95rem;
}
.brutal-table th {
  background: #000;
  color: #fff;
  font-weight: bold;
}
.status-pending { color: #bfa600; font-weight: bold; }
.status-approved { color: #207520; font-weight: bold; }
.status-rejected { color: #a00; font-weight: bold; }
.empty {
  color: #000;
  background: #ff0;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
}
.back-btn-container {
  margin-bottom: 1.2rem;
  text-align: left;
}
.back-btn {
  display: inline-block;
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
@media (max-width: 700px) {
  .brutal-table th, .brutal-table td {
    padding: 0.5rem 0.2rem;
    font-size: 0.95rem;
  }
  .actions {
    flex-direction: column;
    gap: 1rem;
  }
}
  .table-wrapper {
    width: 100%;
    overflow-x: auto;
    margin-top: 1rem;
  }
</style>
