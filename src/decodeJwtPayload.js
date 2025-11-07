export default function decodeJwtPayload(token) {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;

    let base64Url = parts[1];
    
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Url.length % 4) {
        base64Url += '=';
    }

    try {
        const base64 = atob(base64Url);
        const utf8String = decodeURIComponent(escape(base64));
        
        return JSON.parse(utf8String);
        
    } catch (e) {
        console.error("Erro ao decodificar o payload do JWT:", e);
        return null;
    }
}