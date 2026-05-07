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
 * PURPOSE: Seed WorkFresh with comprehensive mock data for all 14 categories.
 * UPDATE: Added (MOCK) tag to all data entries.
 */

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'tasktalk-professional';

async function buildWorkFreshDatabase() {
  try {
    // Authenticate FIRST
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }

    const getWfCol = (name) => collection(db, 'artifacts', appId, 'public', 'data', name);

    console.log("Seeding WorkFresh Mock Data with (MOCK) tags...");

    // 1. MOCK CLIENTS
    const clients = [
        { id: 'c_01', name: "AeroTech Manufacturing (MOCK)", status: "active", phone: "555-0101", email: "facilities@aerotech.mock" },
        { id: 'c_02', name: "Urban Health Clinic (MOCK)", status: "active", phone: "555-0202", email: "admin@urbanhealth.mock" },
        { id: 'c_03', name: "Skyline Properties (MOCK)", status: "on-hold", phone: "555-0303", email: "pm@skyline.mock" }
    ];

    for (const c of clients) {
        await setDoc(doc(getWfCol('wf_clients'), c.id), {
            wf_clientname: c.name,
            wf_status: c.status,
            wf_phone: c.phone,
            wf_email: c.email,
            createdAt: Timestamp.now()
        });
    }

    // 2. MOCK FACILITIES (SITES)
    const sites = [
        { id: 'f_01', cid: 'c_01', name: "Main Hangar 4 (MOCK)", addr: "442 Skyway Blvd, Seattle" },
        { id: 'f_02', cid: 'c_02', name: "Downtown Branch (MOCK)", addr: "12 Main St, Boston" },
        { id: 'f_03', cid: 'c_01', name: "R&D Lab 1 (MOCK)", addr: "444 Skyway Blvd, Seattle" }
    ];

    for (const s of sites) {
        await setDoc(doc(getWfCol('wf_facilities'), s.id), {
            wf_facilityname: s.name,
            wf_clientid: s.cid,
            wf_address: s.addr,
            wf_squarefootage: 12000,
            createdAt: Timestamp.now()
        });
    }

    // 3. MOCK SCHEDULES
    const schedules = [
        { id: 's_01', fid: 'f_01', type: "Deep Clean (MOCK)", team: "Blue Squad", status: "scheduled" },
        { id: 's_02', fid: 'f_02', type: "Daily Porter (MOCK)", team: "Maintenance A", status: "in-progress" }
    ];

    for (const s of schedules) {
        await setDoc(doc(getWfCol('wf_serviceschedules'), s.id), {
            wf_facilityid: s.fid,
            wf_servicetype: s.type,
            wf_assignedteam: s.team,
            wf_status: s.status,
            wf_scheduleddatetime: Timestamp.now(),
            createdAt: Timestamp.now()
        });
    }

    // 4. MOCK ISSUES
    const issues = [
        { id: 'i_01', fid: 'f_01', title: "Broken Entry Light (MOCK)", desc: "Front entrance exterior light is flickering.", pri: "Medium" },
        { id: 'i_02', fid: 'f_02', title: "Spill in Lobby (MOCK)", desc: "Coffee spill near front desk reported by patient.", pri: "High" }
    ];

    for (const i of issues) {
        await setDoc(doc(getWfCol('wf_issues'), i.id), {
            wf_facilityid: i.fid,
            wf_issuetitle: i.title,
            wf_description: i.desc,
            wf_priority: i.pri,
            wf_status: "open",
            createdAt: Timestamp.now()
        });
    }

    // 5. MOCK MESSAGES
    const messages = [
        { id: 'm_01', cid: 'c_01', text: "Team is arriving at Hangar 4 now. (MOCK)", dir: "outbound" },
        { id: 'm_02', cid: 'c_01', text: "Gate code is 1234. Thanks! (MOCK)", dir: "inbound" }
    ];

    for (const m of messages) {
        await setDoc(doc(getWfCol('wf_messages'), m.id), {
            wf_clientid: m.cid,
            wf_messagetext: m.text,
            wf_direction: m.dir,
            createdAt: Timestamp.now()
        });
    }

    console.log("✅ ALL MOCK DATA PROVISIONED WITH (MOCK) LABELS");

  } catch (error) {
    console.error("❌ BUILD FAILED:", error);
  }
}

buildWorkFreshDatabase();