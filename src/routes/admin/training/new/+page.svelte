<script>
  export let data;
  export let form;
  let groups = data.groups || [];
  let users = data.users || [];
</script>

<div class="admin-dashboard">
  <h1>Novo Treinamento</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  {#if form?.success}
    <div class="success">{form.success}</div>
  {/if}
  {#if form?.error}
    <div class="error">{form.error}</div>
  {/if}
  <form method="POST">
    <label>Nome do treinamento:<br/>
      <input type="text" name="name" required />
    </label>
    <label>Conteúdo do arquivo:<br/>
      <textarea name="file_content" rows="10" placeholder="Cole aqui o conteúdo do arquivo" style="font-family:monospace; width:100%; resize:vertical;" required></textarea>
    </label>
    <fieldset class="brutalist-box">
      <legend>Compartilhamento</legend>
      <label class="brutalist-checkbox-label">
        <input type="checkbox" name="everyone" value="1" class="brutalist-checkbox" />
        <span>Acessível a todos</span>
      </label>
      <label style="display:block; margin-bottom:0.1rem;">
        Grupos:<br/>
        <div class="checkbox-list">
          {#each groups as group}
            <label><input type="checkbox" name="groups" value={group.id}> {group.name}</label>
          {/each}
        </div>
      </label>
      <label style="display:block; margin-bottom:0.1rem;">
        Usuários:<br/>
        <div class="checkbox-list">
          {#each users as user}
            <label><input type="checkbox" name="users" value={user.id}> {user.name} ({user.username})</label>
          {/each}
        </div>
      </label>
      <small>Você pode combinar grupos, usuários e o acesso geral.</small>
    </fieldset>
    <br/>
    <button type="submit">Salvar</button>
  </form>
</div>

<style>
.back-btn {
  display: inline-block;
  margin-bottom: 0.5rem 0.5rem 1.5rem 0
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

form label {
  display: block;
  margin-bottom: 1rem;
  text-align: left;
}
input, select, button {
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.3rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
button {
  background: #000;
  color: #fff;
  border: 2px solid #000;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 1rem;
}
button:hover {
  background: #fff;
  color: #000;
}
.success {
  background: #e6ffe6;
  color: #006600;
  border-radius: 6px;
  padding: 0.7rem;
  margin-bottom: 1rem;
}
.error {
  background: #ffe6e6;
  color: #a00;
  border-radius: 6px;
  padding: 0.7rem;
  margin-bottom: 1rem;
}
.brutalist-box {
  border: 2px solid #222;
  border-radius: 10px;
  background: #fff;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: 'IBM Plex Mono', 'Menlo', 'Monaco', monospace;
  box-shadow: 4px 4px 0 #222;
  text-align: left;
}
.brutalist-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.7em;
  font-size: 1.1em;
  font-family: inherit;
  margin-bottom: 1.2em;
  font-weight: bold;
}
.brutalist-checkbox {
  width: 1.3em;
  height: 1.3em;
  accent-color: #222;
  border: 2px solid #222;
  border-radius: 4px;
  margin-right: 0.5em;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
</style>
