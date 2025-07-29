import csv
import json

# Read the CSV file
medications = []

with open('UAE drug list.csv', 'r', encoding='utf-8') as file:
    csv_reader = csv.DictReader(file)
    
    for row in csv_reader:
        # Convert to PharmGenius format
        medication = {
            "name": row['Package Name'].strip() if row['Package Name'] else row['Generic Name'].strip(),
            "genericName": row['Generic Name'].strip(),
            "activeIngredient": row['Generic Name'].strip(),
            "dosageForm": row['Dosage Form'].strip(),
            "strength": row['Strength'].strip(),
            "packageSize": row['Package Size'].strip(),
            "drugCode": row['\ufeffDrug Code'].strip(),
            "genericCode": row['Generic Code'].strip(),
            "manufacturer": row['Manufacturer Name'].strip(),
            "agent": row['Agent Name'].strip(),
            "dispenseMode": row['Dispense Mode'].strip(),
            "status": row['Status'].strip(),
            "packagePricePublic": float(row['Package Price to Public']) if row['Package Price to Public'] else 0,
            "packagePricePharmacy": float(row['Package Price to Pharmacy']) if row['Package Price to Pharmacy'] else 0,
            "unitPricePublic": float(row['Unit Price to Public']) if row['Unit Price to Public'] else 0,
            "unitPricePharmacy": float(row['Unit Price to Pharmacy']) if row['Unit Price to Pharmacy'] else 0,
            
            # Daman Coverage - using the actual CSV columns
            "thiqa": row['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'].strip().lower() == 'yes',
            "basic": row['Included In Basic Drug Formulary'].strip().lower() == 'yes',
            "enhanced": True,  # Assuming enhanced covers everything
            "abm1": row['Included In ABM 1 Drug Formulary'].strip().lower() == 'yes',
            "abm7": row['Included In ABM 7 Drug Formulary'].strip().lower() == 'yes',
            
            # Prior authorization for controlled drugs and expensive medications
            "priorAuthorization": (
                'controlled' in row['Dispense Mode'].lower() or 
                (float(row['Package Price to Public']) if row['Package Price to Public'] else 0) > 500
            ),
            
            # Additional fields
            "thiqaMaxReimbursement": row['Thiqa Max. Reimbursement Price (Package)'].strip() if row['Thiqa Max. Reimbursement Price (Package)'] else "",
            "thiqaCopay": row['Thiqa co-pay amount (package)'].strip() if row['Thiqa co-pay amount (package)'] else "",
            "basicCopay": row['Basic co-pay amount (package)'].strip() if row['Basic co-pay amount (package)'] else "",
            "uppScope": row['UPP Scope'].strip().lower() == 'yes',
            "governmentFunded": row['Insurance Coverage For Government Funded Program'].strip().lower() == 'yes',
        }
        
        medications.append(medication)

# Create the final JSON structure
output_data = {
    "medications": medications
}

# Write to JSON file
with open('uae-official-formulary.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"Converted {len(medications)} medications from UAE official drug list")
print("Created uae-official-formulary.json")