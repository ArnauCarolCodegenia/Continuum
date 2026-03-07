const fs = require('fs');

const paths = [
    'c:/Users/Arnau/Desktop/Agentes/anything-llm/continnum_db/facturas_hoteles_1000.csv',
    'c:/Users/Arnau/Desktop/Agentes/anything-llm/facturas_hoteles_1000.csv'
];

paths.forEach(p => {
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        // Handle potential CRLF
        const lines = content.replace(/\r/g, '').split('\n').filter(l => l.trim() !== '');
        if (lines.length === 0) return;
        
        const headers = lines[0].split(',');
        const colsToRemove = ['precio_desayuno', 'extras_total', 'tax_rate', 'precio_tax', 'tax_id'];
        
        const indicesToKeep = headers
            .map((h, i) => colsToRemove.includes(h.trim()) ? -1 : i)
            .filter(i => i !== -1);
            
        const newLines = lines.map(line => {
            const parts = line.split(',');
            return indicesToKeep.map(i => parts[i]).join(',');
        });
        
        fs.writeFileSync(p, newLines.join('\n'));
        console.log('Updated ' + p);
    }
});
