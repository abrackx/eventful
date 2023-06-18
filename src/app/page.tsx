export default function Home() {
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <pre className="">{header()}</pre>
      <div className="font-serif">
        Your ticket to a new show
      </div>
      <div className="font-serif">
        {calendarBlock()}
      </div>
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
  let floor = "_"
}