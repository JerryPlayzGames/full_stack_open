import React, { useState } from 'react'

const AnecdoteDisplay = ({ anecdote, votes }) => (
  <div>
    <p>{anecdote}</p>
    <p>has {votes} votes</p>
  </div>
)

const AnecdoteButtons = ({ onVote, onNext }) => (
  <div>
    <button onClick={onVote}>Vote</button>
    <button onClieck={onNext}>Next anecdote</button>
  </div>
)

const MostVotedAnecdote = ({ anecdote }) => (
  <div>
    <h1>The most voted anecdote</h1>
    <p>{anecdote}</p>
  </div>
)


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length));

  const getRandomAnecdote = () => {
    const rng = Math.floor(Math.random() * anecdotes.length);
    setSelected(rng)
  }

  const voteAnecdote = () => {
    const newVotes = new Uint8Array(votes);
    newVotes[selected] += 1;
    setVotes(newVotes)
  }

  const getMostVotedAnecdote = () => {
    const highestVotes = Math.max(...votes);
    const mostVotedIndex = votes.indexOf(highestVotes);
    return anecdotes[mostVotedIndex]
  }
  return (
    <div>
      <AnecdoteDisplay anecdote={anecdotes[selected]} votes={votes[selected]} />
      <AnecdoteButtons onVote={voteAnecdote} onNext={getRandomAnecdote} />
      <MostVotedAnecdote anecdote={getMostVotedAnecdote()} />
    </div>
  );
};

export default App