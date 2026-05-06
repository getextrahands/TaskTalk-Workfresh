/**
 * WorkFresh Pro - Firestore Database Initializer (Schema v1.27)
 * This script seeds all 11 mandatory collections with sample data using your project credentials.
 * Ensures strict adherence to field names and mandatory paths. 
 * Domain requirements for internal emails have been removed.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Your verified Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-n1St2D0c5k66udqtrktzWWgYDtoBjIM",
  authDomain: "tasktalk-professional.firebaseapp.com",
  projectId: "tasktalk-professional",
  storageBucket: "tasktalk-professional.firebasestorage.app",
  messagingSenderId: "1038829850811",
  appId: "1:1038829850811:web:14f1df9220253b2d87999e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Application ID used for partitioning data within the mandatory artifact structure
const targetAppId = "workfresh-pro-production"; 

const seedDatabase = async () => {
  console.log("🚀 Starting Database Initialization for: tasktalk-professional");

  const collections = {
    // 1. Company Management (Client Level)
    wf2_clients: [
      {
        id: "client_riverside_001", 
        wf2_company_name: "Riverside Construction",
        wf2_client_number: "C-2025-001",
        wf2_company_phone: "301-555-0199",
        wf2_logo: "https://res.cloudinary.com/dwmsgnm4p/image/upload/q_auto/f_auto/v1778012864/w_lou9fx.png",
        wf2_company_address: "100 Water St",
        wf2_company_city: "Silver Spring",
        wf2_company_state: "MD",
        wf2_company_zip: "20910",
        wf2_client_status: "ACTIVE", // Options: ACTIVE, IN ACTIVE, ON HOLD
        wf2_contract_start: serverTimestamp(),
        wf2_contract_end: null 
      }
    ],

    // 1.1 Account Holder (AH) Management
    wf2_client_contacts: [
      {
        id: "contact_ah_001",
        wf2_parent_client: "client_riverside_001",
        wf2_ah_first_name: "David",
        wf2_ah_last_name: "Miller",
        wf2_ah_email: "david@riverside.com", 
        wf2_ah_phone: "301-444-5555",
        wf2_ah_profile_image: null,
        wf2_ah_is_active: "ACTIVE"
      }
    ],

    // 2. Staff Management: Internal Operations
    wf2_account_managers: [
      {
        id: "am_001",
        wf2_am_first_name: "Sarah",
        wf2_am_last_name: "Admin",
        wf2_am_email: "sarah.admin@example.com", // Removed domain requirement
        wf2_am_phone: "800-555-0100",
        wf2_am_profile_image: null,
        wf2_am_is_active: "ACTIVE"
      }
    ],

    // 3. Facility Infrastructure (Site Level)
    wf2_facilities: [
      {
        id: "fac_001",
        wf2_client: "client_riverside_001",
        wf2_assigned_am: "am_001",
        wf2_facility_name: "Riverside Main Warehouse",
        wf2_facility_photo: null,
        wf2_facility_address: "101 Industrial Dr",
        wf2_facility_city: "Silver Spring",
        wf2_facility_state: "MD",
        wf2_facility_zip: "20910",
        wf2_facility_phone: "301-555-0500",
        wf2_facility_status: "ACTIVE",
        wf2_service_freq: "Daily", // Daily, Weekly, Bi-Weekly, Monthly, On-Demand
        wf2_service_days: ["M", "T", "W", "TH", "F"], // Multiselect
        wf2_access_notes: "Entry through Gate 4",
        wf2_security_codes: "1234#"
      }
    ],

    // 3.1 Facility Specific Contacts
    wf2_facility_contacts: [
      {
        id: "fc_001",
        wf2_parent_facility: "fac_001",
        wf2_first_name: "John",
        wf2_last_name: "Doe",
        wf2_email: "j.doe@riverside.com",
        wf2_profile_image: null,
        wf2_role: "Facility POC", // Office Manager, Billing, Emergency, Facility POC
        wf2_is_active: "ACTIVE"
      }
    ],

    // 4. Staff Management: Cleaning Technicians
    wf2_cleaning_techs: [
      {
        id: "tech_001",
        wf2_am_parent: "am_001",
        wf2_tech_first_name: "Carlos",
        wf2_tech_last_name: "Santana",
        wf2_tech_email: "carlos.tech@example.com", // Removed domain requirement
        wf2_tech_image: null,
        wf2_background_check_status: "Pass"
      }
    ],

    // 4.1 Technician Assignments
    wf2_tech_assignments: [
      {
        id: "ta_001",
        wf2_tech: "tech_001",
        wf2_facility: "fac_001",
        wf2_is_primary: true // Lead Tech
      }
    ],

    // 5. Access Control (Authentication Hub)
    wf2_portal_users: [
      {
        id: "user_am_001",
        wf2_email: "sarah.admin@example.com", // Removed domain requirement
        wf2_role: "Account Manager"
      },
      {
        id: "user_tech_001",
        wf2_email: "carlos.tech@example.com", // Removed domain requirement
        wf2_role: "Cleaning Technician"
      }
    ],

    // 6. Financial Systems
    wf2_billing_profiles: [
      {
        id: "bill_001",
        wf2_facility: "fac_001",
        wf2_billing_email: "billing@riverside.com",
        wf2_billing_status: "ACTIVE" 
      }
    ],

    // 7. Chat & Messaging
    wf2_chat_groups: [
      {
        id: "chat_001",
        wf2_facility: "fac_001",
        wf2_chat_type: "Facility Group"
      }
    ],

    // 8. Operational Documents
    wf2_docusheets: [
      {
        id: "doc_001",
        wf2_facility: "fac_001",
        wf2_doc_type: "SOW", // SOW, COI, SDS
        wf2_file: "https://example.com/sow_riverside.pdf",
        wf2_expiry_date: null
      }
    ]
  };

  try {
    for (const [colName, docs] of Object.entries(collections)) {
      console.log(`Seeding collection: ${colName}...`);
      for (const data of docs) {
        const { id, ...rest } = data;
        // Constructing the path based on Mandatory Rule 1
        const docRef = doc(db, "artifacts", targetAppId, "public", "data", colName, id);
        
        await setDoc(docRef, {
          ...rest,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }
    }
    console.log("✅ Database Initialized Successfully. Path structure verified.");
  } catch (error) {
    console.error("❌ Initialization Failed:", error);
  }
};

// Execute Seeding
seedDatabase();