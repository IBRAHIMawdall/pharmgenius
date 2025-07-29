// Sample drug interaction data
const drugInteractions = {
  "metformin": {"lisinopril": {"severity": "mild", "description": "May cause hypoglycemia. Monitor blood glucose levels."}, "insulin": {"severity": "moderate", "description": "Increased risk of hypoglycemia. Dose adjustments may be needed."}, "alcohol": {"severity": "severe", "description": "May cause lactic acidosis. Avoid alcohol while taking metformin."}},
  "aspirin": {"warfarin": {"severity": "severe", "description": "Increased risk of bleeding. Avoid combination if possible."}, "ibuprofen": {"severity": "moderate", "description": "May decrease cardioprotective effects of aspirin."}, "clopidogrel": {"severity": "mild", "description": "Increased antiplatelet effect. Monitor for bleeding."}},
  "lisinopril": {"potassium": {"severity": "moderate", "description": "May cause hyperkalemia. Monitor potassium levels."}, "spironolactone": {"severity": "moderate", "description": "Increased risk of hyperkalemia. Monitor potassium levels."}, "nsaids": {"severity": "moderate", "description": "May reduce antihypertensive effect. Monitor blood pressure."}},
  "atorvastatin": {"grapefruit": {"severity": "moderate", "description": "May increase atorvastatin levels. Avoid grapefruit juice."}, "clarithromycin": {"severity": "severe", "description": "May increase risk of myopathy. Consider alternative antibiotic."}, "cyclosporine": {"severity": "severe", "description": "Increased risk of myopathy and rhabdomyolysis. Avoid combination."}},
  "warfarin": {"vitamin_k": {"severity": "moderate", "description": "May decrease warfarin effectiveness. Maintain consistent vitamin K intake."}, "amiodarone": {"severity": "severe", "description": "Increases warfarin effect. Monitor INR closely and adjust warfarin dose."}, "nsaids": {"severity": "severe", "description": "Increased risk of bleeding. Avoid combination if possible."}},
  "levothyroxine": {"calcium": {"severity": "moderate", "description": "May decrease levothyroxine absorption. Take at least 4 hours apart."}, "iron": {"severity": "moderate", "description": "May decrease levothyroxine absorption. Take at least 4 hours apart."}, "antacids": {"severity": "moderate", "description": "May decrease levothyroxine absorption. Take at least 4 hours apart."}},
  "ozempic": {"insulin": {"severity": "moderate", "description": "Increased risk of hypoglycemia. Monitor blood glucose levels."}, "oral_diabetes_medications": {"severity": "moderate", "description": "May enhance hypoglycemic effect. Dose adjustments may be needed."}},
  "simvastatin": {"grapefruit": {"severity": "severe", "description": "Significantly increases simvastatin levels. Avoid grapefruit juice."}, "warfarin": {"severity": "moderate", "description": "May increase anticoagulant effect. Monitor INR."}},
  "prednisone": {"nsaids": {"severity": "moderate", "description": "Increased risk of GI bleeding. Use with caution."}, "warfarin": {"severity": "moderate", "description": "May increase anticoagulant effect. Monitor INR."}},
  "furosemide": {"digoxin": {"severity": "moderate", "description": "May increase digoxin toxicity due to hypokalemia. Monitor potassium and digoxin levels."}, "lithium": {"severity": "moderate", "description": "May increase lithium levels. Monitor lithium concentration."}},
  "tramadol": {"sertraline": {"severity": "moderate", "description": "Increased risk of serotonin syndrome. Monitor for symptoms."}, "warfarin": {"severity": "moderate", "description": "May increase anticoagulant effect. Monitor INR."}},
  "sertraline": {"tramadol": {"severity": "moderate", "description": "Increased risk of serotonin syndrome. Monitor for symptoms."}, "warfarin": {"severity": "moderate", "description": "May increase anticoagulant effect. Monitor INR."}},
  "pantoprazole": {"clopidogrel": {"severity": "moderate", "description": "May reduce clopidogrel effectiveness. Consider alternative PPI."}, "warfarin": {"severity": "mild", "description": "May slightly increase anticoagulant effect. Monitor INR."}},
  "montelukast": {"phenobarbital": {"severity": "mild", "description": "May decrease montelukast effectiveness. Monitor asthma control."}},
  "fluticasone": {"ritonavir": {"severity": "severe", "description": "Significantly increases fluticasone levels. Avoid combination."}},
  "carvedilol": {"insulin": {"severity": "moderate", "description": "May mask hypoglycemia symptoms. Monitor blood glucose closely."}, "verapamil": {"severity": "moderate", "description": "Increased risk of heart block. Monitor cardiac function."}},
  "spironolactone": {"lisinopril": {"severity": "moderate", "description": "Increased risk of hyperkalemia. Monitor potassium levels."}, "trimethoprim": {"severity": "moderate", "description": "Increased risk of hyperkalemia. Monitor potassium levels."}},
  "digoxin": {"furosemide": {"severity": "moderate", "description": "May increase digoxin toxicity due to hypokalemia. Monitor potassium and digoxin levels."}, "amiodarone": {"severity": "severe", "description": "Significantly increases digoxin levels. Reduce digoxin dose."}},
  "diltiazem": {"simvastatin": {"severity": "moderate", "description": "May increase simvastatin levels. Consider dose reduction."}, "digoxin": {"severity": "moderate", "description": "May increase digoxin levels. Monitor digoxin concentration."}},
  "valsartan": {"potassium": {"severity": "moderate", "description": "May cause hyperkalemia. Monitor potassium levels."}, "lithium": {"severity": "moderate", "description": "May increase lithium levels. Monitor lithium concentration."}},
  "rosuvastatin": {"cyclosporine": {"severity": "severe", "description": "Significantly increases rosuvastatin levels. Avoid combination."}, "warfarin": {"severity": "moderate", "description": "May increase anticoagulant effect. Monitor INR."}},
  "escitalopram": {"tramadol": {"severity": "moderate", "description": "Increased risk of serotonin syndrome. Monitor for symptoms."}, "warfarin": {"severity": "moderate", "description": "May increase anticoagulant effect. Monitor INR."}},
  "duloxetine": {"tramadol": {"severity": "moderate", "description": "Increased risk of serotonin syndrome. Monitor for symptoms."}, "warfarin": {"severity": "moderate", "description": "May increase bleeding risk. Monitor INR."}},
  "pregabalin": {"alcohol": {"severity": "moderate", "description": "Increased CNS depression. Avoid alcohol."}, "opioids": {"severity": "moderate", "description": "Increased risk of respiratory depression. Use with caution."}},
  "gabapentin": {"alcohol": {"severity": "moderate", "description": "Increased CNS depression. Avoid alcohol."}, "morphine": {"severity": "moderate", "description": "Increased gabapentin levels. Monitor for side effects."}}
};

