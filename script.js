document.addEventListener("DOMContentLoaded", function () {
  // Use XMLHttpRequest to load the CSV file
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "Table%201.csv", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const csv = xhr.responseText;

      // Parse CSV data
      const rows = csv.split("\n");
      const data = [];

      // Skip header row (index 0) and process data rows
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === "") continue; // Skip empty rows

        const columns = rows[i].split(",");
        if (columns.length >= 2) {
          data.push({
            index: columns[0],
            value: columns[1],
          });
        }
      }

      // Populate Table 1
      const table1Body = document.getElementById("table1-body");
      table1Body.innerHTML = ""; // Clear any existing content

      data.forEach((row) => {
        const tr = document.createElement("tr");
        const tdIndex = document.createElement("td");
        const tdValue = document.createElement("td");

        tdIndex.textContent = row.index;
        tdValue.textContent = row.value;

        tr.appendChild(tdIndex);
        tr.appendChild(tdValue);
        table1Body.appendChild(tr);
      });

      // Extract values for Table 2 calculations
      const dataValues = {};
      data.forEach((row) => {
        dataValues[row.index] = parseInt(row.value, 10);
      });

      // Calculate values for Table 2
      calculateTable2Values(dataValues);

      console.log("Data loaded successfully:", data);
    } else {
      console.error("Failed to load CSV file. Status:", xhr.status);
      document.getElementById("table1-body").innerHTML =
        "<tr><td colspan='2'>Error loading data: " + xhr.status + "</td></tr>";
    }
  };

  xhr.onerror = function () {
    console.error("Request error:", xhr.statusText);
    document.getElementById("table1-body").innerHTML =
      "<tr><td colspan='2'>Error loading data: Network error</td></tr>";
  };

  xhr.send();
});

function calculateTable2Values(dataValues) {
  // Alpha: A5 + A20
  const alphaValue = dataValues["A5"] + dataValues["A20"];
  document.getElementById("alpha-value").textContent = alphaValue;

  // Beta: A15 / A7
  const betaValue = dataValues["A15"] / dataValues["A7"];
  document.getElementById("beta-value").textContent = betaValue;

  // Charlie: A13 * A12
  const charlieValue = dataValues["A13"] * dataValues["A12"];
  document.getElementById("charlie-value").textContent = charlieValue;
}
