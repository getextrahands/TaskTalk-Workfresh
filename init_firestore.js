/**
 * WorkFresh Pro - Firestore Database Initializer (Schema v1.27 + Comm Logs)
 * This script seeds all 11 mandatory collections PLUS Communication logs.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
const targetAppId = "workfresh-pro-production"; 

const seedDatabase = async () => {
  console.log("🚀 Initializing Full System Database...");

  const collections = {
    // --- CORE MANAGEMENT ---
    wf2_clients: [
      {
        id: "client_riverside_001", 
        wf2_company_name: "Riverside Construction",
        wf2_client_number: "C-2025-001",
        wf2_client_status: "ACTIVE",
        wf2_contract_start: serverTimestamp(),
      }
    ],
    wf2_client_contacts: [
      {
        id: "contact_ah_001",
        wf2_parent_client: "client_riverside_001",
        wf2_ah_first_name: "David",
        wf2_ah_last_name: "Miller",
        wf2_ah_email: "david@riverside.com", 
        wf2_ah_is_active: "ACTIVE"
      }
    ],
    wf2_account_managers: [
      { id: "am_001", wf2_am_first_name: "Sarah", wf2_am_last_name: "Admin", wf2_am_email: "s.admin@example.com", wf2_am_is_active: "ACTIVE" }
    ],

    // --- INFRASTRUCTURE ---
    wf2_facilities: [
      {
        id: "fac_001",
        wf2_client: "client_riverside_001",
        wf2_assigned_am: "am_001",
        wf2_facility_name: "Riverside Main Warehouse",
        wf2_facility_status: "ACTIVE",
        wf2_service_freq: "Daily",
        wf2_service_days: ["M", "T", "W", "TH", "F"]
      }
    ],

    // --- COMMUNICATION LOGS (NEW SECTION) ---
    wf2_call_logs: [
      {
        id: "call_log_001",
        wf2_facility: "fac_001",
        wf2_direction: "Inbound",
        wf2_from: "+13015550123",
        wf2_to: "+13014506478",
        wf2_duration_sec: 145,
        wf2_status: "Completed"
      }
    ],
    wf2_sms_messages: [
      {
        id: "sms_001",
        wf2_facility: "fac_001",
        wf2_sender: "+13015550123",
        wf2_text: "Checking on the warehouse cleaning status.",
        wf2_direction: "Inbound"
      }
    ],
    wf2_voicemails: [
      {
        id: "vm_001",
        wf2_facility: "fac_001",
        wf2_from: "+13015550123",
        wf2_audio_url: "https://example.com/audio/vm_001.mp3",
        wf2_transcription: "Hi, please call me back regarding the gate code.",
        wf2_is_read: false
      }
    ],
    wf2_chat_history: [
      {
        id: "chat_msg_001",
        wf2_chat_group: "chat_001",
        wf2_sender_id: "am_001",
        wf2_text: "Tech Carlos has arrived at the Riverside location.",
        wf2_type: "Text"
      }
    ],

    // --- REMAINING TABLES ---
    wf2_cleaning_techs: [
      { id: "tech_001", wf2_am_parent: "am_001", wf2_tech_first_name: "Carlos", wf2_tech_email: "carlos.tech@example.com" }
    ],
    wf2_tech_assignments: [
      { id: "ta_001", wf2_tech: "tech_001", wf2_facility: "fac_001", wf2_is_primary: true }
    ],
    wf2_portal_users: [
      { id: "user_am_001", wf2_email: "s.admin@example.com", wf2_role: "Account Manager" }
    ],
    wf2_billing_profiles: [
      { id: "bill_001", wf2_facility: "fac_001", wf2_billing_status: "ACTIVE" }
    ],
    wf2_chat_groups: [
      { id: "chat_001", wf2_facility: "fac_001", wf2_chat_type: "Facility Group" }
    ],
    wf2_docusheets: [
      { id: "doc_001", wf2_facility: "fac_001", wf2_doc_type: "SOW", wf2_file: "https://example.com/sow.pdf" }
    ]
  };

  try {
    for (const [colName, docs] of Object.entries(collections)) {
      console.log(`Seeding: ${colName}...`);
      for (const data of docs) {
        const { id, ...rest } = data;
        const docRef = doc(db, "artifacts", targetAppId, "public", "data", colName, id);
        await setDoc(docRef, { ...rest, created_at: serverTimestamp(), updated_at: serverTimestamp() });
      }
    }
    console.log("✅ Database Initialized with Comm Logs.");
  } catch (error) {
    console.error("❌ Failed:", error);
  }
};

seedDatabase();