<script>
  import ProofText from './ProofText.svelte';
  export let data;
  const payment = data.payment;
</script>

<div class="admin-dashboard">
  <h1>Detalhe do Pagamento</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  {#if !payment}
    <p>Pagamento não encontrado.</p>
  {:else}
    <div class="payment-detail">
      <div><strong>Usuário:</strong> {payment.user_name}</div>
      <div><strong>Valor:</strong> R$ {payment.amount?.toFixed(2) || '-'}</div>
      {#if payment.info}
        <div class="payment-info"><strong>Informações:</strong> {payment.info}</div>
      {/if}
      <div><strong>Status:</strong> {payment.status}</div>
      <div><strong>Data:</strong> {payment.created_at?.slice(0,10) || '-'}</div>
    </div>
    {#if payment.proof_file_path}
      <div class="proof-block">
        <strong>Comprovante:</strong>
        {#if payment.proof_file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i)}
          <div class="proof-img-wrapper">
            <a href={"/admin/api/uploads/" + (payment.proof_file_path.split('/').pop())} target="_blank" rel="noopener">
              <img src={"/admin/api/uploads/" + (payment.proof_file_path.split('/').pop())} alt="Comprovante" class="proof-img" />
            </a>
          </div>
        {:else if payment.proof_file_path.match(/\.txt$/i)}
          <ProofText filePath={"/admin/api/uploads/" + (payment.proof_file_path.split('/').pop())} />
        {:else if payment.proof_file_path.match(/\.pdf$/i)}
          <a href={"/admin/api/uploads/" + (payment.proof_file_path.split('/').pop())} target="_blank" rel="noopener" class="proof-link">Visualizar PDF</a>
        {:else}
          <a href={"/admin/api/uploads/" + (payment.proof_file_path.split('/').pop())} target="_blank" rel="noopener" class="proof-link">Baixar arquivo</a>
        {/if}
      </div>
    {/if}
    <form method="POST">
      <button type="submit" name="action" value="approve" class="approve-btn">Aprovar</button>
      <button type="submit" name="action" value="reject" class="reject-btn">Rejeitar</button>
    </form>
  {/if}
</div>

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
.payment-info {
  margin: 0.5em 0 0.5em 0;
  background: #fffbe6;
  border-left: 4px solid #bfa600;
  padding: 0.5em 1em;
  font-size: 1em;
  font-family: inherit;
  color: #333;
  border-radius: 6px;
  word-break: break-word;
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
.proof-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.7rem;
}
.proof-img {
  max-width: 90vw;
  max-height: 260px;
  width: auto;
  height: auto;
  border: 2px solid #000;
  background: #fff;
  border-radius: 8px;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
}
.proof-img:hover {
  box-shadow: 0 0 0 4px #bfa600;
  border-color: #bfa600;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
</style>