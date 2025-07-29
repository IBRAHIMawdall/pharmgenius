import sqlite3
import json

# Connect to the database
conn = sqlite3.connect('../database/drugs.db')
cursor = conn.cursor()

# Query all drugs
cursor.execute("SELECT * FROM drugs")
rows = cursor.fetchall()

# Get column names
cursor.execute("PRAGMA table_info(drugs)")
columns = [column[1] for column in cursor.fetchall()]

# Convert to list of dictionaries
drugs_data = []
for row in rows:
    drug_dict = dict(zip(columns, row))
    
    # Convert to PharmGenius format
    pharmgenius_drug = {
        "name": drug_dict["drug_name"],
        "genericName": drug_dict["generic_name"],
        "activeIngredient": drug_dict["generic_name"],
        "dosageForm": drug_dict["dosage_form"],
        "strength": drug_dict["strength"],
        "category": drug_dict["category"],
        "manufacturer": drug_dict["manufacturer"],
        "indications": drug_dict["indications"],
        "contraindications": drug_dict["contraindications"],
        "sideEffects": drug_dict["side_effects"],
        "interactions": drug_dict["interactions"],
        "pregnancyCategory": drug_dict["pregnancy_category"],
        "breastfeedingSafe": drug_dict["breastfeeding_safe"],
        "controlledSubstance": drug_dict["controlled_substance"],
        "requiresPrescription": bool(drug_dict["requires_prescription"]),
        "price": drug_dict["price"],
        # Default Daman coverage (you can adjust these based on actual coverage)
        "thiqa": True,
        "basic": True if drug_dict["price"] < 30 else False,
        "enhanced": True,
        "priorAuthorization": True if drug_dict["controlled_substance"] or drug_dict["price"] > 50 else False
    }
    
    drugs_data.append(pharmgenius_drug)

# Create the final JSON structure
output_data = {
    "medications": drugs_data
}

# Write to JSON file
with open('uae-drugs-formulary.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(drugs_data)} drugs from database")
print("Created uae-drugs-formulary.json")

conn.close()