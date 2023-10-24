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

function checkNeighbor(grid: Grid, x: number, y: number): number {
  // debugger;
  if (x < 0) {
    x = NUM_ROWS - 1;
  }
  if (x >= NUM_ROWS) {
    x = 0;
  }
  if (y >= NUM_COLUMNS) {
    y = 0;
  }
  if (y < 0) {
    y = NUM_COLUMNS - 1;
  }
  try {
    return grid[x][y];
  } catch (err) {
    console.log(err);
    console.log({ grid, x, y });
    throw err;
  }
}

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
  const clearGrid = () => {
    const newGrid = Array(NUM_COLUMNS)
      .fill(null)
      .map(() => Array(NUM_ROWS).fill(0));
    setGrid(newGrid);
  };
  const runSimulation = useCallback((grid: Grid) => {
    let gridCopy: Grid = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < NUM_ROWS; i++) {
      for (let j = 0; j < NUM_COLUMNS; j++) {
        let neighbors = 0;

        positions.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          neighbors += checkNeighbor(grid, newI, newJ);
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
    running ? 200 : null
  );

  return (
    <>
      <h1>Conway's Game of Life</h1>
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
        style={{ backgroundColor: "#F68E5F" }}
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button
        style={{ backgroundColor: "#d3d3d3", marginLeft: 10 }}
        onClick={clearGrid}
      >
        Clear
      </button>
    </>
  );
}

export default App;
