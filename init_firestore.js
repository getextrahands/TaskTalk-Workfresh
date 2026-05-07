/**
 * WorkFresh Pro Business OS - Master Seeding Engine (v1.27)
 * Architecture: Separated Relational Collections
 * Logic: Relational Anchor System (v1.0)
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || '{}');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = "workfresh-pro-production"; 

const masterData = {
  wf2_clients: [
    {
      id: "CLI_RIVERSIDE_001",
      wf2_company_name: "Riverside Construction",
      wf2_client_number: "C-2025-001",
      wf2_client_status: "ACTIVE",
      wf2_logo: "https://res.cloudinary.com/dwmsgnm4p/image/upload/q_auto/f_auto/v1778012864/w_lou9fx.png",
      wf2_term_type: "NET 30"
    }
  ],
  wf2_facilities: [
    {
      id: "FAC_OKL_101",
      wf2_client: "CLI_RIVERSIDE_001",
      wf2_facility_name: "Oakland Site Yard",
      wf2_site_code: "OKL-101",
      wf2_facility_address: "888 Harbor Way, Oakland, CA",
      wf2_facility_status: "ACTIVE"
    }
  ],
  wf2_client_contacts: [
    {
      id: "CON_DAVID_MILLER_001",
      wf2_parent_client: "CLI_RIVERSIDE_001",
      wf2_ah_first_name: "David",
      wf2_ah_last_name: "Miller",
      wf2_ah_role: "PRIMARY"
    }
  ],
  wf2_portal_users: [
    {
      id: "USER_SARAH_001",
      wf2_email: "sarah.ops@workfresh.pro",
      wf2_role: "Account Manager",
      wf2_linked_id: "AM_SARAH_001"
    }
  ]
};

async function seed() {
  console.log("🚀 Initializing Relational Totality...");
  for (const [col, docs] of Object.entries(masterData)) {
    for (const data of docs) {
      const { id, ...rest } = data;
      const docRef = doc(db, "artifacts", appId, "public", "data", col, id);
      await setDoc(docRef, { ...rest, created_at: serverTimestamp(), updated_at: serverTimestamp() });
      console.log(`✅ Seeded: ${col}/${id}`);
    }
  }
}

seed().catch(console.error);