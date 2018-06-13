// 部署脚本

var exec = require('child_process').exec;

const USER = 'root';
const HOST = 'obenben.com';
const PORT = 22;
const PATH = '/home/g-will/admin';

var cmd;
if (process.env.DEPLOY_ENV === 'development') {
    // obenben
    cmd = `rsync -Pvr -e "ssh -p ${PORT}" dist/ ${USER}@${HOST}:${PATH}`;
} else if (process.env.DEPLOY_ENV === 'production') {
    // g-will
    cmd = 'rsync -Pvr -e "ssh -p 22 -i G-Will-AWS-Key.pem" dist/ ubuntu@13.56.37.5:/home/ubuntu/G-Will/admin';
} else if (process.env.DEPLOY_ENV === 'test') {
    // g-will-test
    cmd = 'rsync -Pvr -e "ssh -p 22 -i G-Will-AWS-Key.pem" dist/ ubuntu@13.56.37.5:/home/ubuntu/G-Will/admin-test';
}

var out = exec(cmd);

out.stdout.on('data', function(data) {
    console.log(data);
});

out.on('exit', function(code) {
    if (code === 0) {
        console.log('success done!');
    } else {
        console.error('error!');
    }
});
