# PharmGenius

PharmGenius is an AI-powered pharmaceutical tool designed to help pharmacists and healthcare professionals with drug lookups, insurance coding, and medication safety information.

## Features

- **Daman Insurance Coverage Lookup**: Check if medications are covered under Thiqa, Basic, or Enhanced plans
- **ICD-10 Code Finder**: Find appropriate ICD-10 codes for insurance approvals
- **Drug Interaction Checker**: Check for potential interactions between medications
- **Pregnancy Safety Categories**: View FDA pregnancy categories and recommendations
- **Modern UI**: Clean, responsive interface with light/dark mode

## Tech Stack

- **Frontend**: React with Vite
- **UI Library**: Chakra UI
- **API**: Vercel Serverless Functions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pharmgenius.git
cd pharmgenius
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Deployment

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

## API Endpoints

- `/api/daman-formulary`: Get Daman insurance coverage information
- `/api/icd10`: Get ICD-10 codes for medications
- `/api/drug-interactions`: Check for drug interactions
- `/api/pregnancy-categories`: Get pregnancy safety information

## License

This project is designed for medical environment use at Burjeel Hospital, Abu Dhabi.

## Acknowledgements

Developed by a hospital pharmacist at Burjeel Hospital, Abu Dhabi.