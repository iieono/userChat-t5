import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCdaltn97ScKOMqr-ns4SkcKhycQmlLjVw",
    authDomain: "user-chat-t5.firebaseapp.com",
    databaseURL: "https://user-chat-t5-default-rtdb.firebaseio.com",
    projectId: "user-chat-t5",
    storageBucket: "user-chat-t5.appspot.com",
    messagingSenderId: "441836975030",
    appId: "1:441836975030:web:f602df46d57a64b1bf8717"
  };
  


const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const storage = getStorage(firebaseApp);
