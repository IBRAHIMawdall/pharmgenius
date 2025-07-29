import axios from 'axios';

class ICD10DrugService {
  constructor() {
    this.icd10ServiceUrl = 'http://localhost:5003';
    this.uaeDrugList = null;
  }

  // Load UAE drug list
  async loadUAEDrugList() {
    if (!this.uaeDrugList) {
      try {
        const response = await axios.get('/uae-drug-list.json');
        this.uaeDrugList = response.data;
      } catch (error) {
        console.error('Error loading UAE drug list:', error);
        this.uaeDrugList = [];
      }
    }
    return this.uaeDrugList;
  }

  // Search ICD-10 codes
  async searchICD10(query) {
    try {
      const response = await axios.get(`${this.icd10ServiceUrl}/search`, {
        params: { query, limit: 10 }
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Error searching ICD-10:', error);
      return [];
    }
  }

  // Get drugs for specific ICD-10 code
  async getDrugsForICD10(icd10Code) {
    try {
      const response = await axios.get(`${this.icd10ServiceUrl}/icd10/${icd10Code}/drugs`);
      return response.data.drugs || [];
    } catch (error) {
      console.error('Error getting drugs for ICD-10:', error);
      return [];
    }
  }

  // Get ICD-10 mappings for a drug
  async getICD10ForDrug(drugName) {
    try {
      const response = await axios.get(`${this.icd10ServiceUrl}/drugs/${drugName}/indications`);
      return response.data.icd10_mappings || [];
    } catch (error) {
      console.error('Error getting ICD-10 for drug:', error);
      return [];
    }
  }

  // Search UAE drugs with ICD-10 integration
  async searchUAEDrugsWithICD10(drugName, icd10Code = null) {
    await this.loadUAEDrugList();
    
    // Filter UAE drugs by name
    let filteredDrugs = this.uaeDrugList.filter(drug => 
      drug['Package Name'] && 
      drug['Package Name'].toLowerCase().includes(drugName.toLowerCase())
    );

    // If ICD-10 code provided, get related drugs and cross-reference
    if (icd10Code) {
      try {
        const icd10Drugs = await this.getDrugsForICD10(icd10Code);
        const icd10DrugNames = icd10Drugs.map(d => d.name?.toLowerCase());
        
        // Prioritize drugs that match ICD-10 indications
        filteredDrugs = filteredDrugs.map(drug => ({
          ...drug,
          icd10Match: icd10DrugNames.some(name => 
            drug['Package Name'].toLowerCase().includes(name) ||
            drug['Generic Name']?.toLowerCase().includes(name)
          )
        })).sort((a, b) => b.icd10Match - a.icd10Match);
      } catch (error) {
        console.error('Error cross-referencing with ICD-10:', error);
      }
    }

    return filteredDrugs.slice(0, 20); // Limit results
  }

  // Get insurance approval requirements
  async getInsuranceApprovalInfo(drugCode, icd10Code) {
    const drug = this.uaeDrugList?.find(d => d['Drug Code'] === drugCode);
    if (!drug) return null;

    return {
      drugCode,
      packageName: drug['Package Name'],
      genericName: drug['Generic Name'],
      insuranceCoverage: {
        thiqa: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
        basic: drug['Included In Basic Drug Formulary'] === 'Yes',
        abm1: drug['Included In ABM 1 Drug Formulary'] === 'Yes',
        abm7: drug['Included In ABM 7 Drug Formulary'] === 'Yes'
      },
      pricing: {
        publicPrice: parseFloat(drug['Package Price to Public']) || 0,
        pharmacyPrice: parseFloat(drug['Package Price to Pharmacy']) || 0,
        thiqaMaxReimbursement: parseFloat(drug['Thiqa Max. Reimbursement Price (Package)']) || 0,
        thiqaCopay: parseFloat(drug['Thiqa co-pay amount (package)']) || 0,
        basicCopay: parseFloat(drug['Basic co-pay amount (package)']) || 0
      },
      icd10Code,
      approvalRequired: this.requiresPreAuthorization(drug, icd10Code)
    };
  }

  // Check if pre-authorization is required
  requiresPreAuthorization(drug, icd10Code) {
    // Logic to determine if pre-auth is needed based on drug and diagnosis
    const highCostThreshold = 500; // AED
    const publicPrice = parseFloat(drug['Package Price to Public']) || 0;
    
    return publicPrice > highCostThreshold || 
           drug['Status'] === 'Controlled Drug' ||
           drug['Status'] === 'Semi-Controlled Drug';
  }

  // Generate insurance approval documentation
  async generateApprovalDoc(drugCode, icd10Code, patientInfo = {}) {
    const approvalInfo = await this.getInsuranceApprovalInfo(drugCode, icd10Code);
    if (!approvalInfo) return null;

    const icd10Details = await this.searchICD10(icd10Code);
    const diagnosis = icd10Details.find(d => d.icd10_code === icd10Code);

    return {
      timestamp: new Date().toISOString(),
      patient: patientInfo,
      medication: {
        drugCode: approvalInfo.drugCode,
        packageName: approvalInfo.packageName,
        genericName: approvalInfo.genericName
      },
      diagnosis: {
        icd10Code,
        description: diagnosis?.indication || 'Diagnosis not found'
      },
      insuranceInfo: approvalInfo.insuranceCoverage,
      costBreakdown: approvalInfo.pricing,
      preAuthRequired: approvalInfo.approvalRequired,
      recommendedAction: this.getRecommendedAction(approvalInfo)
    };
  }

  getRecommendedAction(approvalInfo) {
    if (!approvalInfo.insuranceCoverage.thiqa && !approvalInfo.insuranceCoverage.basic) {
      return 'Not covered by insurance - patient pays full amount';
    }
    
    if (approvalInfo.approvalRequired) {
      return 'Prior authorization required - submit approval request';
    }
    
    return 'Covered by insurance - proceed with dispensing';
  }
}

export default new ICD10DrugService();