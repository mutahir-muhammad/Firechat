/* The code is importing necessary modules and dependencies for the application. */
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'

/* These lines of code are importing specific hooks and functions from the `react-firebase-hooks`
library and the `react` library. */
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';


/* The `firebase.initializeApp()` function is initializing the Firebase app with the provided
configuration object. This configuration object contains the necessary credentials and settings to
connect the app to the Firebase project. It includes the API key, authentication domain, project ID,
storage bucket, messaging sender ID, app ID, and measurement ID. This function needs to be called
before using any Firebase services in the application. */

firebase.initializeApp({
  apiKey: "AIzaSyAD2dSirMWmP82USswjqzq5NpU5xT7QFZQ",
  authDomain: "firechat-ece98.firebaseapp.com",
  projectId: "firechat-ece98",
  storageBucket: "firechat-ece98.appspot.com",
  messagingSenderId: "265505883717",
  appId: "1:265505883717:web:b23ea418397aaad1a3c52c",
  measurementId: "G-49GF47TT12"
})

/* `const auth = firebase.auth();` is creating a constant variable `auth` that references the
authentication service provided by Firebase. This allows the application to authenticate users and
manage user sessions. */

const auth = firebase.auth();
const firestore = firebase.firestore();

/**
 * The App function returns a component that displays a chatroom if the user is authenticated,
 * otherwise it displays a sign-in component.
 * @returns The App component is returning a JSX element.
 */

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
/**
 * The code defines two functions, SignIn and SignOut, for signing in and signing out using Google
 * authentication.
 * @returns The SignIn function is returning a button with the text "Sign In with google" that, when
 * clicked, calls the signInWithGoogle function.
 */

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
/**
 * The Chatroom function is a component that allows users to send and receive messages in a
 * chatroom-like interface.
 * @returns The Chatroom component is returning JSX elements. It includes a main element that displays
 * the messages by mapping over the messages array and rendering a ChatMessage component for each
 * message. It also includes a span element with a ref to dummy, which is used to scroll to the bottom
 * of the chat.
 */

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

/**
 * The ChatMessage function renders a message component with different styles based on whether the
 * message was sent or received, and displays the message text and user's photo.
 * @param props - The `props` parameter in the `ChatMessage` function is an object that contains the
 * properties passed to the component. These properties can be accessed using dot notation, such as
 * `props.message`, `props.message.text`, `props.message.uid`, and `props.message.photoURL`.
 * @returns The ChatMessage component is returning a div element with the class name "message" and an
 * additional class name based on the messageStatus variable. Inside the div, there is an image element
 * with the source set to the photoURL prop or a default avatar image if photoURL is not provided.
 * There is also a paragraph element containing the text prop.
 */
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageStatus = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageStatus}`}>
    <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='dp' />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
