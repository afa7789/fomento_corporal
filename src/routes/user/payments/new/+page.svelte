<script lang="ts">
  export let form;
  export let data;
  let error = form?.error || '';
  let success = form?.success || '';
  // Pix config do backend
  let pixConfig = data?.pixConfig;
  // Geração de QRCode dinâmico (usando API externa, ex: qrserver)
  $: qrCodeUrl = pixConfig?.pix_key
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixConfig.pix_key)}`
    : (import.meta.env.VITE_QR_CODE_PATH || '/static/qr.png');
</script>

<div class="brutal-form">
  <a href="/user" class="back-btn">← Voltar ao dashboard</a>
  <!-- Chave Pix acima de tudo -->
  <h1>DADOS PARA PAGAMENTO PIX</h1>
  <div class="qr-section" style="margin-bottom:2rem;">
    <span class="brutal-label">CHAVE PIX:</span>
    <div style="font-family:inherit;font-size:1.1rem;word-break:break-all;margin-bottom:0.5rem;border:2px dashed #000;padding:0.5rem 0.7rem;background:#f7f7f7;">{pixConfig?.pix_key || '---'}</div>
    {#if pixConfig?.beneficiary_name}
      <div style="font-size:0.95rem;margin-top:0.5rem;">Beneficiário: <b>{pixConfig.beneficiary_name}</b> ({pixConfig.beneficiary_city})</div>
    {/if}
     <div class="qr-section">
      <span class="brutal-label">QR CODE:</span>
      <img src={qrCodeUrl} alt="QR Code Pix" class="qr-img" />
    </div>
  </div>
  <h1>NOVO PAGAMENTO</h1>
  <p> compartilhar o comprovante de pagamento no sistema abaixo, ou no meio de contato como: whatsapp. </p>
  {#if error}
    <div class="error">{error}</div>
  {/if}
  {#if success}
    <div class="success">{success}</div>
  {/if}
  <form method="POST" enctype="multipart/form-data">
    <label class="brutal-label" for="amount">VALOR:</label>
    <input class="brutal-input" type="number" step="0.01" min="0.01" name="amount" id="amount" required />

    <label class="brutal-label" for="proof">COMPROVANTE (ARQUIVO):</label>
    <input class="brutal-input" type="file" name="proof" id="proof" accept="image/*,application/pdf" required />

    <label class="brutal-label" for="info">INFORMAÇÕES (OPCIONAL):</label>
    <input class="brutal-input" type="text" name="info" id="info" maxlength="255" />


   

    <button class="submit-btn" type="submit">ENVIAR PAGAMENTO</button>
  </form>
</div>

<style>
.brutal-form {
  max-width: 420px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  /* Removido border generalizada */
  padding: 2rem 1.5rem;
}
.back-btn {
  display: inline-block;
  margin-bottom: 1.2rem;
  background: #f0f0f0;
  color: #222;
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid #000;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #000;
  color: #fff;
}
h1 {
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  border-bottom: 4px solid #000;
  margin-bottom: 2rem;
}
.brutal-label {
  display: block;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.brutal-input {
  width: 100%;
  border: 4px solid #000;
  padding: 0.7rem;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  background: #fff;
  color: #000;
}
.qr-section {
  margin: 1.5rem 0;
  text-align: center;
}
.qr-img {
  display: block;
  margin: 0 auto;
  max-width: 180px;
  border: none;
  background: none;
}
.submit-btn {
  width: 100%;
  background: #fff;
  color: #000;
  border: 4px solid #000;
  font-weight: bold;
  padding: 1rem 0;
  font-size: 1.2rem;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
  transition: none;
}
.submit-btn:hover {
  background: #000;
  color: #fff;
}
.error {
  background: #f00;
  color: #fff;
  font-weight: bold;
  padding: 1rem;
  border: 4px solid #000;
  margin-bottom: 1.5rem;
  text-align: center;
}
.success {
  background: #0f0;
  color: #000;
  font-weight: bold;
  padding: 1rem;
  border: 4px solid #000;
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>
