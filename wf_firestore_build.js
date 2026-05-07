import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  Timestamp,
  signInAnonymously,
  getAuth,
  signInWithCustomToken
} from 'firebase/firestore';

/**
 * FILENAME: wf_firestore_build.js
 * PURPOSE: Initialize the WorkFresh (TaskTalk Professional) database.
 * This script seeds the initial documents for the 14 core collections
 * defined in the firestore_schema_build.md.
 */

const firebaseConfig = {
  apiKey: "AIzaSyB-n1St2D0c5k66udqtrktzWWgYDtoBjIM",
  authDomain: "tasktalk-professional.firebaseapp.com",
  projectId: "tasktalk-professional",
  storageBucket: "tasktalk-professional.firebasestorage.app",
  messagingSenderId: "1038829850811",
  appId: "1:1038829850811:web:14f1df9220253b2d87999e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "tasktalk-professional";

async function buildWorkFreshDatabase() {
  try {
    // Authenticate FIRST (Requirement for Rule 3)
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }

    const userId = auth.currentUser.uid;
    console.log("Authenticated as:", userId);

    // Helper to enforce Rule 1 (Strict Environment Pathing)
    const getWfCol = (name) => collection(db, 'artifacts', appId, 'public', 'data', name);

    // 1. Seed Client
    const clientRef = doc(getWfCol('wf_clients'), 'client_alpha');
    await setDoc(clientRef, {
      wf_clientname: "Global Logistics Hub",
      wf_status: "active",
      wf_phone: "555-0199",
      wf_email: "ops@globallogistics.com",
      wf_notes: "Priority enterprise account",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // 2. Seed Contact
    const contactRef = doc(getWfCol('wf_contacts'), 'contact_01');
    await setDoc(contactRef, {
      wf_firstname: "Sarah",
      wf_lastname: "Manager",
      wf_fullname: "Sarah Manager",
      wf_email: "s.manager@globallogistics.com",
      wf_phone: "555-0102",
      wf_role: "supervisor",
      wf_clientid: clientRef.id,
      wf_isprimary: true,
      createdAt: Timestamp.now()
    });

    // 3. Seed Facility
    const facilityRef = doc(getWfCol('wf_facilities'), 'fac_01');
    await setDoc(facilityRef, {
      wf_facilityname: "South Warehouse Distro",
      wf_clientid: clientRef.id,
      wf_address: "12300 Logistics Way, Savannah, GA",
      wf_squarefootage: 55000,
      createdAt: Timestamp.now()
    });

    // 4. Seed Message (Using wf_messagetext from MD)
    await setDoc(doc(getWfCol('wf_messages'), 'msg_init'), {
      wf_clientid: clientRef.id,
      wf_facilityid: facilityRef.id,
      wf_contactid: contactRef.id,
      wf_messagetext: "WorkFresh system initialized for this facility.",
      wf_direction: "outbound",
      createdAt: Timestamp.now()
    });

    console.log("✅ DATABASE BUILD COMPLETE");
    console.log("Path:", `/artifacts/${appId}/public/data/`);

  } catch (error) {
    console.error("❌ BUILD FAILED:", error);
  }
}

// Start the build
buildWorkFreshDatabase();