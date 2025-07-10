<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { invalidate } from '$app/navigation';
  let pix_key = '';
  let beneficiary_name = '';
  let beneficiary_city = '';
  let allow_public_trainings = true;
  let success = false;
  let error = '';
  $: config = $page.data.config;
  onMount(() => {
    if (config) {
      pix_key = config.pix_key || '';
      beneficiary_name = config.beneficiary_name || '';
      beneficiary_city = config.beneficiary_city || '';
      allow_public_trainings = config.allow_public_trainings !== undefined ? !!config.allow_public_trainings : true;
    }
  });
  async function saveConfig(e: SubmitEvent) {
    e.preventDefault();
    success = false;
    error = '';
    const form = new FormData();
    form.append('pix_key', pix_key);
    form.append('beneficiary_name', beneficiary_name);
    form.append('beneficiary_city', beneficiary_city);
    form.append('allow_public_trainings', allow_public_trainings ? '1' : '0');
    const res = await fetch('', { method: 'POST', body: form });
    if (res.ok) {
      success = true;
      await invalidate();
    } else {
      let data: any = {};
      try { data = await res.json(); } catch {}
      error = data.error || 'Erro ao salvar.';
    }
  }
</script>

<div class="pix-mobile">
  <h1>Configuração Pix</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  <form on:submit|preventDefault={saveConfig}>
    <label>
      Chave Pix
      <input bind:value={pix_key} name="pix_key" required />
    </label>
    <label>
      Nome do Beneficiário
      <input bind:value={beneficiary_name} name="beneficiary_name" maxlength="25" required />
    </label>
    <label>
      Cidade
      <input bind:value={beneficiary_city} name="beneficiary_city" maxlength="15" required />
    </label>
    <label style="margin-top:1em;">
      <input type="checkbox" bind:checked={allow_public_trainings} name="allow_public_trainings" />
      Permitir treinos públicos
    </label>
    <button type="submit">Salvar</button>
    {#if success}
      <div class="msg-success">Configuração salva!</div>
    {/if}
    {#if error}
      <div class="msg-error">{error}</div>
    {/if}
  </form>
</div>

<style>
/* MOBILE FIRST PIX CONFIG */
.pix-mobile {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  padding: 1.2rem 0.5rem 2rem 0.5rem;
}
.pix-mobile h1 {
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.pix-mobile form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1em;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 8px #0001;
  padding: 1.2em 1em;
}
.pix-mobile input {
  width: 100%;
  font-size: 1rem;
  padding: 0.7em;
  border-radius: 6px;
  border: 1px solid #bbb;
  margin-top: 0.3em;
}
.pix-mobile button {
  padding: 0.8em;
  border-radius: 6px;
  background: #222;
  color: #fff;
  font-weight: bold;
  border: none;
  margin-top: 0.5em;
}
.pix-mobile label {
  font-size: 1em;
  text-align: left;
}
.back-btn {
  display: block;
  margin: 0 auto 1.5rem auto;
  color: #207520;
  background: #e6ffe6;
  border: 1px solid #b2e5b2;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  text-align: center;
}
.back-btn:hover {
  background: #207520;
  color: #fff;
}
.msg-success {
  color: #207520;
  background: #e6ffe6;
  border-radius: 6px;
  padding: 0.7em;
  text-align: center;
  margin-top: 0.5em;
}
.msg-error {
  color: #a00;
  background: #ffe6e6;
  border-radius: 6px;
  padding: 0.7em;
  text-align: center;
  margin-top: 0.5em;
}
@media (min-width: 600px) {
  .pix-mobile {
    max-width: 400px;
    margin: 40px auto;
    border-radius: 12px;
    box-shadow: 0 2px 16px #0001;
  }
}
</style>
