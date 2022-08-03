import "./App.css";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  collectionGroup,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";

function App() {
  const [user, setUser] = useState(sessionStorage.getItem("username"));

  useEffect(() => {
    setUser(sessionStorage.getItem("username"));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {user ? <Chat user={user} /> : <Login />}
      </header>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    sessionStorage.setItem("username", username);

    const userRef = doc(db, "users", username);
    setDoc(userRef, {
      name: username,
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="log-container">
      <form className="border border-secondary rounded p-3">
        <label for="username" class="form-label">
          Choose username
        </label>
        <input
          type="text"
          class="form-control"
          id="username"
          aria-describedby="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          class="btn btn-secondary mt-3"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

function Chat({ user }) {
  const [recepient, setRecepient] = useState("");
  const [recepientName, setRecepientName] = useState("");
  let [userNames, setUserNames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState([user, recepientName].sort().join("-"));

  const ref = collection(db, "chats", chatId, "messages");
  const postQuery = query(ref, orderBy("createdAt", "desc"));

  const [querySnapshot] = useCollection(postQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  const getMessages = async () => {};

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [post, setPost] = useState(null)

  const handleChange = async (e) => {
    setRecepient(e.target.value);
    setChatId([user, e.target.value].sort().join("-"));
    getUsers(e);
  };

  const getUsers = async (e) => {
    const usersRef = collectionGroup(db, "users");
    const text = e.target.value;
    setRecepientName("");

    const end = text.replace(/.$/, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1)
    );
    const usersQuery = query(
      usersRef,
      where("name", ">=", text),
      where("name", "<=", end)
    );
    const usermap = (await getDocs(usersQuery)).docs.map((doc) => doc.data());
    setUserNames(usermap);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const idforchat = subject + Math.floor(Math.random() * 100)
    const userRef = doc(db, "chats", chatId, "messages", idforchat);

    setDoc(userRef, {
      sender: user,
      subject: subject,
      message: message,
      createdAt: serverTimestamp(),
    }).then(() => {
      setSubject("");
      setMessage("");
      console.log("sent");
    });
  };
  const chooseRecepient = (e) => {
    e.preventDefault();
    setChatId([user, e.target.dataset.name].sort().join("-"));
    setRecepientName(e.target.dataset.name);
    setRecepient(e.target.dataset.name);
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-start align-items-center bg-dark main-container">
      <div className="d-flex">
        <h6 className="mt-3 bg-secondary p-2 rounded">Send a message</h6>
      <button
        className="btn btn-danger btn-sm position-fixed"
        onClick={() => {
          sessionStorage.removeItem("username")
          window.location.reload()
        }}
        >
        Log out
      </button>
        </div>
      <form className="col-11 float-center">
        <div>
          <input
            type="text"
            class="form-control"
            id="recepient"
            aria-describedby="recepient"
            value={recepient}
            placeholder="To:"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <ul class="list-group bg-info">
            {!recepientName &&
              userNames &&
              userNames.map((un) => (
                <button
                  className="btn btn-secondary list-group-item"
                  data-name={un.name}
                  onClick={(e) => chooseRecepient(e)}
                >
                  {un.name}
                </button>
              ))}
          </ul>
          <hr />
        </div>
        <div className="">
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="Subject:"
            aria-describedby="title"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <textarea
            id="textarea"
            className="form-control"
            aria-describedby="textare"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          type="submit"
          class="btn btn-secondary mt-1 float-start"
          onClick={(e) => handleSubmit(e)}
        >
          Send
        </button>
      </form>
      <div className="col-11 float-center mt-2 bg-dark border rounded-1">
        {post ? (
          <div className="border-bottom p-2 d-flex bg-light flex-column text-dark justify-content-start align-items-start">              
          <h5 className="border-bottom border-dark" onClick={()=>setPost(post)}>{post.sender}: {post.subject}</h5>
        {
          (post.message) && 
          (<div className="text-div">
          <p className="text-wrap text-break text-start">{post.message}</p>
        </div>)
        }
        <a className="btn btn-secondary btn-sm" onClick={() => setPost(null)}>Back</a>
      </div>
        )
        : posts && recepient
          ? posts.length > 0
            ? posts.map((post, idx) => (
              <div className="border-bottom p-1 d-flex bg-light flex-column text-dark justify-content-start align-items-start">              
                  <h5 className="border-dark" onClick={()=>setPost(post)}>{post.sender}: {post.subject}</h5>
              </div>
            ))
            : "No interactions with this user"
          : "-- No user chosen --"}
      </div>
      
    </div>
  );
}

export default App;
