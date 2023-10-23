import { useState, useCallback, JSX } from "react";
import useInterval from "./useInterval";
import "./App.css";

type Grid = (1 | 0)[][];

const NUM_ROWS = 25;
const NUM_COLUMNS = 25;

const positions = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const getRandomTiles = (numRows: number, numCols: number) => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))); // returns a live cell 70% of the time
  }
  return rows;
};

function App(): JSX.Element {
  const [grid, setGrid] = useState(() => {
    return getRandomTiles(NUM_ROWS, NUM_COLUMNS);
  });
  const [running, setRunning] = useState(false);
  const runSimulation = useCallback((grid: Grid) => {
    let gridCopy: Grid = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < NUM_ROWS; i++) {
      for (let j = 0; j < NUM_COLUMNS; j++) {
        let neighbors = 0;

        positions.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < NUM_ROWS && newJ >= 0 && newJ < NUM_COLUMNS) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }
    setGrid(gridCopy);
  }, []);

  useInterval(
    () => {
      runSimulation(grid);
    },
    running ? 150 : null
  );

  return (
    <>
      <h1>Conway Game of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${NUM_COLUMNS}, 20px)`,
          width: "fit-content",
          margin: "10px auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((_col, k) => (
            <div
              key={`cell-${i}-${k}`}
              onClick={() => {
                let newGrid: Grid = JSON.parse(JSON.stringify(grid));
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#F68E5F" : undefined,
                border: "1px solid #595959",
              }}
            />
          ))
        )}
      </div>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
    </>
  );
}

export default App;
