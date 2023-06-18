import { Rowdies } from "next/font/google"

export default function Home() {
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <pre className="">{header()}</pre>
      <div className="font-serif">
        Your ticket to a new show
      </div>
      <pre className="font-serif">
        {calendarBlock("this is my text\nblah\nblah\nblah\n\n\n")}
      </pre>
    </div>
  )
}

let header = () => {
  return String.raw`
                           _     __         _ 
  ___ __   __  ___  _ __  | |_  / _| _   _ | |
 / _ \\ \ / / / _ \| '_ \ | __|| |_ | | | || |
|  __/ \ V / |  __/| | | || |_ |  _|| |_| || |
 \___|  \_/   \___||_| |_| \__||_|   \__,_||_|
                                              `
}

let calendarBlock = (text: String) => {
  let corner = "+"
  let wall = "|"
  let floor = "—"
  let margin = 3
  let lines = text.split(/\r|\r\n|\n/g)
  let height = lines.length
  let longestLine = lines.reduce((prev, current) => (prev.length > current.length) ? prev : current)
  let width = longestLine.length < 50 ? longestLine.length : 50
  let result: string[][] = []
  for (let i = 0; i < height; i++) {
    result[i] = []
    for (let j = 0; j < width; j++) {
      if ((i == 0 && j == 0) || (i == height - 1 && j == width - 1) || (i == height - 1 && j == 0) || (i == 0 && j == width - 1)) {
        result[i][j] = corner
      } else if ((i == 0 && j != 0)) {
        result[i][j] = floor
      } else if (i != 0 && (j == 0 || j == width - 1)) {
        result[i][j] = wall
      } else if (i == height - 1 && j != 0 && j != width - 1) {
        result[i][j] = floor
      } else {
        result[i][j] = " "
      }
    }
  }
  return result.map(row => row.join("")).join("\n")
}

//max-width 75ch == 75 characters
//set inner div to max width, use that max width to determine size of calendar block