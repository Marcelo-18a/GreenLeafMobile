const carregarHistorico = async () => {
    try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token'); 
        console.log("Buscando histórico com o token:", token ? "Token presente" : "Token ausente");
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // PROTEÇÃO: Se o servidor não retornar status de sucesso (200), pega o texto puro para ver o erro
        if (!response.ok) {
            const textoErro = await response.text();
            console.log(`Erro no servidor (${response.status}):`, textoErro);
            setHistorico([]);
            return;
        }

        const dados = await response.json();
        setHistorico(Array.isArray(dados) ? dados : []);
    } catch (error) {
        console.log("Erro de rede ao carregar o histórico:", error);
        setHistorico([]);
    } finally {
        setLoading(false);
    }
};