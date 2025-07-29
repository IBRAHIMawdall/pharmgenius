# Drug Tool Lookup

A comprehensive drug information and Daman insurance coverage lookup tool for UAE healthcare professionals.

## Features

- **Drug Search**: Search for medications by name, generic name, or category
- **Daman Insurance Coverage**: Check coverage for Thiqa, Basic, and Enhanced plans
- **Detailed Drug Information**: View indications, side effects, contraindications, and more
- **ICD-10 Integration**: See related ICD-10 codes for medications
- **Modern UI**: Clean, responsive interface built with React and Chakra UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
node server.js
```

3. Access the application at `http://localhost:5000`

## Project Structure

```
drug-tool-lookup/
├── src/                  # React application source code
│   ├── components/       # UI components
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── theme.js          # Chakra UI theme configuration
├── database/             # Mock database files
│   └── daman_formulary.json  # Daman insurance formulary data
├── public/               # Static assets
├── server.js             # Express server for API and serving the frontend
├── vite.config.js        # Vite configuration
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Usage

1. **Search for Medications**:
   - Use the search bar on the homepage or search page
   - Filter by category if needed

2. **View Drug Details**:
   - Click on a drug from the search results
   - Navigate through tabs to see different information

3. **Check Daman Insurance Coverage**:
   - Coverage information is displayed on the drug details page
   - Click "View Coverage Details" for more information

## Integration with Microservices

This application is designed to integrate with the existing microservices architecture:

- **API Gateway**: Routes requests to appropriate services
- **Drug Service**: Provides medication information
- **ICD-10 Service**: Supplies disease classification codes
- **Daman Service**: Provides insurance coverage information

## License

This project is designed for medical environment use.

---

**Note**: This application is intended for healthcare professionals in the UAE.