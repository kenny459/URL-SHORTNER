const clients = new Map(); 
 
    export const addClient = (code, res) => { 
        if (!clients.has(code)) {
    clients.set(code, []);
    }  
     
    clients.get(code).push(res);

    } 
     
    export const removeClient = (code, res) => { 
        if (clients.has(code)) return;  
        const updatedClients = clients.get(code).filter(client => client !== res); 
        
        if (updatedClients.length === 0) {  
            clients.delete(code);
        } else {
            clients.set(code, updatedClients);
        }
    } 
     
    export const broadcast = (code, clickCount) => { 
        if (!clients.has(code)) return; 
         
        const message = `data: ${JSON.stringify({clickCount: Number(clickCount)})}\n\n`; 
         
        clients.get(code).forEach(res => res.write(message));

    }