import React, { useState } from 'react';
import './App.css';

const CHICKEN_IMG =
  'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';
const BANANA_IMG =
  'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';

const GRID_SIZE = 6;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

function generateTiles() {
  const halfTileCount = TILE_COUNT / 2;
  const tiles = [];

  // Add half chicken tiles
  for (let i = 0; i < halfTileCount; i++) {
    tiles.push('chicken');
  }

  // Add half banana tiles
  for (let i = 0; i < halfTileCount; i++) {
    tiles.push('banana');
  }

  // Shuffle the tiles array to randomize their order
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]]; // Swap elements
  }

  return tiles;
}

function App() {
  const [tiles, setTiles] = useState(generateTiles);
  const [clicked, setClicked] = useState(Array(TILE_COUNT).fill('none'));
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, ended
  const [winner, setWinner] = useState(null);
  const [player1Choice, setPlayer1Choice] = useState(null); // Player 1's choice
  const [player2Choice, setPlayer2Choice] = useState(null); // Player 2's choice
  const [currentPlayer, setCurrentPlayer] = useState(1); // track whose turn it is: 1 or 2
  const [isRevealed, setIsRevealed] = useState(false); // Track if tiles are revealed
  const [playerPicked, setPlayerPicked] = useState(false); // Track if players have picked

  const chickenTilesCount = tiles.filter((t) => t === 'chicken').length;
  const bananaTilesCount = tiles.filter((t) => t === 'banana').length;

  const handleTileClick = (index) => {
    if (gameStatus !== 'playing') return;
    if (clicked[index] !== 'none') return; // ignore tiles already opened

    const tileType = tiles[index];

    // Determine the winner based on the first tile clicked
    if (currentPlayer === 1) {
      if (player1Choice === tileType) {
        setWinner('Player 1 Wins!');
      } else {
        setWinner('Player 2 Wins!');
      }
    } else {
      if (player2Choice === tileType) {
        setWinner('Player 2 Wins!');
      } else {
        setWinner('Player 1 Wins!');
      }
    }

    // Mark the tile as clicked and reveal all tiles
    const newClicked = [...clicked];
    newClicked[index] = tileType;
    setClicked(newClicked);
    setIsRevealed(true);
    setGameStatus('ended');
  };

  const startGame = () => {
    setTiles(generateTiles());
    setClicked(Array(TILE_COUNT).fill('none'));
    setWinner(null);
    setGameStatus('playing');
    setCurrentPlayer(1); // Player 1 starts first
    setPlayerPicked(true);
    setIsRevealed(false); // Hide tiles at the start of the game
  };

  const restartGame = () => {
    setTiles(generateTiles());
    setClicked(Array(TILE_COUNT).fill('none'));
    setWinner(null);
    setGameStatus('waiting');
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setCurrentPlayer(1);
    setPlayerPicked(false);
    setIsRevealed(false); // Hide tiles after restart
  };

  const handleChoice = (player, choice) => {
    if (player === 1) {
      setPlayer1Choice(choice);
    } else {
      setPlayer2Choice(choice);
    }
  };

  // Toggle the reveal state when the button is pressed
  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="container">
      <h1>Chicken Banana Game</h1>

      {gameStatus === 'waiting' && (
        <div>
          <h3>Player 1, select your choice:</h3>
          <button onClick={() => handleChoice(1, 'chicken')} className="choice-button">
            Chicken
          </button>
          <button onClick={() => handleChoice(1, 'banana')} className="choice-button">
            Banana
          </button>

          {player1Choice && (
            <>
              <h3>Player 2, select your choice:</h3>
              <button onClick={() => handleChoice(2, 'chicken')} className="choice-button">
                Chicken
              </button>
              <button onClick={() => handleChoice(2, 'banana')} className="choice-button">
                Banana
              </button>
            </>
          )}
        </div>
      )}

      {gameStatus === 'waiting' && player1Choice && player2Choice && (
        <button onClick={startGame} className="start-button">
          Start Game
        </button>
      )}

      {gameStatus === 'playing' && (
        <>
          <h3>Game in Progress</h3>
          <p>Current Player: {currentPlayer === 1 ? 'Player 1' : 'Player 2'}</p>
          <button onClick={toggleReveal} className="hold-button">
            {isRevealed ? 'Close Tiles' : 'Reveal Tiles'}
          </button>
        </>
      )}

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 80px)`,
          gap: '5px',
          marginTop: '20px',
        }}
      >
        {tiles.map((tile, idx) => {
          const tileClicked = clicked[idx];
          let borderColor = 'gray';
          let content;

          // Reveal or hide the tiles based on the toggle state
          const reveal = isRevealed || tileClicked !== 'none';

          if (tileClicked === 'none' && !reveal) {
            // cover the tile
            content = null;
          } else if (tile === 'chicken') {
            borderColor = tileClicked === 'mistake' ? 'red' : 'blue';
            content = <img src={CHICKEN_IMG} alt="Chicken" className="tile-img" />;
          } else if (tile === 'banana') {
            borderColor = tileClicked === 'mistake' ? 'red' : 'yellowgreen';
            content = <img src={BANANA_IMG} alt="Banana" className="tile-img" />;
          }

          return (
            <div
              key={idx}
              className="tile"
              style={{
                border: `3px solid ${borderColor}`,
                backgroundColor: tileClicked === 'none' && !reveal ? '#777' : 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor:
                  gameStatus === 'playing' &&
                  tileClicked === 'none' &&
                  currentPlayer // only active once player picked
                    ? 'pointer'
                    : 'default',
                userSelect: 'none',
                position: 'relative',
              }}
              onClick={() => {
                if (gameStatus === 'playing' && tileClicked === 'none') {
                  handleTileClick(idx);
                }
              }}
              title={`Tile #${idx + 1}`}
            >
              {/* Tile number in top-left corner */}
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 6,
                  fontSize: 14,
                  color: tileClicked === 'none' && !reveal ? '#fff' : '#888',
                  fontWeight: 'bold',
                  opacity: 0.8,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {idx + 1}
              </span>
              {content}
            </div>
          );
        })}
      </div>

      {gameStatus === 'ended' && winner && (
        <div className="result" style={{ marginTop: '20px' }}>
          <h2>{winner}</h2>
          <button onClick={restartGame} className="restart-button">
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
