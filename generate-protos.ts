import { exec } from 'child_process';

exec('sed -i "s/\r$//" protoc.sh', (err, out, sterr) => {
  if (err) console.error(err);
  if (sterr) console.error(sterr);
  console.log(out);
});

const command = 'bash ./protoc.sh';

exec(command, (err, stdout, stderr) => {
  if (err) throw err;
  if (stderr) throw stderr;
  console.info(stdout);
});
