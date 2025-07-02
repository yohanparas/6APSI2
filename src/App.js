import React, { useState } from 'react';
import './App.css';

const CHICKEN_IMG =
  'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';
const BANANA_IMG =
  'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';

const GRID_SIZE = 6;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

function generateTiles() {
  const tiles = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    tiles.push(Math.random() < 0.5 ? 'chicken' : 'banana'); //random player start turn
  }
  return tiles;
}

function App() {
  const [tiles, setTiles] = useState(generateTiles);
  const [clicked, setClicked] = useState(Array(TILE_COUNT).fill('none'));
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, ended
  const [winner, setWinner] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('chicken'); // determine player turn

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
      } else {
        // switch player turn
        setCurrentPlayer(currentPlayer === 'chicken' ? 'banana' : 'chicken');
      }
    } else {
      // if wrong, other player wins
      setWinner(currentPlayer === 'chicken' ? 'banana' : 'chicken');
      setGameStatus('ended');
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
  };

  const restartGame = () => {
    setTiles(generateTiles());
    setClicked(Array(TILE_COUNT).fill('none'));
    setWinner(null);
    setGameStatus('waiting');
     setCurrentPlayer(Math.random() < 0.5 ? 'chicken' : 'banana');
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
        <h3 style={{ marginTop: '10px' }}>
          Current Turn: <span style={{ color: currentPlayer === 'chicken' ? 'blue' : 'green' }}>
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Player
          </span>
        </h3>
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

          if (tileClicked === 'none') {
            // cover the tile
            content = null;
          } else if (tileClicked === 'chicken') {
            borderColor = 'blue';
            content = <img src={CHICKEN_IMG} alt="Chicken" className="tile-img" />;
          } else if (tileClicked === 'banana') {
            borderColor = 'yellowgreen';
            content = <img src={BANANA_IMG} alt="Banana" className="tile-img" />;
          } else if (tileClicked === 'mistake') {
            borderColor = 'red';
            content = (
              <img
                src={tile === 'chicken' ? CHICKEN_IMG : BANANA_IMG}
                alt="Mistake"
                className="tile-img"
              />
            );
          }

          return (
            <div
              key={idx}
              className="tile"
              style={{
                border: `3px solid ${borderColor}`,
                backgroundColor: tileClicked === 'none' ? '#777' : 'white',
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
              }}
              onClick={() => {
                if (gameStatus === 'playing' && tileClicked === 'none') {
                  handleTileClick(idx);
                }
              }}
              title={`Tile #${idx + 1}`}
            >
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

      {gameStatus === 'playing'}
    </div>
  );
}

export default App;
