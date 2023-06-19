import { Rowdies } from "next/font/google"

export default function Home() {
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <pre aria-label="eventful">{header()}</pre>
      <div className="font-serif">
        Your ticket to a new show
      </div>
      <pre className="font-serif">
        {createTable("this is my te                                                                   xt\nblah\nblah\nblah\n\n\n")}
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

//shoutout to this guy https://github.com/ozh/ascii-tables/blob/gh-pages/assets/js/script.js for letting me shamelessly, poorly, steal this script
function createTable(text: String) {
  // set up the style
  var cTL, cTM, cTR;
  var cML, cMM, cMR;
  var cBL, cBM, cBR;
  var hdV, hdH;
  var spV, spH;
  var sL, sM, sR;

  var headerStyle = "top";
  var autoFormat = true;
  var trimInput = false;
  var hasHeaders = headerStyle == "top";
  var spreadSheetStyle = headerStyle == "ssheet";
  var input = text;
  var separator = "";
  var commenting = "none";

  if (separator == "") {
      //Default separator is the tab
      separator = "\t";
  }

  var rows = input.split(/[\r\n]+/);
  if (rows[rows.length - 1] == "") {
      // extraneous last row, so delete it
      rows.pop();
  }

  if (spreadSheetStyle) {
      hasHeaders = true;
      // add the row numbers
      for (var i = 0; i < rows.length; i++) {
          rows[i] = (i+1) + separator + rows[i];
      }
  }

  // calculate the max size of each column
  var colLengths = [];
  var isNumberCol = [];
  for (var i = 0; i < rows.length; i++) {
      if (trimInput) {
          rows[i] = rows[i].trim();
      }
      if (separator == "\t") {
          rows[i] = rows[i].replace(/(    )/g, "\t");
      } else {
          //Tab is not the separator, replace tabs with single characters to keep correct spacing
          rows[i] = rows[i].replace(/\t/g, "    ");
      }
      var cols = rows[i].split(separator);
      for (var j = 0; j < cols.length; j++) {
          var data = cols[j];
          var isNewCol = colLengths[j] == undefined;
          if (isNewCol) {
              isNumberCol[j] = true;
          }
          // keep track of which columns are numbers only
          if (autoFormat) {
              if (hasHeaders && i == 0 && !spreadSheetStyle) {
                  ; // a header is allowed to not be a number (exclude spreadsheet because the header hasn't been added yet
              } else if (isNumberCol[j] && !data.match(/^(\s*-?(\d|,| |[.])*\s*)$/)) { //number can be negative, comma/period-separated, or decimal
                  isNumberCol[j] = false;
              }
          }
          if (isNewCol || colLengths[j] < data.length) {
             colLengths[j] = data.length;
          }
      }
  }

  if (spreadSheetStyle) {
      // now that we have the number of columns, add the letters
      var colCount = colLengths.length;
      var letterRow = " "; // initial column will have a space
      for (var i = 0; i < colCount; i++) {
          var asciiVal = (65 + i);
          if (90 < asciiVal) {
              asciiVal = 90; // Z is the max column
          }
          letterRow += separator + String.fromCharCode(asciiVal);
      }
      rows.splice(0, 0, letterRow); // add as first row
  }

  var style = "mysql";
  var hasHeaderSeparators = true; // Defaults to including a separator line btwn header and data rows
  var hasLineSeparators = false; // Defaults to no separator lines btwn data rows
  var hasTopLine = true; // Defaults to including the topmost line
  var hasBottomLine = true; // Defaults to including the bottom-most line
  var hasLeftSide = true; // Defaults to including the left side line
  var hasRightSide = true; // Defaults to including the right side line
  var topLineUsesBodySeparators = false; // Defaults to top line uses the same separators as the line between header and body
  var align = "c"; // Default alignment: left-aligned

  // Add comment/remark indicators for use in code":
  var commentbefore = "";
  var commentafter  = "";
  var prefix = "";
  var suffix = "";
  switch (commenting) {
  case "none":
      break;
  case "doubleslant":
      // C++/C#/F#/Java/JavaScript/Rust/Swift
      prefix = "// ";
      break;
  case "hash":
      // Perl/PowerShell/Python/R/Ruby
      prefix = "# ";
      break;
  case "doubledash":
      // ada/AppleScript/Haskell/Lua/SQL
      prefix = "-- ";
      break;
  case "docblock":
      // PHPDoc, JSDoc, Javadoc
      commentbefore = "/**";
      commentafter  = " */";
      prefix = " * ";
      break;
  case "percent":
      // MATLAB
      prefix = "% ";
      break;
  case "singlespace":
      // mediawiki
      prefix = " ";
      break;
  case "quadspace":
      // reddit
      prefix = "    ";
      break;
  case "singlequote":
      // VBA
      prefix = "' ";
      break;
  case "rem":
      // BASIC/DOS batch file
      prefix = "REM ";
      break;
  case "c":
      // Fortran IV
      prefix = "C ";
      break;
  case "exclamation":
      // Fortran 90
      prefix = "! ";
      break;
  case "slantsplat":
      // CSS
      prefix = "/* ";
      suffix = " */";
      break;
  case "xml":
      // XML
      prefix = "<!-- ";
      suffix = " -->";
      break;
  case "pipe":
      prefix = "|";
      suffix = "|";
      break;
  default:
      break;
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
  case "mysql":
      // ascii mysql style
      cTL = "+"; cTM = "+"; cTR = "+";
      cML = "+"; cMM = "+"; cMR = "+";
      cBL = "+"; cBM = "+"; cBR = "+";

      hdV = "|"; hdH = "-";
      spV = "|"; spH = "-";
      break;
  case "separated":
      // ascii 2
      hasLineSeparators = true;
      cTL = "+"; cTM = "+"; cTR = "+";
      cML = "+"; cMM = "+"; cMR = "+";
      cBL = "+"; cBM = "+"; cBR = "+";

      hdV = "|"; hdH = "=";
      spV = "|"; spH = "-";
      break;
  case "compact":
      // ascii - compact
      hasTopLine = false;
      hasBottomLine = false;
      cML = " "; cMM = " "; cMR = " ";
      hdV = " "; hdH = "-";
      spV = " "; spH = "-";
      break;
  case "rounded":
      // ascii rounded style
      hasLineSeparators = true;
      cTL = "."; cTM = "."; cTR = ".";
      cML = ":"; cMM = "+"; cMR = ":";
      cBL = "'"; cBM = "'"; cBR = "'";

      hdV = "|"; hdH = "-";
      spV = "|"; spH = "-";
      break;
  case "girder":
      // ascii rounded style
      cTL = "//"; cTM = "[]"; cTR = "\\\\";
      cML = "|]"; cMM = "[]"; cMR = "[|";
      cBL = "\\\\"; cBM = "[]"; cBR = "//";

      hdV = "||"; hdH = "=";
      spV = "||"; spH = "=";
      break;
  case "bubbles":
      // ascii bubbled style
      cTL = " o8"; cTM = "(_)"; cTR = "8o ";
      cML = "(88"; cMM = "(_)"; cMR = "88)";
      cBL = " O8"; cBM = "(_)"; cBR = "8O ";

      hdV = "(_)"; hdH = "8";
      spV = "(_)"; spH = "o";
      break;
  case "dots":
      // ascii dotted style
      cTL = "."; cTM = "."; cTR = ".";
      cML = ":"; cMM = ":"; cMR = ":";
      cBL = ":"; cBM = ":"; cBR = ":";
      sL  = ":"; sM  = "."; sR  = ":";

      hdV = ":"; hdH = ".";
      spV = ":"; spH = ".";
      break;
  case "gfm":
      // github markdown
      hasTopLine = false;
      hasBottomLine = false;
      cTL = "|"; cTM = "|"; cTR = "|";
      cML = "|"; cMM = "|"; cMR = "|";
      cBL = "|"; cBM = "|"; cBR = "|";

      hdV = "|"; hdH = "-";
      spV = "|"; spH = "-";
      break;
  case "reddit":
      // reddit markdown
      hasTopLine = false;
      hasBottomLine = false;
      hasLeftSide = false;
      hasRightSide = false;
      cTL = " "; cTM = "|"; cTR = " ";
      cML = " "; cMM = "|"; cMR = " ";
      cBL = " "; cBM = "|"; cBR = " ";

      hdV = "|"; hdH = "-";
      spV = "|"; spH = "-";
      break;
  case "rstGrid":
      // reStructuredText Grid markup
      hasTopLine = true;
      topLineUsesBodySeparators = true;
      hasBottomLine = true;
      cTL = "+"; cTM = "+"; cTR = "+";
      cML = "+"; cMM = "+"; cMR = "+";
      cBL = "+"; cBM = "+"; cBR = "+";

      hdV = "|"; hdH = "=";
      spV = "|"; spH = "-";
      break;
  case "rstSimple":
      // reStructuredText Simple markup
      hasTopLine = true;
      hasBottomLine = true;
      cTL = " "; cTM = " "; cTR = " ";
      cML = " "; cMM = " "; cMR = " ";
      cBL = " "; cBM = " "; cBR = " ";

      hdV = " "; hdH = "=";
      spV = " "; spH = "=";
      break;
  case "jira":
      // jira markdown
      hasTopLine = false;
      hasBottomLine = false;
      autoFormat = false;
      hasHeaderSeparators = false;

      cTL = ""; cTM = ""; cTR = "";
      cML = ""; cMM = ""; cMR = "";
      cBL = ""; cBM = ""; cBR = "";

      hdV = "||"; hdH = "";
      spV = "| "; spH = "";
      break;
  case "mediawiki":
      // mediawiki
      hasLineSeparators = true;
      hasRightSide = false;
      autoFormat = false;
      align = "l";
      cTL = '{| class="wikitable"'; cTM = ""; cTR = "";
      cML = "|-"; cMM = ""; cMR = "";
      cBL = ""; cBM = ""; cBR = "|}";

      hdV = "\n!"; hdH = "";
      spV = "\n|"; spH = "";

      // also remove prefix/suffix:
      prefix = "";
      suffix = "";
      break;
  case "unicode":
      // unicode
      cTL = "\u2554"; cTM = "\u2566"; cTR = "\u2557";
      cML = "\u2560"; cMM = "\u256C"; cMR = "\u2563";
      cBL = "\u255A"; cBM = "\u2569"; cBR = "\u255D";

      hdV = "\u2551"; hdH = "\u2550";
      spV = "\u2551"; spH = "\u2550";
      break;
  case "unicode_single_line":
      // unicode one line thick border
      cTL = "\u250C"; cTM = "\u252C"; cTR = "\u2510";
      cML = "\u251C"; cMM = "\u253C"; cMR = "\u2524";
      cBL = "\u2514"; cBM = "\u2534"; cBR = "\u2518";

      hdV = "\u2502"; hdH = "\u2500";
      spV = "\u2502"; spH = "\u2500";
      break;
  default:
      break;
  }

  // output the text
  var output = "";

  // echo comment wrapper if any
  output += commentbefore + "\n";

  var topLineHorizontal
  // output the top most row
  // Ex: +---+---+
  if (hasTopLine ) {
      if (topLineUsesBodySeparators || !hasHeaders) {
          topLineHorizontal = spH;
      } else {
          topLineHorizontal = hdH;
      }
      output += getSeparatorRow(colLengths, cTL, cTM, cTR, topLineHorizontal, prefix, suffix)
  }

  for (var i = 0; i < rows.length; i++) {
      // Separator Rows
      if (hasHeaders && hasHeaderSeparators && i == 1 ) {
          // output the header separator row
          output += getSeparatorRow(colLengths, cML, cMM, cMR, hdH, prefix, suffix)
      } else if ( hasLineSeparators && i < rows.length ) {
          // output line separators
          if( ( !hasHeaders && i >= 1 ) || ( hasHeaders && i > 1 ) ) {
              output += getSeparatorRow(colLengths, cML, cMM, cMR, spH, prefix, suffix)
          }
      }

      for (var j = 0; j <= colLengths.length; j++) {
          // output the data
          if (j == 0) {
              output += prefix;
          }
          var cols = rows[i].split(separator);
          var data = cols[j] || "";
          if (autoFormat) {
              if (hasHeaders && i == 0) {
                  align = "c";
              } else if (isNumberCol[j]) {
                  align = "r";
              } else {
                  align = "l";
              }
          }
          var verticalBar
          if (hasHeaders && i == 0 ) {
              verticalBar = hdV;
          } else {
              verticalBar = spV;
          }
          if ( j < colLengths.length ) {
              data = _pad(data, colLengths[j], " ", align);
              if (j == 0 && !hasLeftSide) {
                  output += "  " + data + " ";
              } else {
                  output += verticalBar + " " + data + " ";
              }
          } else if (hasRightSide) {
              output += verticalBar + suffix + "\n";
          } else {
              output += suffix + "\n";
          }

      }
  }

  // output the bottom line
  // Ex: +---+---+
  if (hasBottomLine ) {
      output += getSeparatorRow(colLengths, cBL, cBM, cBR, spH, prefix, suffix)
  }

  // echo comment wrapper if any
  output += commentafter + "\n";
  return output
}

function getSeparatorRow(lengths, left, middle, right, horizontal, prefix, suffix) {
  var rowOutput = prefix;
  for (var j = 0; j <= lengths.length; j++) {
      if ( j == 0 ) {
          rowOutput += left + _repeat(horizontal, lengths[j] + 2);
      } else if ( j < lengths.length ) {
          rowOutput += middle + _repeat(horizontal, lengths[j] + 2);
      } else {
          rowOutput += right + suffix + "\n";
      }
  }
  return rowOutput;
};




function _pad(text, length, char, align) {
  // align: r l or c
  char = defValue(char, " ");
  align = defValue(align, "l");
  var additionalChars = length - text.length;
  var result = "";
  switch (align) {
      case "r":
          result = _repeat(char, additionalChars) + text;
          break;
      case "l":
          result = text + _repeat(char, additionalChars);
          break;
      case "c":
          var leftSpaces = Math.floor(additionalChars / 2);
          var rightSpaces = additionalChars - leftSpaces;
          result = _repeat(char, leftSpaces) + text + _repeat(char,rightSpaces);
          break;
      default:
          break;
  }
  return result;
}

function _repeat(str, num) {
  return new Array(num + 1).join(str);
}

function defValue(value, defaultValue) {
  return (typeof value === "undefined") ? defaultValue : value;
}