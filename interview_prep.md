# Video Calling App Interview Preparation

Here is a comprehensive list of potential interview questions and answers based on the application's codebase.

---

## Frontend Follow-up Questions & Answers

### React & React Router

**Q: "You mentioned using React Router. How did you handle passing the meeting URL parameter from the route (`/:url`) into your `VideoMeetComponent`?"**
**A:** Use the `useParams` hook from React Router (`const { url } = useParams();`) to extract the URL parameter inside the component.

**Q: "How would you implement a protected route, for example, making the `/home` and `/history` pages accessible only to logged-in users, using your existing `AuthContext`?"**
**A:** Create a wrapper component that checks for an auth token in the `AuthContext`. If the token exists, it renders the requested component; otherwise, it redirects to the login page using the `useNavigate` hook.

**Q: "What is the difference between a `<Link>` component and a standard `<a>` tag? Why is this distinction critical in a single-page application?"**
**A:** `<Link>` handles client-side routing without a page refresh, making a single-page app feel fast. An `<a>` tag triggers a full page reload from the server.

### State Management (Context API)

**Q: "You chose the Context API for authentication state. What are the potential performance implications of this choice as the application grows? When might you consider a more robust state management library like Redux or Zustand?"**
**A:** Its main drawback is causing any consuming component to re-render when *any* part of the context value changes. For larger apps, libraries like Redux or Zustand offer more optimized re-renders.

**Q: "How do you prevent unnecessary re-renders in components that consume your `AuthContext` when only a part of the context value changes?"**
**A:** You can memoize parts of the context value with `useMemo` or split the context into smaller, more specific contexts so components only subscribe to the state they need.

**Q: "In `VideoMeet.jsx`, you use both `useState` and `useRef`. Could you point to a specific instance in that component where `useRef` was the correct choice over `useState` and explain why?"**
**A:** `socketRef` is a perfect use case for `useRef`. The socket connection needs to persist across renders, but changing it should not trigger a re-render itself, which `useState` would do.

**Q: "I see several `useEffect` hooks in your code. What is the purpose of the dependency array? What would happen if you omitted it entirely?"**
**A:** The array specifies which state or prop changes should trigger the effect to run again. An empty array (`[]`) means it runs only once on mount. Omitting it causes the effect to run after every single render.

**Q: "How would you handle cleanup within a `useEffect` hook? For example, how would you ensure you remove the Socket.IO event listeners when the `VideoMeetComponent` unmounts to prevent memory leaks?"**
**A:** You return a function from within the `useEffect` hook. This function is automatically executed when the component unmounts, and it's where you'd remove event listeners (e.g., `socketRef.current.off(...)`) to prevent memory leaks.

### API Interaction & UI

**Q: "In your `AuthContext`, you're making API calls with Axios. How would you implement an Axios interceptor to automatically attach the user's auth token to the header of every outgoing request after they've logged in?"**
**A:** Use `axios.interceptors.request.use()` to define a function that automatically adds the auth token from `localStorage` to the `Authorization` header of every outgoing request.

**Q: "How would you provide better user feedback for asynchronous operations, like showing a loading spinner while the login request is in progress and displaying a clear error message if it fails?"**
**A:** Use a `loading` state (`useState`). Set it to `true` before the API call and `false` in a `finally` block. Use an `error` state, setting it in the `catch` block, and conditionally render a spinner or error message.

**Q: "You've used Material-UI. How would you go about creating a custom, reusable theme (e.g., changing the primary color and typography) across the entire application?"**
**A:** Use the `createTheme` function to define a theme object with your custom colors and fonts. Then, wrap your entire app in a `<ThemeProvider theme={theme}>` component to apply it globally.

---

## Backend Follow-up Questions & Answers

### Node.js & Express

**Q: "You're using several middleware functions like `cors()` and `express.json()`. Can you explain the order in which middleware is executed in an Express application? Why is this order important?"**
**A:** Middleware runs sequentially in the order it is defined. This is critical; for example, a body parser like `express.json()` must run before a route handler that needs to access `req.body`.

**Q: "How would you write a custom middleware function from scratch? For example, one that logs the request method, URL, and timestamp for every incoming request to the console."**
**A:** It's a function with the signature `(req, res, next)`. You perform an action, like logging, and then call `next()` to pass control to the next function in the stack.

**Q: "Your `app.js` file has a hardcoded MongoDB connection string. What are the security and deployment risks of this approach, and how would you refactor it using environment variables and a `.env` file?"**
**A:** This is a major security risk because secrets are exposed in the code. It also makes deployment inflexible. The correct approach is to use a `.env` file and a library like `dotenv` to load the string into `process.env`.

### Authentication & Security

**Q: "Your authentication system uses a randomly generated token stored in the database. What are the pros and cons of this stateful approach compared to a stateless one using JSON Web Tokens (JWTs)?"**
**A:** Your stateful token is simpler but scales poorly, as multiple servers would need a shared token store. Stateless JWTs are better for scalability because any server can validate them, but they are more difficult to revoke instantly.

