const config = {
  // Point this to where your .wasm file is hosted on GitHub
  locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`
};

let db = null;

// 1. Initialize the database
async function initDatabase() {
  try {
    const SQL = await initSqlJs(config);
    
    // 2. Fetch your existing .db file
    const response = await fetch('bidproduct.db');
    const arrayBuffer = await response.arrayBuffer();
    
    // 3. Load the data into the SQL engine
    db = new SQL.Database(new Uint8Array(arrayBuffer));
    console.log("Database loaded successfully!");
  } catch (err) {
    console.error("Error loading database:", err);
  }
}

// 4. Function to query the database
function executeQuery() {
  const userInput = document.getElementById('searchBar').value;
  
  if (!db) {
    alert("Database still loading...");
    return;
  }

  // Use Prepared Statements to prevent errors
  const stmt = db.prepare("SELECT * FROM bids WHERE config = $name");
  stmt.bind({$name: `${userInput}`});
  console.log(stmt)

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  displayResults(results);
}

function displayResults(data) {
  const output = document.getElementById('output');
  output.innerHTML = JSON.stringify(data, null, 2);
}

initDatabase();
