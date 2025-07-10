<script lang="ts">
  import { invalidate } from '$app/navigation';
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let error = '';
  let success = false;
  let photoFile: File | null = null;
  let uploading = false;

  async function handleConfig(e: Event) {
    e.preventDefault();
    error = '';
    success = false;
    uploading = true;
    const form = new FormData(e.target as HTMLFormElement);
    if (photoFile) form.append('photo', photoFile);
    const res = await fetch('', { method: 'POST', body: form });
    uploading = false;
    if (res.ok) {
      success = true;
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
      photoFile = null;
      await invalidate();
    } else {
      let data: any = {};
      try { data = await res.json(); } catch {}
      error = data.error || 'Erro ao salvar.';
    }
  }
</script>

<div class="user-config-page">
  <h1>Configurações da Conta</h1>
  <form on:submit|preventDefault={handleConfig} enctype="multipart/form-data">
    <label>Foto de perfil
      <input type="file" name="photo" accept="image/*" on:change={e => photoFile = e.target.files[0]} />
    </label>
    <label>Senha atual
      <input type="password" name="currentPassword" bind:value={currentPassword} />
    </label>
    <label>Nova senha
      <input type="password" name="newPassword" bind:value={newPassword} minlength="6" />
    </label>
    <label>Confirmar nova senha
      <input type="password" name="confirmPassword" bind:value={confirmPassword} minlength="6" />
    </label>
    <button type="submit" disabled={uploading}>{uploading ? 'Salvando...' : 'Salvar alterações'}</button>
    {#if error}
      <div class="msg-error">{error}</div>
    {/if}
    {#if success}
      <div class="msg-success">Alterações salvas com sucesso!</div>
    {/if}
  </form>
</div>

<style>
.user-config-page {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  padding: 2rem 1.5rem;
  text-align: center;
}
.user-config-page h1 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}
.user-config-page label {
  display: block;
  margin-bottom: 1.1rem;
  text-align: left;
  font-size: 1rem;
}
.user-config-page input[type="file"] {
  margin-top: 0.5em;
}
.user-config-page input[type="password"] {
  width: 100%;
  font-size: 1rem;
  padding: 0.7em;
  border-radius: 6px;
  border: 1px solid #bbb;
  margin-top: 0.3em;
}
.user-config-page button {
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
