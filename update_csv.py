import csv
import os

paths = [
    'continnum_db/facturas_hoteles_1000.csv',
    'facturas_hoteles_1000.csv'
]

cols_to_remove = {'precio_desayuno', 'extras_total', 'tax_rate', 'precio_tax', 'tax_id'}

for p in paths:
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader)
            
            indices_to_keep = [i for i, h in enumerate(header) if h.strip() not in cols_to_remove]
            new_header = [header[i] for i in indices_to_keep]
            
            rows = []
            for row in reader:
                # Ensure the row has the correct number of columns
                if len(row) > max(indices_to_keep, default=-1):
                    rows.append([row[i] for i in indices_to_keep])
                    
        with open(p, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(new_header)
            writer.writerows(rows)
        print('Updated ' + p)
