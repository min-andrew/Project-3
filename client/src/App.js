import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import DogHeader from "./components/Header";
import Footer from "./components/Footer";
import VetNotes from "./pages/VetNotes";
import VetForm from "./pages/VetForm";
import Todo from "./components/Todo/Todo";
import Injury from "./pages/Injury";
import HabitForm from "./pages/HabitForm";
import SingleVetNote from "./pages/SingleVetNote";

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const style = {
    paddingTop: "120px",
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <DogHeader />
          <div style={style}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/vetNotes" element={<VetNotes />} />
              <Route path="/vetForm" element={<VetForm />} />
              <Route path="/vetNotes/:vetNoteId" element={<SingleVetNote />} />
              <Route path="/todo" element={<Todo />} />
              <Route path="/injury" element={<Injury />} />
              <Route path="/habitForm" element={<HabitForm />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