**Q: "Currently, your `/get_all_activity` route is open. How would you implement a middleware to protect this route so that only users with a valid token can access it?"**
**A:** Create a middleware that checks for a valid token in the request. If the token is valid, it calls `next()`. If not, it sends a `401 Unauthorized` error. Apply this middleware before the controller function in your route definition.

**Q: "You're using `bcrypt` for password hashing. What is 'salting,' and why is it a critical part of the hashing process? Does `bcrypt` handle this for you automatically?"**
**A:** A salt is a random string added to a password before hashing. It ensures that identical passwords result in unique hashes. `bcrypt` automatically handles the generation and inclusion of a salt.

**Q: "Beyond password hashing, what other common security vulnerabilities should a developer be aware of in a Node.js application (e.g., SQL injection, XSS, CSRF)?"**
**A:** Key vulnerabilities include **XSS** (Cross-Site Scripting), which is prevented by sanitizing user input, and **CSRF** (Cross-Site Request Forgery), prevented by using CSRF tokens.

### Database (MongoDB & Mongoose)

**Q: "In your `user.controller.js`, you have several `async/await` functions. How would you implement proper error handling using `try...catch` blocks to ensure the server doesn't crash on a database error?"**
**A:** Wrap asynchronous database operations in a `try...catch` block. The `catch` block should handle any errors, log them, and send a generic `500 Internal Server Error` response to the client.

**Q: "What is the difference between `_id` in MongoDB and the `id` you might see in a SQL database?"**
**A:** In MongoDB, `_id` is the default primary key, automatically generated as a complex `ObjectId`. In SQL, `id` is typically a simple auto-incrementing integer.

**Q: "How could you optimize your database queries? For example, what is an index in MongoDB, and on which field in your `users` collection might you add one?"**
**A:** An index speeds up queries. You should add an index to the `username` field in the `users` collection, as it's frequently used in `findOne` queries during login.

---

## WebRTC & Socket.IO Follow-up Questions & Answers

### Signaling

**Q: "You've correctly identified that your server is a signaling server. Could you walk me through the exact sequence of Socket.IO events that are exchanged between two clients from the moment the second user joins the call to the moment their video streams appear?"**
**A:** 1. New user joins, server tells existing users. 2. Existing user sends an "offer" to the new user. 3. New user receives the offer and sends back an "answer." 4. Both users then exchange network candidates until a direct connection is formed.

**Q: "What is the 'trickle ICE' technique, and does your implementation use it? What are the benefits of this approach?"**
**A:** It's the technique of sending network (ICE) candidates as they are discovered, rather than waiting for all of them. Your implementation uses this, which is the standard practice to speed up connection time.

**Q: "What would happen if the signaling server went down in the middle of a call? Would the existing video streams continue to work? Why or why not?"**
**A:** Established peer-to-peer calls will continue to work because the media flows directly between users. However, no new users can join, and no new connections can be established.

### NAT Traversal & Connectivity

**Q: "You're using a STUN server. In what specific network scenarios would a STUN server fail to establish a connection? How does a TURN server solve this problem?"**
**A:** STUN fails with certain types of firewalls (Symmetric NATs). A **TURN** server solves this by acting as a relay, forwarding the media when a direct connection isn't possible.

**Q: "What is the 'ICE gathering' process? What happens if no suitable ICE candidates can be found for a peer?"**
**A:** It's the process of collecting all possible network addresses for a device (local, public via STUN, etc.). If no compatible candidates can be found between peers, the connection will fail.

**Q: "How would you debug a WebRTC connection issue where one user can't see or hear another? What browser tools would you use?"**
**A:** Use the browser's built-in tools, specifically `chrome://webrtc-internals` (in Chrome) or `about:webrtc` (in Firefox), to see detailed logs of the connection process.

### Topology & Scalability

**Q: "You've correctly identified your current architecture as a mesh topology. What are the primary limitations of this model? At what number of participants would you expect to see performance degradation?"**
**A:** It scales poorly. Each user must send their video stream to every other user, which quickly consumes CPU and bandwidth. It becomes unreliable with more than 4-6 participants.

**Q: "You mentioned an SFU (Selective Forwarding Unit) as a potential improvement. How does an SFU work, and how does it solve the scalability problems of a mesh network?"**
**A:** An SFU (Selective Forwarding Unit) is a server that receives each participant's stream once and forwards it to the other participants. This means each client only needs one upload connection, allowing for much larger calls.

**Q: "What are the key differences between an SFU and an MCU (Multipoint Control Unit)?"**
**A:** An SFU forwards streams, while an MCU (Multipoint Control Unit) decodes all streams and re-encodes them into a single composite video, which is more CPU-intensive for the server.

### Security

**Q: "You mentioned DTLS-SRTP for media encryption. Is this something you had to implement manually, or is it a built-in feature of WebRTC?"**
**A:** This is a mandatory and built-in part of the WebRTC standard. The browser handles all media encryption automatically; no manual implementation is needed.

**Q: "How would you prevent an unauthorized user from joining a video call? What changes would you need to make to your signaling logic to implement a 'lobby' or a password-protected room?"**
**A:** You would secure the `join-call` event on your signaling server. The server would validate an auth token or password sent with the event before allowing the user to join the room.
