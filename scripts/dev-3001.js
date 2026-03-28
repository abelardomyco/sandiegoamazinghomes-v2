#!/usr/bin/env node
/**
 * Start San Diego Amazing Homes dev server on port 3001 only.
 * Port 3000 is reserved for The Baja Land Company — never run this site on 3000.
 */
const { spawn } = require("child_process");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

console.log("San Diego Amazing Homes — starting on http://localhost:3001 (port 3000 = Baja Land Company only).\n");

const child = spawn("npx", ["next", "dev", "-p", "3001"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
child.on("exit", (code) => {
  process.exit(code ?? 0);
});
