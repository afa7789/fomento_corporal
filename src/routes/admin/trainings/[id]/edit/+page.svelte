<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { invalidate } from '$app/navigation';
  import type { PageData, ActionData } from './$types';
  export let data: PageData;
  export let form: ActionData | undefined;
  const training = data.training;
  let name: string = training?.name || '';
  let fileContent: string = data.fileContent || '';
  let fileError: string = data.fileError || '';
  let submitting = false;
  let feedbackTimeout: NodeJS.Timeout | null = null;
  // SSR data
  const groups = data.groups || [];
  const users = data.users || [];
  const access = data.access || [];
  // Helpers for checked state
  const accessEveryone = access.some(a => a.access_type === 'everyone');
  const accessGroups = access.filter(a => a.access_type === 'group').map(a => a.target_id);
  const accessUsers = access.filter(a => a.access_type === 'user').map(a => a.target_id);

  // Auto-clear feedback after 3s
  $: if (form?.success || form?.error) {
    if (feedbackTimeout) clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      invalidate('form');
    }, 3000);
  }

  onMount(() => {
    return () => {
      if (feedbackTimeout) clearTimeout(feedbackTimeout);
    };
  });
</script>

<div class="admin-dashboard">
  <h1>{training ? 'Editar Treinamento' : 'Novo Treinamento'}</h1>
  <a href="/admin" class="back-btn"> Voltar ao dashboard</a>
  {#if form?.success}
    <div class="success" role="status">{form.success}</div>
  {/if}
  {#if form?.error}
    <div class="error" role="alert">{form.error}</div>
  {/if}
  {#if fileError}
    <div class="error" role="alert">{fileError}</div>
  {/if}
  <form method="POST" on:submit|preventDefault={async (e) => {
    submitting = true;
    const formData = new FormData(e.target as HTMLFormElement);
    // Use fetch to submit form for better feedback
    const res = await fetch('', {
      method: 'POST',
      body: formData
    });
    submitting = false;
    await invalidate('form');
  }}>
    <label>Nome do treinamento:<br/>
      <input type="text" name="name" required bind:value={name} autocomplete="off" maxlength="100" />
    </label>
    <br/><br/>
    <label>Conteúdo do arquivo:<br/>
      <textarea name="file_content" rows="10" placeholder="Cole aqui o conteúdo do arquivo" style="font-family:monospace; width:100%; resize:vertical;" bind:value={fileContent}></textarea>
    </label>
    <br/><br/>
    <fieldset style="border:1px solid #ccc; border-radius:6px; padding:1rem;">
      <legend>Compartilhamento</legend>
      <label style="display:block; margin-bottom:0.5rem;">
        <input type="checkbox" name="everyone" value="1" checked={accessEveryone} /> Acessível a todos
      </label>
      <label style="display:block; margin-bottom:0.5rem;">
        Grupos:<br/>
        <div class="checkbox-list">
          {#each groups as group}
            <label><input type="checkbox" name="groups" value={group.id} checked={accessGroups.includes(group.id)}> {group.name}</label>
          {/each}
        </div>
      </label>
      <label style="display:block; margin-bottom:0.5rem;">
        Usuários:<br/>
        <div class="checkbox-list">
          {#each users as user}
            <label><input type="checkbox" name="users" value={user.id} checked={accessUsers.includes(user.id)}> {user.name} ({user.username})</label>
          {/each}
        </div>
      </label>
      <label style="display:block; margin-bottom:0.5rem;">
        <input type="checkbox" name="is_public" value="1" checked={training?.is_public} />
        <span>Treino público</span>
      </label>
      <small>Você pode combinar grupos, usuários, o acesso geral e marcar como público.</small>
    </fieldset>
    <br/>
    <button type="submit" disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar'}</button>
  </form>
</div>

<style>
.admin-dashboard {
  max-width: 480px;
  margin: 32px auto;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 12px #0001;
}
.admin-dashboard h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
div.success {
  background: #e0ffe0;
  color: #207520;
  border: 1px solid #b2e5b2;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 500;
}
div.error {
  background: #ffe0e0;
  color: #a00;
  border: 1px solid #e5b2b2;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 500;
}
form label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
}
input[type="text"] {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 4px;
}
input[type="file"] {
  margin-top: 4px;
}
button[type="submit"] {
  background: #207520;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button[disabled] {
  background: #aaa;
  cursor: not-allowed;
}
.checkbox-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}
.checkbox-list label {
  display: flex;
  align-items: center;
  font-weight: normal;
  margin-right: 1rem;
  margin-bottom: 0.2rem;
  font-size: 1rem;
  cursor: pointer;
}
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
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
</style>
