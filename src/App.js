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
  const [currentPlayer, setCurrentPlayer] = useState('chicken'); // determine player turn
  const [isRevealed, setIsRevealed] = useState(false); // Track if tiles are revealed

  const chickenTilesCount = tiles.filter((t) => t === 'chicken').length;
  const bananaTilesCount = tiles.filter((t) => t === 'banana').length;

  const chickenClickedCount = clicked.filter(
    (c, i) => c === 'chicken' && tiles[i] === 'chicken'
  ).length;
  const bananaClickedCount = clicked.filter(
    (c, i) => c === 'banana' && tiles[i] === 'banana'
  ).length;

  const handleTileClick = (index) => {
    if (gameStatus !== 'playing') return;
    if (clicked[index] !== 'none') return; // ignore tiles already opened

    const tileType = tiles[index];

    if (tileType === currentPlayer) {
      const newClicked = [...clicked];
      newClicked[index] = currentPlayer;
      setClicked(newClicked);

      // Check win condition
      if (
        (currentPlayer === 'chicken' && chickenClickedCount + 1 === chickenTilesCount) ||
        (currentPlayer === 'banana' && bananaClickedCount + 1 === bananaTilesCount)
      ) {
        setWinner(currentPlayer);
        setGameStatus('ended');
        setIsRevealed(true); // Reveal all tiles when the game ends
      } else {
        // switch player turn
        setCurrentPlayer(currentPlayer === 'chicken' ? 'banana' : 'chicken');
      }
    } else {
      // if wrong, other player wins
      setWinner(currentPlayer === 'chicken' ? 'banana' : 'chicken');
      setGameStatus('ended');
      setIsRevealed(true); // Reveal all tiles when the game ends
      const newClicked = [...clicked];
      newClicked[index] = 'mistake';
      setClicked(newClicked);
    }
  };

  const startGame = () => {
    setTiles(generateTiles());
    setClicked(Array(TILE_COUNT).fill('none'));
    setWinner(null);
    setGameStatus('playing');
    setCurrentPlayer(Math.random() < 0.5 ? 'chicken' : 'banana');
    setIsRevealed(false); // Reset tile reveal state when starting a new game
  };

  const restartGame = () => {
    setTiles(generateTiles());
    setClicked(Array(TILE_COUNT).fill('none'));
    setWinner(null);
    setGameStatus('waiting');
    setCurrentPlayer(Math.random() < 0.5 ? 'chicken' : 'banana');
    setIsRevealed(false); // Reset tile reveal state when restarting
  };

  // Toggle the reveal state when the button is pressed
  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="container">
      <h1>Chicken Banana Game</h1>

      {(gameStatus === 'waiting' || gameStatus === 'ended') && (
        <button
          onClick={gameStatus === 'waiting' ? startGame : restartGame}
          className="start-button"
        >
          {gameStatus === 'waiting' ? 'Start Game (Both agree)' : 'Restart Game'}
        </button>
      )}

      {gameStatus === 'playing' && (
        <>
          <h3 style={{ marginTop: '10px' }}>
            Current Turn: <span style={{ color: currentPlayer === 'chicken' ? 'blue' : 'green' }}>
              {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Player
            </span>
          </h3>
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
                  currentPlayer // only current player can click
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
          <h2 style={{ color: winner === 'chicken' ? 'blue' : 'green' }}>
            {winner.charAt(0).toUpperCase() + winner.slice(1)} player wins!
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;
