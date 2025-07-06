<script>
    import { page } from '$app/stores';
    
    // Get user data from page data
    $: user = $page.data.user;
</script>

<div class="user-container">
    <div class="user-header">
        <h1>DASHBOARD USUÁRIO</h1>
        <form method="POST" action="/logout" class="logout-form">
            <button type="submit" class="logout-btn">SAIR</button>
        </form>
    </div>
    
    {#if user}
        <div class="welcome-card">
            <h2>BEM-VINDO, {user.name.toUpperCase()}</h2>
            <p>Tipo: <strong>USUÁRIO</strong></p>
        </div>
    {/if}
</div>

<style>
    .user-container {
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .user-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        border-bottom: 3px solid #000;
        padding-bottom: 15px;
    }
    
    h1 {
        margin: 0;
        font-size: 2rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .logout-form {
        margin: 0;
    }
    
    .logout-btn {
        padding: 8px 16px;
        background: #000;
        color: #fff;
        border: 2px solid #000;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
    }
    
    .logout-btn:hover {
        background: #fff;
        color: #000;
    }
    
    .welcome-card {
        border: 3px solid #000;
        padding: 20px;
        margin-bottom: 30px;
        background: #f0f8ff;
        text-align: center;
    }
    
    .welcome-card h2 {
        margin: 0 0 10px 0;
        font-size: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .user-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
        
        h1 {
            font-size: 1.5rem;
        }
    }
</style>
