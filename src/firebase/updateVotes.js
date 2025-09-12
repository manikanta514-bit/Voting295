// updateVotes.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-XiR10sbZllwtcXMtNZaWAcwbGsQwHxY",
  authDomain: "voting-system-b850f.firebaseapp.com",
  projectId: "voting-system-b850f",
  storageBucket: "voting-system-b850f.firebasestorage.app",
  messagingSenderId: "648503136744",
  appId: "1:648503136744:web:4411745b49d00f9b45145d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addVotesField() {
  const candidatesRef = collection(db, "candidates");
  const snapshot = await getDocs(candidatesRef);

  snapshot.forEach(async (candidateDoc) => {
    const data = candidateDoc.data();
    if (!data.hasOwnProperty("votes")) {
      await updateDoc(doc(db, "candidates", candidateDoc.id), {
        votes: 0,
      });
      console.log(`Updated candidate ${data.name} with votes: 0`);
    }
  });

  console.log("✅ All missing votes fields updated!");
}

addVotesField().catch((error) => console.error("Error updating votes:", error));
