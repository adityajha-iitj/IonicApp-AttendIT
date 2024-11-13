const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Define the Python file you want to run
const pythonFile = "generate_embedings.py"; // Replace with your Python file
const requirementsFile = "requirements.txt";

// Step 1: Install Python (this works for Windows with Chocolatey, macOS with Homebrew, Linux with apt)
function installPython() {
  console.log("Installing Python...");
  let installCommand;
  if (process.platform === "win32") {
    installCommand = "choco install python -y";
  } else if (process.platform === "darwin") {
    installCommand = "brew install python";
  } else if (process.platform === "linux") {
    installCommand = "apt-get install python3 -y";
  } else {
    console.error("Unsupported platform.");
    return;
  }

  // exec(installCommand, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error installing Python: ${error.message}`);
  //     return;
  //   }
  //   console.log(`Python installed: ${stdout}`);
  //   installRequirements();
  // });

  installRequirements()
}

// Step 2: Install requirements from requirements.txt
function installRequirements() {
  console.log("Installing packages from requirements.txt...");
  if (!fs.existsSync(requirementsFile)) {
    console.error("requirements.txt not found.");
    return;
  }

  const command = `python3 -m pip install -r ${requirementsFile}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing packages: ${error.message}`);
      return;
    }
    console.log(`Packages installed: ${stdout}`);
    runPythonFile();
  });
}

// Step 3: Run the specified Python file
function runPythonFile() {
  console.log(`Running ${pythonFile}...`);
  if (!fs.existsSync(pythonFile)) {
    console.error(`${pythonFile} not found.`);
    return;
  }

  const command = `python3 ${pythonFile}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running ${pythonFile}: ${error.message}`);
      return;
    }
    console.log(`Output:\n${stdout}`);
  });
}

// Start the process
installPython();
