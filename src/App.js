import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';


firebase.initializeApp({
  apiKey: "AIzaSyAD2dSirMWmP82USswjqzq5NpU5xT7QFZQ",
  authDomain: "firechat-ece98.firebaseapp.com",
  projectId: "firechat-ece98",
  storageBucket: "firechat-ece98.appspot.com",
  messagingSenderId: "265505883717",
  appId: "1:265505883717:web:b23ea418397aaad1a3c52c",
  measurementId: "G-49GF47TT12"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
        FireChat🔥
        <SignOut />
      </header>
      <section>
        {user ? <Chatroom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return (
    <button onClick={signInWithGoogle}>Sign In with google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function Chatroom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter message" />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageStatus = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageStatus}`}>
    <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
