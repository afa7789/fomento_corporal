<script>
    import { page } from '$app/stores';
    
    // Get form data and page data
    $: form = $page.form;
    $: data = $page.data;
    $: authenticated = data?.authenticated || form?.authenticated;
    $: user = data?.user;
</script>

<nav class="nav">
    <a href="/admin">← VOLTAR ADMIN</a>
    <form method="POST" action="/logout" class="logout-form" style="display:inline;">
        <button type="submit" class="logout-btn">SAIR</button>
    </form>
</nav>

<div class="container">
    <h1>MODO ULTIMATE ADMIN</h1>
    
    {#if form?.error}
        <div class="error">{form.error}</div>
    {/if}
    
    {#if form?.success}
        <div class="success">{form.success}</div>
    {/if}
    
    {#if !authenticated}
        <div class="card">
            <h3>ACESSO RESTRITO</h3>
            <p>Digite a senha ultimate para gerenciar administradores:</p>
            
            <form method="POST" action="?/authenticate">
                <div class="form-group">
                    <label for="ultimate_password">SENHA ULTIMATE:</label>
                    <input 
                        type="password" 
                        id="ultimate_password" 
                        name="ultimate_password" 
                        required
                        placeholder="Digite a senha ultimate"
                    />
                </div>
                
                <button type="submit">AUTENTICAR</button>
            </form>
        </div>
    {:else}
        <div class="card">
            <h3>GERENCIAR ADMINISTRADORES</h3>
            
            <form method="POST" action="?/create_admin">
                <div class="form-group">
                    <label for="username">NOVO ADMIN - USUÁRIO:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        required
                        value={form?.username || ''}
                        placeholder="Nome de usuário"
                    />
                </div>
                
                <div class="form-group">
                    <label for="password">SENHA:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required
                        placeholder="Senha do admin"
                    />
                </div>
                
                <div class="form-group">
                    <label for="name">NOME COMPLETO:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={form?.name || ''}
                        placeholder="Nome completo"
                    />
                </div>
                
                <div class="form-group">
                    <label for="email">EMAIL:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        value={form?.email || ''}
                        placeholder="email@exemplo.com"
                    />
                </div>
                
                <input type="hidden" name="user_type" value="admin" />
                <button type="submit">CRIAR USUÁRIO</button>
            </form>
        </div>
        
        <div class="card">
            <h3>RESET SENHA ADMIN</h3>
            
            <form method="POST" action="?/reset_admin">
                <div class="form-group">
                    <label for="reset_username">USUÁRIO ADMIN:</label>
                    <input 
                        type="text" 
                        id="reset_username" 
                        name="reset_username" 
                        required
                        placeholder="Usuário do admin"
                    />
                </div>
                
                <div class="form-group">
                    <label for="new_password">NOVA SENHA:</label>
                    <input 
                        type="password" 
                        id="new_password" 
                        name="new_password" 
                        required
                        placeholder="Nova senha"
                    />
                </div>
                
                <button type="submit">RESETAR SENHA</button>
            </form>
        </div>
    {/if}
</div>

<style>
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
}

.nav a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.nav a:hover {
    background-color: #e0e0e0;
}

.logout-btn {
    background-color: #dc3545 !important;
    color: white !important;
}

.logout-btn:hover {
    background-color: #c82333 !important;
}

.container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #0056b3;
}

.error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #f5c6cb;
}

.success {
    background-color: #d4edda;
    color: #155724;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #c3e6cb;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
}

h3 {
    color: #333;
    margin-bottom: 1rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .container {
        margin: 1rem auto;
        padding: 0 0.5rem;
    }
    
    .card {
        padding: 1rem;
    }
}
</style>
