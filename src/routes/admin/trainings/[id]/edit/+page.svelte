

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { invalidate } from '$app/navigation';
  import type { PageData, ActionData } from './$types';
  export let data: PageData;
  export let form: ActionData | undefined;
  const training = data.training;
  let name: string = training?.name || '';
  let fileInput: HTMLInputElement | null = null;
  let submitting = false;
  let feedbackTimeout: NodeJS.Timeout | null = null;

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
  {#if form?.success}
    <div class="success" role="status">{form.success}</div>
  {/if}
  {#if form?.error}
    <div class="error" role="alert">{form.error}</div>
  {/if}
  <form method="POST" enctype="multipart/form-data" on:submit|preventDefault={async (e) => {
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
    <label>Arquivo:<br/>
      <input type="file" name="file" bind:this={fileInput} accept="application/pdf,video/*,image/*" />
      {#if training}
        <small>Deixe em branco para não alterar</small>
      {/if}
    </label>
    <br/><br/>
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
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
</style>