export default function handler(req, res) {
  const { drug1, drug2 } = req.query;
  
  if (!drug1) {
    return res.status(400).json({ error: 'At least one drug name is required' });
  }
  
  const drug1Lower = drug1.toLowerCase();
  
  // If only one drug is provided, return all its interactions
  if (!drug2) {
    const interactions = {};
    
    for (const [drug, interactionData] of Object.entries(drugInteractions)) {
      if (drug.includes(drug1Lower) || drug1Lower.includes(drug)) {
        interactions[drug] = interactionData;
      }
    }
    
    for (const [drug, interactionData] of Object.entries(drugInteractions)) {
      for (const [interactingDrug, data] of Object.entries(interactionData)) {
        if (interactingDrug.includes(drug1Lower) || drug1Lower.includes(interactingDrug)) {
          if (!interactions[interactingDrug]) {
            interactions[interactingDrug] = {};
          }
          interactions[interactingDrug][drug] = data;
        }
      }
    }
    
    return res.status(200).json({ interactions });
  }
  
  // If two drugs are provided, check for specific interaction
  const drug2Lower = drug2.toLowerCase();
  let interaction = null;
  
  // Check direct interaction
  if (drugInteractions[drug1Lower] && drugInteractions[drug1Lower][drug2Lower]) {
    interaction = drugInteractions[drug1Lower][drug2Lower];
  } 
  // Check reverse interaction
  else if (drugInteractions[drug2Lower] && drugInteractions[drug2Lower][drug1Lower]) {
    interaction = drugInteractions[drug2Lower][drug1Lower];
  }
  // Check partial matches
  else {
    for (const [drug, interactionData] of Object.entries(drugInteractions)) {
      if (drug.includes(drug1Lower) || drug1Lower.includes(drug)) {
        for (const [interactingDrug, data] of Object.entries(interactionData)) {
          if (interactingDrug.includes(drug2Lower) || drug2Lower.includes(interactingDrug)) {
            interaction = data;
            break;
          }
        }
      }
      
      if (interaction) break;
    }
  }
  
  if (interaction) {
    return res.status(200).json({ interaction });
  } else {
    return res.status(200).json({ message: 'No known interaction between these medications' });
  }
}