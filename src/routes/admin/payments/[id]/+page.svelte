<script>
  export let data;
  const payment = data.payment;
</script>

<div class="admin-dashboard">
  <h1>Detalhe do Pagamento</h1>
  {#if !payment}
    <p>Pagamento não encontrado.</p>
  {:else}
    <div class="payment-detail">
      <div><strong>ID:</strong> {payment.id}</div>
      <div><strong>Usuário:</strong> {payment.user_id}</div>
      <div><strong>Valor:</strong> R$ {payment.amount?.toFixed(2) || '-'}</div>
      <div><strong>Status:</strong> {payment.status}</div>
      <div><strong>Data:</strong> {payment.created_at?.slice(0,10) || '-'}</div>
    </div>
    <form method="POST">
      <button name="approve" type="submit" class="approve-btn">Aprovar</button>
      <button name="reject" type="submit" class="reject-btn">Rejeitar</button>
      <a href="/admin/payments/{payment.id}/edit" class="edit-btn" style="background:#888;margin-left:0.5em;">Editar/Deletar</a>
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
.admin-dashboard h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.payment-detail {
  background: #f7f7f7;
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: left;
  font-size: 1rem;
}
.approve-btn {
  background: #006600;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1.2em;
  margin-right: 0.7em;
  font-size: 1em;
  cursor: pointer;
}
.reject-btn {
  background: #a00;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1.2em;
  font-size: 1em;
  cursor: pointer;
}
.reject-btn:hover {
  background: #d00;
}
.approve-btn:hover {
  background: #009900;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
</style>
<!-- UI feedback placeholder for future global messages -->
