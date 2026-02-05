const config = {
  // Point this to where your .wasm file is hosted on GitHub
  locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`
};

let db = null;
let qry="";

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
  // const userInput = document.getElementById('searchBar').value;
  
  if (!db) {
    alert("Database still loading...");
    return;
  }

  // Use Prepared Statements to prevent errors
  const stmt = db.prepare("SELECT * FROM bids WHERE config = $name");
  stmt.bind({$name: `${qry}`});
  //console.log(stmt)

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  displayResults(results);
}

function QueryFind(qrystr)
{
  if (!db) {
    alert("Database still loading...");
    return;
  }

  const stmt = db.prepare("SELECT * FROM bids WHERE config = $name");
  stmt.bind({$name: `${qrystr}`});
  //console.log(stmt)

  let flag=false;
  if (stmt.step()) {
    flag=true;
  }
  stmt.free();
  return flag;
}

function displayResults(data) {
  console.log(data);
  displayStr="Not found.";
  const output = document.getElementById('output');
  if(data.length==1)displayStr=data[0].comment;
  output.innerHTML = displayStr;//JSON.stringify(data, null, 2);
}

// function displayQuery()
// {
//   const query=document.getElementById('query');
//   query.innerHTML=qry;
// }

function AppendQuery(str)
{
  qry=qry+str;
  //displayQuery();
  updateAuction();
}

function ClearQuery()
{
  qry="";
  //displayQuery();
  updateAuction();
}

function BackQuery()
{
  while(qry.length!=0)
  {
    if(qry.at(-1)=='_'){qry=qry.slice(0,-1);break;}
    else qry=qry.slice(0,-1);
  }
  //displayQuery();
  updateAuction();
}

function updateAuction()
{
  //console.log(qry);
  let tmp=qry;

  for(let i=1;i<=24;i++)
  {
    // get the first bid in the sequence
    let bid="";
    if(tmp.length!=0)
    {
      let loc=1;
      for(;loc<tmp.length;loc++)if(tmp[loc]=='_')break;
      bid=tmp.slice(0,loc);
      tmp=tmp.slice(loc);
      //console.log(i,bid);
    }
    const buttoni=document.getElementById("auc"+i.toString());
    buttoni.innerText=bid.slice(1);
    if(bid==="_P")
    {
      buttoni.style.backgroundColor="#5e9b34";
      buttoni.style.color="white";
    }
    else if(bid==="_X")
    {
      buttoni.style.backgroundColor="#cd0303";
      buttoni.style.color="white";
    }
    else if(bid==="_XX")
    {
      buttoni.style.backgroundColor="#46727d";
      buttoni.style.color="white";
    }
    else if(bid.slice(2)=="C")
    {
      buttoni.style.backgroundColor="#e6fdd1";
      buttoni.style.color="#1f4406";
    }
    else if(bid.slice(2)=="D")
    {
      buttoni.style.backgroundColor="#fcdbad";
      buttoni.style.color="#fe6605";
    }
    else if(bid.slice(2)=="H")
    {
      buttoni.style.backgroundColor="#fec0c1";
      buttoni.style.color="#eb030f";
    }
    else if(bid.slice(2)=="S")
    {
      buttoni.style.backgroundColor="#c5c3c4";
      buttoni.style.color="#030001";
    }
    else if(bid.slice(2)=="N")
    {
      buttoni.style.backgroundColor="#f4e8fc";
      buttoni.style.color="#540f78";
    }
    else if(bid==="")
    {
      buttoni.style.backgroundColor="white";
      buttoni.style.color="black";
    }
    else console.log("panic",bid);
  }

  executeQuery();

  for(let lvl=1;lvl<=7;lvl++)
  {
    let buttoni=document.getElementById("bid"+lvl.toString()+"N");
    //console.log(qry+"_"+lvl.toString()+"N",QueryFind(qry+"_"+lvl.toString()+"N"));
    if(QueryFind(qry+"_"+lvl.toString()+"N"))buttoni.style.filter="brightness(1.0)";
    else buttoni.style.filter="brightness(0.8)";

    buttoni=document.getElementById("bid"+lvl.toString()+"S");
    //console.log(qry+"_"+lvl.toString()+"S",QueryFind(qry+"_"+lvl.toString()+"S"));
    if(QueryFind(qry+"_"+lvl.toString()+"S"))buttoni.style.filter="brightness(1.0)";
    else buttoni.style.filter="brightness(0.8)";

    buttoni=document.getElementById("bid"+lvl.toString()+"H");
    //console.log(qry+"_"+lvl.toString()+"H",QueryFind(qry+"_"+lvl.toString()+"H"));
    if(QueryFind(qry+"_"+lvl.toString()+"H"))buttoni.style.filter="brightness(1.0)";
    else buttoni.style.filter="brightness(0.8)";

    buttoni=document.getElementById("bid"+lvl.toString()+"D");
    //console.log(qry+"_"+lvl.toString()+"D",QueryFind(qry+"_"+lvl.toString()+"D"));
    if(QueryFind(qry+"_"+lvl.toString()+"D"))buttoni.style.filter="brightness(1.0)";
    else buttoni.style.filter="brightness(0.8)";

    buttoni=document.getElementById("bid"+lvl.toString()+"C");
    //console.log(qry+"_"+lvl.toString()+"C",QueryFind(qry+"_"+lvl.toString()+"C"));
    if(QueryFind(qry+"_"+lvl.toString()+"C"))buttoni.style.filter="brightness(1.0)";
    else buttoni.style.filter="brightness(0.8)";
  }
}

initDatabase();