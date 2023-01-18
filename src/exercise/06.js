// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, PokemonDataView, PokemonInfoFallback, fetchPokemon} from '../pokemon'
import { ErrorBoundary} from 'react-error-boundary';
// class ErrorBoundary extends React.Component {
//   state = {error: null};
//   static getDerivedStateFromError(error) {
//     return {error};
//   }

//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }
//     return this.props.children;
//   }
// }


function PokemonInfo({pokemonName}) {
  // Storing all the state in an object
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    error: null,
    pokemon: null
  })
  // const [error, setError] = React.useState(null)
  // const [pokemon, setPokemon] = React.useState(null);
  // // setting a status state
  // const [status, setStatus] = React.useState("idle")

  // distructuring for easier use of the state
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if(!pokemonName) {
      return
    }
    // Removed/commented out these two states to use the status state.
    // setPokemon(null);
    // // The errorb state needs to be cleared by setting it to null in order so an error occurs its set
    // setError(null)
    setState({status: "pending"})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: "resolved"})
        },
      error => {
        setState({error, status: "rejected"})
      },
    )
  },[pokemonName])
// Displaying error msg if any
  if (status === "idle") {
    return ("Submit a pokemon")
  } else if (status === "pending") {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === "rejected") {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error("This should be impossible")


}


function ErrorFallback({error, resetErrorBoundary}) {
  // Here we are using resetErrorBoundary to triggle a reset and notified us when done for us to update the UI
  return (
    <div role="alert">
    There was an error:{' '} <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>)
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName("")
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
         <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pokemonName]} onReset={handleReset}>{/* added a key prop and passed a unique indentifier, in this case `pokemonName` works | another challage was to use the onReset prop and handle a reset when notified by the resetErrorBoundary || ErrorBoundary has a prop called resetKeys which will be checking if any state changes and if so resets. It takes an array of key values */}
            <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
