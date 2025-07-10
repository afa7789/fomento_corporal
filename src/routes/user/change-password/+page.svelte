<script lang="ts">
  import { invalidate } from '$app/navigation';
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let error = '';
  let success = false;

  async function handleChangePassword(e: Event) {
    e.preventDefault();
    error = '';
    success = false;
    if (newPassword !== confirmPassword) {
      error = 'As senhas não coincidem.';
      return;
    }
    const res = await fetch('', {
      method: 'POST',
      body: new FormData(e.target as HTMLFormElement)
    });
    if (res.ok) {
      success = true;
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
      await invalidate();
    } else {
      let data: any = {};
      try { data = await res.json(); } catch {}
      error = data.error || 'Erro ao alterar senha.';
    }
  }
</script>

<div class="change-password-page">
  <h1>Alterar Senha</h1>
  <form on:submit|preventDefault={handleChangePassword}>
    <label>Senha atual
      <input type="password" name="currentPassword" bind:value={currentPassword} required />
    </label>
    <label>Nova senha
      <input type="password" name="newPassword" bind:value={newPassword} required minlength="6" />
    </label>
    <label>Confirmar nova senha
      <input type="password" name="confirmPassword" bind:value={confirmPassword} required minlength="6" />
    </label>
    <button type="submit">Salvar nova senha</button>
    {#if error}
      <div class="msg-error">{error}</div>
    {/if}
    {#if success}
      <div class="msg-success">Senha alterada com sucesso!</div>
    {/if}
  </form>
</div>

<style>
.change-password-page {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  padding: 2rem 1.5rem;
  text-align: center;
}
.change-password-page h1 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}
.change-password-page label {
  display: block;
  margin-bottom: 1.1rem;
  text-align: left;
  font-size: 1rem;
}
.change-password-page input {
  width: 100%;
  font-size: 1rem;
  padding: 0.7em;
  border-radius: 6px;
  border: 1px solid #bbb;
  margin-top: 0.3em;
}
.change-password-page button {
  padding: 0.8em;
  border-radius: 6px;
  background: #222;
  color: #fff;
  font-weight: bold;
  border: none;
  margin-top: 0.5em;
  width: 100%;
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
</style>
