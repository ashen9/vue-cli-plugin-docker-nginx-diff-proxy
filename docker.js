const { spawn } = require('child_process');

const build = args => {
  // TODO: what type is args, how to extract e.g. Port
  const process = spawn('docker', ['build', '.', '-t', 'app']);
  process.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });

  process.on('close', code => {
    console.log(`child process exited with code ${code}`);
  });
};

module.exports = build;
