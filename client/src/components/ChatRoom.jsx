// import React, { useEffect, useState, useRef } from "react";
// // importing stompjs and sockjs for the websocket messaging in the frontend
// import { over } from "stompjs";
// import SockJS from "sockjs-client";
// import { getToken, getUserInfo } from "../services/AuthService.js";
// import "../styles/ChatRoom.css";
//
// const ChatRoom = () => {
//
//
//
//     // state
//     const [privateChats, setPrivateChats] = useState(new Map());
//     const [tab, setTab] = useState(null);
//     const [userData, setUserData] = useState({
//         username: "",
//         connected: false,
//         message: "",
//     });
//     const chatContentRef = useRef(null);
//     const messagesEndRef = useRef(null);
//     const [users, setUsers] = useState([]);
//     const [userPage, setUserPage] = useState(0);
//     const [hasMoreUsers, setHasMoreUsers] = useState(true);
//     const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
//     const stompClientRef = useRef(null);
//
//     useEffect(() => {
//
//         // automatically fetch user information and connect
//         getUserDetails();
//
//         // cleanup function to disconnect from websocket
//         return () => {
//             if (stompClientRef.current) {
//                 stompClientRef.current.disconnect(() => {
//                     console.log("Disconnected from WebSocket");
//                 });
//             }
//         };
//     }, []);
//
//     // retrieve user info, initialize websocket, and fetch list of users
//     const getUserDetails = async () => {
//         try {
//
//             // fetch user details
//             const user = await getUserInfo();
//
//             // if user exists
//             if (user) {
//
//                 // keep data from previous state
//                 setUserData((prevState) => ({
//                     ...prevState,
//                     // set username in state
//                     username: user.username,
//                 }));
//
//
//                 // establish websocket connection
//                 connect(user.username);
//
//
//                 // get all users for sidebar
//                 await fetchUsers();
//             }
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//             alert("Failed to retrieve user details. Please try again.");
//         }
//     };
//
//
//
//
//     // fetch users with their unread message counts from the backend
//     const fetchUsers = async (isLoadMore = false) => {
//         try {
//
//             // make an api call to fetch users with unread messages
//             const response = await fetch(`http://localhost:8080/api/users/unread?page=${userPage}&size=20`, {
//                 // include this header so the backend can authenticate jwt token
//                 headers: { Authorization: `Bearer ${getToken()}` },
//             });
//
//             // parse the json response
//             const usersData = await response.json();
//
//             // if no users are returned the update state and return
//             if (usersData.length === 0) {
//                 setHasMoreUsers(false);
//                 return;
//             }
//
//
//             // if isLoadMore is truen then append existing users with new users or replace with new data
//             let updatedUsers = isLoadMore ? [...users, ...usersData] : [...usersData];
//
//
//             // update user state with fetched/appended data
//             setUsers(updatedUsers);
//         } catch (error) {
//             console.error("Error fetching users with unread counts:", error);
//             alert("Failed to load users. Please try again.");
//         }
//     };
//
//
//     // established websocket connection using sockjs and authenticates JWT token through URL
//     const connect = (username) => {
//
//         // get jwt token
//         const token = getToken();
//
//         // create sockjs connection with token as a query parameter
//         const Sock = new SockJS(`http://localhost:8080/ws?token=${token}`);
//
//         // create a stomp client over the sockjs connection
//         const stomp = over(Sock);
//
//         // store stomp client in a ref so that the connection is maintained
//         stompClientRef.current = stomp;
//
//         stomp.connect(
//             {},
//             // callback function for successful connection (which is right below this method)
//             () => onConnected(username),
//             onError
//         );
//     };
//
//     // callback function when websocket connection is successful
//     const onConnected = (username) => {
//
//         // update state to show connection is established
//         setUserData((prevState) => ({ ...prevState, connected: true }));
//
//         // subscribe to private channel specific to that user
//         stompClientRef.current.subscribe(`/user/${username}/private`, onPrivateMessage);
//         console.log(`Subscribed to /user/${username}/private`);
//
//     };
//
//
//
//     // handles recieving private messages via websocket
//     const onPrivateMessage = async (payload) => {
//
//         // parse incoming messages in payload variable
//         const payloadData = JSON.parse(payload.body);
//
//
//         // determine the other user involved in the chat
//         const otherUser =
//             payloadData.senderName === userData.username
//                 ? payloadData.receiverName
//                 : payloadData.senderName;
//
//         // update private chat state with new message
//         setPrivateChats((prevChats) => {
//
//             // create copy of existing chats
//             const updatedChats = new Map(prevChats);
//
//             // if there is no existing chat with the other user then update with empty array
//             if (!updatedChats.has(otherUser)) {
//                 updatedChats.set(otherUser, []);
//             }
//
//             // append new message to existing chat and return the updated chat box
//             updatedChats.set(otherUser, [...updatedChats.get(otherUser), payloadData]);
//             return updatedChats;
//         });
//
//
//         // Update the user list based on the sender
//
//         // uf message is from a different user
//         if (payloadData.senderName !== userData.username) {
//
//             // set state
//             setUsers((prevUsers) => {
//
//                 // iterate through user list
//                 return prevUsers.map((user) => {
//                     // if the users username is equal to the other user
//                     if (user.username === otherUser) {
//                         return {
//                             ...user,
//                             // increment message count
//                             unreadCount: user.unreadCount + 1,
//                             // update timestamp
//                             lastMessageTime: payloadData.timestamp,
//                         };
//                     }
//                     return user;
//
//                     // sort the users by time of last message
//                 }).sort((a, b) => {
//                     if (a.lastMessageTime && b.lastMessageTime) {
//
//                         // new messages first
//                         return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
//                     } else if (a.lastMessageTime) {
//                         // users with messages come first
//                         return -1;
//                     } else if (b.lastMessageTime) {
//                         return 1;
//                     }
//                     // otherwise maintain the order
//                     return 0;
//                 });
//             });
//         }
//
//         // scroll to the bottom of the conversation after receiving a new private messagef
//         setTimeout(() => {
//             scrollToBottom();
//         }, 100);
//     };
//
//
//     // handles websocket errors
//     const onError = (err) => {
//         console.error("Error connecting to WebSocket:", err);
//         alert("Failed to connect to the chat server. Please try again.");
//     };
//
//     // handle message input changes
//     const handleMessage = (event) => {
//
//         // get input value and update the userdata state
//         const { value } = event.target;
//         setUserData((prevState) => ({ ...prevState, message: value }));
//     };
//
//
//
//     // Send a private message and update the chat
//     const sendMessage = async () => {
//
//         // check if connceted and message isnt empty and there is a tab selected
//         if (stompClientRef.current && userData.message.trim() !== "" && tab) {
//
//             // object holding values of message to send to backend and be stored in database
//             const chatMessage = {
//                 senderName: userData.username,
//                 receiverName: tab,
//                 message: userData.message.trim(),
//                 status: "MESSAGE",
//                 timestamp: new Date().toISOString(),
//             };
//
//             // send the message through WebSocket
//             const endpoint = "/app/private-message";
//             stompClientRef.current.send(endpoint, {}, JSON.stringify(chatMessage));
//
//
//             // clear message input field
//             setUserData((prevState) => ({ ...prevState, message: "" }));
//
//
//             // update private chats with new message
//             setPrivateChats((prevChats) => {
//
//                 // create copy of existing chats
//                 const updatedChats = new Map(prevChats);
//
//                 // if no chat with empty user then empty array
//                 if (!updatedChats.has(tab)) {
//                     updatedChats.set(tab, []);
//                 }
//
//                 // otherwise append the new message to the chat using spreadoperator to get previous chats
//                 updatedChats.set(tab, [...updatedChats.get(tab), chatMessage]);
//                 return updatedChats;
//             });
//
//
//             /*
//                 The following code is same as onPrivateMessage fucntion
//              */
//
//             setUsers((prevUsers) => {
//
//                 return prevUsers.map((user) => {
//                     if (user.username === tab) {
//                         return {
//                             ...user,
//                             lastMessageTime: chatMessage.timestamp,
//                         };
//                     }
//                     return user;
//                 }).sort((a, b) => {
//                     if (a.lastMessageTime && b.lastMessageTime) {
//                         return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
//                     } else if (a.lastMessageTime) {
//                         return -1;
//                     } else if (b.lastMessageTime) {
//                         return 1;
//                     }
//                     return 0;
//                 });
//             });
//
//             // scroll to bottom after sending a message
//             scrollToBottom();
//         }
//     };
//
//
//     // function to handle changing the active chat tab
//     const handleTabChange = async (selectedTab) => {
//
//         // update current tab state
//         setTab(selectedTab);
//
//         // if there is no existing chat then initalize emprty array
//         if (!privateChats.has(selectedTab)) {
//             setPrivateChats((prevChats) => {
//                 const newChats = new Map(prevChats);
//                 newChats.set(selectedTab, []);
//                 return newChats;
//             });
//
//             // Fetch conversation history (which marks messages as read)
//             await fetchConversationHistory(selectedTab, 1);
//         }
//
//         // refresh user list without loading more
//         await fetchUsers(false);
//
//         // reset unreadCount for the selected user
//         setUsers((prevUsers) =>
//             prevUsers.map((user) =>
//                 user.username === selectedTab ? { ...user, unreadCount: 0 } : user
//             )
//         );
//     };
//
//
//     // fetch conversation history with a user
//     const fetchConversationHistory = async (otherUser, limit = 0) => {
//         try {
//             let url = `http://localhost:8080/api/conversation/${otherUser}`;
//             if (limit > 0) {
//                 url += `?limit=${limit}`;
//             }
//
//             // make api call to fetch conversation history
//             const response = await fetch(url, {
//                 // include jwt auth
//                 headers: { Authorization: `Bearer ${getToken()}` },
//             });
//
//             // parse json response
//             const data = await response.json();
//
//             // update private chats state with the fetched conversatino data
//             setPrivateChats((prevChats) => {
//                 const newChats = new Map(prevChats);
//                 newChats.set(otherUser, data);
//                 return newChats;
//             });
//
//             // scroll to the bottom of the conversation after loading
//             setTimeout(() => {
//                 scrollToBottom();
//             }, 100);
//
//             return data;
//         } catch (error) {
//             console.error(`Error fetching conversation with ${otherUser}:`, error);
//             return [];
//         }
//     };
//
//
//
//     // search function for users in database
//     const handleSearch = (query) => {
//         const lowerCaseQuery = query.toLowerCase();
//         // Fflter users based on search query
//         const filtered = users.filter((user) =>
//             user.username.toLowerCase().includes(lowerCaseQuery)
//         );
//         // update users state
//         setUsers(filtered);
//     };
//
//     // handle user list scroll for infinite loading
//     const handleUserListScroll = (e) => {
//         const { scrollTop, scrollHeight, clientHeight } = e.target;
//
//         // check if we are at the bottom of the scroll and if there are more users to fetch
//         if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreUsers) {
//             // increment the page number
//             setUserPage((prevPage) => prevPage + 1);
//             // stop fetching more users
//             fetchUsers(false);
//         }
//     };
//
//     // Handle scrolling functionality for chat messages
//     const handleScroll = async (e) => {
//         const { scrollTop } = e.target;
//
//         if (scrollTop <= 0 && !loadingMoreMessages) {
//             setLoadingMoreMessages(true);
//             setLoadingMoreMessages(false);
//         }
//     };
//
//     // scroll to bottom of messages
//     const scrollToBottom = () => {
//
//         // check if reference to end of message exists
//         if (messagesEndRef.current) {
//             // smooth scroll to bottom
//             messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//         } else {
//             console.log("messagesEndRef.current is null");
//         }
//     };
//
//     return (
//         <div className="container">
//             {userData.connected ? (
//                 <div className="chat-box">
//                     <div className="member-list">
//                         {/* Search Box */}
//                         <input
//                             type="text"
//                             placeholder="Search users..."
//                             className="search-box"
//                             onChange={(e) => handleSearch(e.target.value)}
//                         />
//                         <div
//                             className="user-list"
//                             onScroll={handleUserListScroll}
//                             style={{ maxHeight: "400px", overflowY: "auto" }}
//                         >
//                             <ul>
//                                 {users.map((user) => (
//                                     <li
//                                         key={user.username}
//                                         onClick={() => handleTabChange(user.username)}
//                                         className={`member ${tab === user.username ? "active" : ""} ${
//                                             user.unreadCount > 0 ? "unread" : ""
//                                         }`}
//                                     >
//                                         {user.username}
//                                         {user.unreadCount > 0 && <span className="badge">{user.unreadCount}</span>}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                     <div
//                         className="chat-content"
//                         onScroll={handleScroll}
//                         ref={chatContentRef}
//                     >
//                         <ul className="chat-messages">
//                             {tab &&
//                                 (privateChats.get(tab) || []).map((chat) => (
//                                     <li
//                                         key={chat.id}
//                                         className={`message ${chat.senderName === userData.username ? "self" : ""}`}
//                                     >
//                                         {chat.senderName !== userData.username && (
//                                             <div className="avatar">{chat.senderName}</div>
//                                         )}
//                                         <div className="message-data">{chat.message}</div>
//                                         {chat.senderName === userData.username && (
//                                             <div className="avatar self">{chat.senderName}</div>
//                                         )}
//                                     </li>
//                                 ))}
//                             <div ref={messagesEndRef} />
//                         </ul>
//
//                         {/* loading indicator for fetching more messages */}
//                         {loadingMoreMessages && (
//                             <div className="loading-more-messages">
//                                 Loading more messages...
//                             </div>
//                         )}
//                         <div className="send-message">
//                             <input
//                                 type="text"
//                                 className="input-message"
//                                 placeholder="Enter the message"
//                                 value={userData.message}
//                                 onChange={handleMessage}
//                                 onKeyPress={(event) => {
//                                     if (event.key === "Enter") {
//                                         sendMessage();
//                                     }
//                                 }}
//                             />
//                             <button
//                                 type="button"
//                                 className="send-button"
//                                 onClick={sendMessage}
//                             >
//                                 Send
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <div>Loading...</div>
//             )}
//         </div>
//     );
//
// };
//
// export default ChatRoom;
