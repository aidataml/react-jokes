import React, {useState, useEffect} from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getJokes = async () => {
    let j = [];
    let seenJokes = new Set();
    try {
      while (j.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("This is a duplicate.");
        }
      }
      setJokes(j);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (jokes.length === 0) getJokes();
  }, [numJokesToGet, getJokes]); 

  function generateNewJokes() {
    setIsLoading(true);
    getJokes();
  }

  function resetVotes() {
    const resetJokes = jokes.map(joke => ({ ...joke, votes: 0 }));
    setJokes(resetJokes);
    localStorage.setItem("jokes", JSON.stringify(resetJokes));
  }

  function vote(id, delta) {
    setJokes(allJokes =>
      allJokes.map(joke => (joke.id === id ? { ...joke, votes: joke.votes + delta } : joke))
    );
  }

  if (isLoading) {
    return (
      <div className="loading"><i className="fas fa-4x fa-spinner fa-spin" /></div>
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="btn btn-info" onClick={generateNewJokes}>Get New Jokes</button>
      <br></br>
      <br></br>
      <button className="btn btn-info" onClick={resetVotes}>Reset Vote Count</button>
      <br></br>
      <br></br>
      {sortedJokes.map(({joke, id, votes}) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;