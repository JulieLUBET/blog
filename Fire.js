import { initializeApp } from 'firebase/app'
import { getFirestore,collection,addDoc,query,orderBy,onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

const firebaseConfig = {
  // Placez ici vos identifiants Firebase (SDK) - Cf. diapos 14 et 15
  apiKey: "AIzaSyCewm960KpNVn7hF0DGVDPOF0z1C1EXBhg",
  authDomain: "blog-a6aa1.firebaseapp.com",
  projectId: "blog-a6aa1",
  storageBucket: "blog-a6aa1.firebasestorage.app",
  messagingSenderId: "798641047416",
  appId: "1:798641047416:web:dd3e5b7ac64ebd57372a8d"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export const getArticles = callback => {
  const q = query(collection(db, 'articles'), orderBy('title', 'asc'))
  onSnapshot(q, snapshot => {
    let articles = []
    snapshot.forEach(doc => {
      articles.push({ id: doc.id, ...doc.data() })
    })
    callback(articles)
  })
}

export { db, addDoc, collection, updateDoc, doc, deleteDoc };  

export const deleteArticle = article => {
  return deleteDoc(doc(db, 'articles', article.id))
}


