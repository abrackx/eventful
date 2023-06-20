export default function Home () {
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <pre aria-label="eventful">{header()}</pre>
      <div className="font-serif">
        <br/>
        Your events, right here
      </div>
      <pre className="font-serif">
        {createTable([
          ['first', 'blah'],
          ['this is my text', '', 'nerd', 'looooooooong'],
          ['blah blah', 'hey', 'you', 'heyo', 'what']
        ])}
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
 \___|  \_/   \___||_| |_| \__||_|   \__,_||_|`
}

//shoutout to this guy https://github.com/ozh/ascii-tables/blob/gh-pages/assets/js/script.js for letting me shamelessly, poorly, steal this script
function createTable (text: string[][]) {
  // set up the style
  let cTL, cTM, cTR
  let cML, cMM, cMR
  let cBL, cBM, cBR
  let hdV, hdH
  let spV, spH
  let sL, sM, sR

  let headerStyle = 'none'
  let autoFormat = true
  let trimInput = false
  let hasHeaders = headerStyle == 'top'
  let spreadSheetStyle = headerStyle == 'ssheet'
  let input = text
  let separator = '\t'
  let commenting = 'none'

  if (separator == '') {
    //Default separator is the tab
    separator = '\t'
  }

  let rows = input.map(r => r.join(''))
  if (rows[rows.length - 1] == '') {
    // extraneous last row, so delete it
    rows.pop()
  }

  if (spreadSheetStyle) {
    hasHeaders = true
    // add the row numbers
    for (let i = 0; i < rows.length; i++) {
      rows[i] = (i + 1) + separator + rows[i]
    }
  }

  // calculate the max size of each column
  let colLengths = []
  let isNumberCol = []
  for (let i = 0; i < rows.length; i++) {
    if (trimInput) {
      rows[i] = rows[i].trim()
    }
    if (separator == '\t') {
      rows[i] = rows[i].replace(/(    )/g, '\t')
    } else {
      //Tab is not the separator, replace tabs with single characters to keep correct spacing
      rows[i] = rows[i].replace(/\t/g, '    ')
    }
    let cols = input[i] // use input, not the rows
    //all this loop does is check whether it's a number
    for (let j = 0; j < cols.length; j++) {
      let data = cols[j]
      let isNewCol = colLengths[j] == undefined
      if (isNewCol) {
        isNumberCol[j] = true
      }
      // keep track of which columns are numbers only
      if (autoFormat && isNumberCol[j] && !data.match(/^(\s*-?(\d|,| |[.])*\s*)$/)) { //number can be negative, comma/period-separated, or decimal
        isNumberCol[j] = false
      }
      if (isNewCol || colLengths[j] < data.length) {
        colLengths[j] = data.length
      }
    }
  }

  if (spreadSheetStyle) {
    // now that we have the number of columns, add the letters
    let colCount = colLengths.length
    let letterRow = ' ' // initial column will have a space
    for (let i = 0; i < colCount; i++) {
      let asciiVal = (65 + i)
      if (90 < asciiVal) {
        asciiVal = 90 // Z is the max column
      }
      letterRow += separator + String.fromCharCode(asciiVal)
    }
    rows.splice(0, 0, letterRow) // add as first row
  }

  let style = 'separated'
  let hasHeaderSeparators = true // Defaults to including a separator line btwn header and data rows
  let hasLineSeparators = false // Defaults to no separator lines btwn data rows
  let hasTopLine = true // Defaults to including the topmost line
  let hasBottomLine = true // Defaults to including the bottom-most line
  let hasLeftSide = true // Defaults to including the left side line
  let hasRightSide = true // Defaults to including the right side line
  let topLineUsesBodySeparators = false // Defaults to top line uses the same separators as the line between header and body
  let align = 'l' // Default alignment: left-aligned

  // Add comment/remark indicators for use in code":
  let commentbefore = ''
  let commentafter = ''
  let prefix = ''
  let suffix = ''
  switch (commenting) {
    case 'none':
      break
    case 'doubleslant':
      // C++/C#/F#/Java/JavaScript/Rust/Swift
      prefix = '// '
      break
    case 'hash':
      // Perl/PowerShell/Python/R/Ruby
      prefix = '# '
      break
    case 'doubledash':
      // ada/AppleScript/Haskell/Lua/SQL
      prefix = '-- '
      break
    case 'docblock':
      // PHPDoc, JSDoc, Javadoc
      commentbefore = '/**'
      commentafter = ' */'
      prefix = ' * '
      break
    case 'percent':
      // MATLAB
      prefix = '% '
      break
    case 'singlespace':
      // mediawiki
      prefix = ' '
      break
    case 'quadspace':
      // reddit
      prefix = '    '
      break
    case 'singlequote':
      // VBA
      prefix = '\' '
      break
    case 'rem':
      // BASIC/DOS batch file
      prefix = 'REM '
      break
    case 'c':
      // Fortran IV
      prefix = 'C '
      break
    case 'exclamation':
      // Fortran 90
      prefix = '! '
      break
    case 'slantsplat':
      // CSS
      prefix = '/* '
      suffix = ' */'
      break
    case 'xml':
      // XML
      prefix = '<!-- '
      suffix = ' -->'
      break
    case 'pipe':
      prefix = '|'
      suffix = '|'
      break
    default:
      break
  }

  // Map of variable locations in the output:
  //
  // [cTL]   [hdH]  [cTM]   [hdH]  [cTR]
  // [hdV] Header 1 [hdV] Header 2 [hdV]
  // [cML]   [hdH]  [cMM]   [hdH]  [cMR]
  // [spV] Value 1  [spV] Value 2  [spV]
  // [cML]   [spH]  [cMM]   [spH]  [cMR]
  // [spV] Value 1a [spV] Value 2a [spV]
  // [cBL]   [spH]  [cBM]   [spH]  [cBR]

  switch (style) {
    case 'mysql':
      // ascii mysql style
      cTL = '+'
      cTM = '+'
      cTR = '+'
      cML = '+'
      cMM = '+'
      cMR = '+'
      cBL = '+'
      cBM = '+'
      cBR = '+'

      hdV = '|'
      hdH = '-'
      spV = '|'
      spH = '-'
      break
    case 'separated':
      // ascii 2
      hasLineSeparators = true
      cTL = '+'
      cTM = '+'
      cTR = '+'
      cML = '+'
      cMM = '+'
      cMR = '+'
      cBL = '+'
      cBM = '+'
      cBR = '+'

      hdV = '|'
      hdH = '='
      spV = '|'
      spH = '-'
      break
    case 'compact':
      // ascii - compact
      hasTopLine = false
      hasBottomLine = false
      cML = ' '
      cMM = ' '
      cMR = ' '
      hdV = ' '
      hdH = '-'
      spV = ' '
      spH = '-'
      break
    case 'rounded':
      // ascii rounded style
      hasLineSeparators = true
      cTL = '.'
      cTM = '.'
      cTR = '.'
      cML = ':'
      cMM = '+'
      cMR = ':'
      cBL = '\''
      cBM = '\''
      cBR = '\''

      hdV = '|'
      hdH = '-'
      spV = '|'
      spH = '-'
      break
    case 'girder':
      // ascii rounded style
      cTL = '//'
      cTM = '[]'
      cTR = '\\\\'
      cML = '|]'
      cMM = '[]'
      cMR = '[|'
      cBL = '\\\\'
      cBM = '[]'
      cBR = '//'

      hdV = '||'
      hdH = '='
      spV = '||'
      spH = '='
      break
    case 'bubbles':
      // ascii bubbled style
      cTL = ' o8'
      cTM = '(_)'
      cTR = '8o '
      cML = '(88'
      cMM = '(_)'
      cMR = '88)'
      cBL = ' O8'
      cBM = '(_)'
      cBR = '8O '

      hdV = '(_)'
      hdH = '8'
      spV = '(_)'
      spH = 'o'
      break
    case 'dots':
      // ascii dotted style
      cTL = '.'
      cTM = '.'
      cTR = '.'
      cML = ':'
      cMM = ':'
      cMR = ':'
      cBL = ':'
      cBM = ':'
      cBR = ':'
      sL = ':'
      sM = '.'
      sR = ':'

      hdV = ':'
      hdH = '.'
      spV = ':'
      spH = '.'
      break
    case 'gfm':
      // github markdown
      hasTopLine = false
      hasBottomLine = false
      cTL = '|'
      cTM = '|'
      cTR = '|'
      cML = '|'
      cMM = '|'
      cMR = '|'
      cBL = '|'
      cBM = '|'
      cBR = '|'

      hdV = '|'
      hdH = '-'
      spV = '|'
      spH = '-'
      break
    case 'reddit':
      // reddit markdown
      hasTopLine = false
      hasBottomLine = false
      hasLeftSide = false
      hasRightSide = false
      cTL = ' '
      cTM = '|'
      cTR = ' '
      cML = ' '
      cMM = '|'
      cMR = ' '
      cBL = ' '
      cBM = '|'
      cBR = ' '

      hdV = '|'
      hdH = '-'
      spV = '|'
      spH = '-'
      break
    case 'rstGrid':
      // reStructuredText Grid markup
      hasTopLine = true
      topLineUsesBodySeparators = true
      hasBottomLine = true
      cTL = '+'
      cTM = '+'
      cTR = '+'
      cML = '+'
      cMM = '+'
      cMR = '+'
      cBL = '+'
      cBM = '+'
      cBR = '+'

      hdV = '|'
      hdH = '='
      spV = '|'
      spH = '-'
      break
    case 'rstSimple':
      // reStructuredText Simple markup
      hasTopLine = true
      hasBottomLine = true
      cTL = ' '
      cTM = ' '
      cTR = ' '
      cML = ' '
      cMM = ' '
      cMR = ' '
      cBL = ' '
      cBM = ' '
      cBR = ' '

      hdV = ' '
      hdH = '='
      spV = ' '
      spH = '='
      break
    case 'jira':
      // jira markdown
      hasTopLine = false
      hasBottomLine = false
      autoFormat = false
      hasHeaderSeparators = false

      cTL = ''
      cTM = ''
      cTR = ''
      cML = ''
      cMM = ''
      cMR = ''
      cBL = ''
      cBM = ''
      cBR = ''

      hdV = '||'
      hdH = ''
      spV = '| '
      spH = ''
      break
    case 'mediawiki':
      // mediawiki
      hasLineSeparators = true
      hasRightSide = false
      autoFormat = false
      align = 'l'
      cTL = '{| class="wikitable"'
      cTM = ''
      cTR = ''
      cML = '|-'
      cMM = ''
      cMR = ''
      cBL = ''
      cBM = ''
      cBR = '|}'

      hdV = '\n!'
      hdH = ''
      spV = '\n|'
      spH = ''

      // also remove prefix/suffix:
      prefix = ''
      suffix = ''
      break
    case 'unicode':
      // unicode
      cTL = '\u2554'
      cTM = '\u2566'
      cTR = '\u2557'
      cML = '\u2560'
      cMM = '\u256C'
      cMR = '\u2563'
      cBL = '\u255A'
      cBM = '\u2569'
      cBR = '\u255D'

      hdV = '\u2551'
      hdH = '\u2550'
      spV = '\u2551'
      spH = '\u2550'
      break
    case 'unicode_single_line':
      // unicode one line thick border
      cTL = '\u250C'
      cTM = '\u252C'
      cTR = '\u2510'
      cML = '\u251C'
      cMM = '\u253C'
      cMR = '\u2524'
      cBL = '\u2514'
      cBM = '\u2534'
      cBR = '\u2518'

      hdV = '\u2502'
      hdH = '\u2500'
      spV = '\u2502'
      spH = '\u2500'
      break
    default:
      break
  }

  // output the text
  let output = ''

  // echo comment wrapper if any
  output += commentbefore + '\n'

  let topLineHorizontal
  // output the top most row
  // Ex: +---+---+
  if (hasTopLine) {
    if (topLineUsesBodySeparators || !hasHeaders) {
      topLineHorizontal = spH
    } else {
      topLineHorizontal = hdH
    }
    output += getSeparatorRow(colLengths, cTL, cTM, cTR, topLineHorizontal, prefix, suffix)
  }

  for (let i = 0; i < rows.length; i++) {
    // Separator Rows
    if (hasHeaders && hasHeaderSeparators && i == 1) {
      // output the header separator row
      output += getSeparatorRow(colLengths, cML, cMM, cMR, hdH, prefix, suffix)
    } else if (hasLineSeparators && i < rows.length) {
      // output line separators
      if ((!hasHeaders && i >= 1) || (hasHeaders && i > 1)) {
        output += getSeparatorRow(colLengths, cML, cMM, cMR, spH, prefix, suffix)
      }
    }

    for (let j = 0; j <= colLengths.length; j++) {
      // output the data
      if (j == 0) {
        output += prefix
      }
      let cols = input[i]
      let data = cols[j] || ''
      if (autoFormat) {
        if (hasHeaders && i == 0) {
          align = 'c'
        } else if (isNumberCol[j]) {
          align = 'r'
        } else {
          align = 'l'
        }
      }
      let verticalBar
      if (hasHeaders && i == 0) {
        verticalBar = hdV
      } else {
        verticalBar = spV
      }
      if (j < colLengths.length) {
        data = pad(data, colLengths[j], ' ', align)
        if (j == 0 && !hasLeftSide) {
          output += '  ' + data + ' '
        } else {
          output += verticalBar + ' ' + data + ' '
        }
      } else if (hasRightSide) {
        output += verticalBar + suffix + '\n'
      } else {
        output += suffix + '\n'
      }

    }
  }

  // output the bottom line
  // Ex: +---+---+
  if (hasBottomLine) {
    output += getSeparatorRow(colLengths, cBL, cBM, cBR, spH, prefix, suffix)
  }

  // echo comment wrapper if any
  output += commentafter + '\n'
  return output
}

function getSeparatorRow (lengths: any[], left: string | undefined, middle: string | undefined, right: string | undefined, horizontal: any, prefix: string, suffix: string) {
  let rowOutput = prefix
  for (let j = 0; j <= lengths.length; j++) {
    if (j == 0) {
      rowOutput += left + repeat(horizontal, lengths[j] + 2)
    } else if (j < lengths.length) {
      rowOutput += middle + repeat(horizontal, lengths[j] + 2)
    } else {
      rowOutput += right + suffix + '\n'
    }
  }
  return rowOutput
}

function pad (text: string, length: number, char: string, align: string) {
  // align: r l or c
  char = char ?? " "
  align = align ?? 'c'
  let additionalChars = length - text.length
  let result = ''
  switch (align) {
    case 'r':
      result = repeat(char, additionalChars) + text
      break
    case 'l':
      result = text + repeat(char, additionalChars)
      break
    case 'c':
      let leftSpaces = Math.floor(additionalChars / 2)
      let rightSpaces = additionalChars - leftSpaces
      result = repeat(char, leftSpaces) + text + repeat(char, rightSpaces)
      break
    default:
      break
  }
  return result
}

function repeat (str: string, num: number) {
  return new Array(num + 1).join(str)
}