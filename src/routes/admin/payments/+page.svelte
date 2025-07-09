<script>
  export let data;
  const payments = data.payments || [];
  let status = data.status || '';
  let sort = data.sort || 'desc';
</script>

<div class="admin-dashboard">
  <h1>Pagamentos</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  <form method="GET" class="filter-form">
    <select name="status" bind:value={status}>
      <option value="">Todos</option>
      <option value="pending">Pendente</option>
      <option value="approved">Aprovado</option>
      <option value="rejected">Rejeitado</option>
    </select>
    <select name="sort" bind:value={sort}>
      <option value="desc">Mais recentes</option>
      <option value="asc">Mais antigos</option>
    </select>
    <button type="submit">Filtrar</button>
  </form>
  {#if payments.length === 0}
    <p>Nenhum pagamento encontrado.</p>
  {:else}
    <ul class="payment-list">
      {#each payments as p}
        <li class="payment-item">
          <div><strong>Usuário:</strong> {p.user_name || p.user_id}</div>
          <div><strong>Valor:</strong> R$ {p.amount?.toFixed(2) || '-'}</div>
          <div><strong>Status:</strong> {p.status}</div>
          <div><strong>Data:</strong> {p.created_at?.slice(0,10) || '-'}</div>
          <div class="payment-actions">
            <a href="/admin/payments/{p.id}" class="edit-btn">Ver/Aprovar</a>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
<!-- UI feedback placeholder for future global messages -->

<style>
.admin-dashboard {
  max-width: 480px;
  margin: 32px auto;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}
.admin-dashboard h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.filter-form {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1.2em;
}
.filter-form select, .filter-form button {
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1em;
}
.filter-form button {
  background: #0066cc;
  color: #fff;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.filter-form button:hover {
  background: #004080;
}
.payment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.payment-item {
  background: #f7f7f7;
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: left;
  font-size: 1rem;
}
.payment-actions {
  margin-top: 0.7em;
}
.edit-btn {
  background: #0066cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4em 1em;
  text-decoration: none;
  font-size: 0.98em;
}
.edit-btn:hover {
  background: #004080;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
.back-btn, .create-btn, .edit-btn {
  display: inline-block;
  margin: 0.5rem 0.5rem 1.5rem 0;
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
.back-btn:hover, .create-btn:hover, .edit-btn:hover {
  background: #207520;
  color: #fff;
}
</style>
