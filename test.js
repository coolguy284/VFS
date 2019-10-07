let util = require('util');
let vfs = require('./vfs.js');
let { FileSystem, FileSystemContext, helperf: { fnbufencode, fnbufdecode } } = require('./vfs.js');

function makeTestFS() {
  let rfs = new FileSystem({writable:true, maxsize:2**30});
  let rfs2 = new FileSystem({writable:true, maxsize:2**29});
  let fsv = new FileSystemContext(rfs, {uid:1000});
  let fsv2 = new FileSystemContext(rfs2, {uid:1000});
  //rfs.enableLogging('rfs');
  //rfs2.enableLogging('rfs');
  //fsv.enableLogging('fsv');
  //fsv2.enableLogging('fsv2');
  fsv.mkdirSync('/dir');
  fsv.writeFileSync('/dir/Some File.txt', 'This is a test file, inside a folder.');
  fsv.linkSync('/dir/Some File.txt', '/dir/File Hardlink.txt');
  fsv.symlinkSync('Some File.txt', '/dir/File Symlink.txt');
  fsv.mkdirSync('/dir/Some Folder');
  fsv.writeFileSync('/dir/Some Folder/File in Folder.txt', 'A file in a folder, to demonstrate symlinks.');
  fsv.linkSync('/dir/Some Folder', '/dir/Folder Hardlink');
  fsv.symlinkSync('Some Folder', '/dir/Folder Symlink');
  fsv.mkdirSync('/dir/Folder Mount Point');
  fsv.mount('/dir/Folder Mount Point', 0, fsv, '/dir/Some Folder');
  fsv.mkdirSync('/dir/Folder Hardlink Loop');
  fsv.linkSync('/dir/Folder Hardlink Loop', '/dir/Folder Hardlink Loop/Loop');
  fsv.writeFileSync('/dir/Folder Hardlink Loop/file.txt', 'A text file to demonstrate the strange infinite nested directory structure.');
  fsv.mkdirSync('/dir/Folder Symlink Loop');
  fsv.symlinkSync('.', '/dir/Folder Symlink Loop/Loop');
  fsv.writeFileSync('/dir/Folder Symlink Loop/file.txt', 'A text file to demonstrate the nested directory structure.');
  fsv.mkdirSync('/fs2');
  fsv.mount('/fs2', 0, fsv2, '/ell');
  fsv2.mkdirSync('/ell');
  fsv2.writeFileSync('/ell/test.txt', 'A test text file in a mounted filesystem.');
  return { rfs, rfs2, fsv, fsv2 };
}

function pprinterrors() {
  try {
    throw new Error('FS');
  } catch (e) {
    console.error(e);
  }
  try {
    throw new TypeError('FS');
  } catch (e) {
    console.error(e);
  }
  try {
    throw new vfs.errors.ReadOnlyFSError();
  } catch (e) {
    console.error(e);
  }
}

function importexportequalcheck() {
  console.log(vfs.rfs.lookupAll());
  vfs.rfs.importSystem(vfs.rfs.exportSystem());
  console.log(vfs.rfs.lookupAll());
}

function testfnbuf() {
  var bts = [
    Buffer.from([1, 2, 3]),
    Buffer.from([10, 9, 8]),
    Buffer.from([1, 2, 10, 3]),
    Buffer.from([10, 1, 2, 3, 10]),
    Buffer.from([1, 2, 3, 10]),
    Buffer.from([1, 10, 2, 10, 3]),
    Buffer.from([10, 10, 1, 10, 2, 10, 3, 10, 10]),
    Buffer.from([255, 10, 10, 1, 10, 2, 255, 10, 3, 10, 10, 255]),
  ];
  console.log(bts);
  var bte = bts.map(x => fnbufencode(x));
  console.log(bte);
  var btu = bte.map(x => fnbufdecode(x));
  console.log(btu);
}

function complexrmdir() {
  console.log(vfs.rfs.readdir('/dir'));
  vfs.rfs.unlink('/dir/Some File.txt');
  console.log(vfs.rfs.readdir('/dir'));
  vfs.rfs.rmdir('/dir/Some Folder');
  vfs.rfs.rmdir('/dir/Folder Hardlink');
  console.log(vfs.rfs.readdir('/dir'));
  console.log(vfs.rfs.readdir('/dir/Folder Hardlink Loop'));
  console.log(vfs.rfs.readdir('/dir/Folder Hardlink Loop/Loop'));
  vfs.rfs.rmdir('/dir/Folder Hardlink Loop');
  console.log(vfs.rfs.readdir('/dir'));
}

function strangefilenames() {
  console.log(vfs.rfs.readFile('/dir').toString());
  console.log(vfs.rfs.readdir('/dir'));
  vfs.rfs.writeFile('/dir/Test\n', 'NEWLINE FILE DUDES!!!');
  vfs.rfs.writeFile('/dir/Test\xff', '0xFF FILE DUDES!!!');
  console.log(vfs.rfs.readFile('/dir').toString());
  console.log(vfs.rfs.readdir('/dir'));
}

function basicnormalize() {
  var n = vfs.helperf.normalize;
  console.log('STARTING');
  console.log(n('/', '/'));
  console.log(n('/test', '/'));
  console.log(n('/test', '/ell'));
}

function realfsmount() {
  console.log('READDIR');
  console.log(vfs.fs.readdirSync('/fs2'));
  vfs.fs.mkdirSync('/realfs');
  vfs.fs.mount('/realfs', 0, fs, '/home/runner');
  console.log(vfs.fs.readdirSync('/'));
  console.log(vfs.fs.readdirSync('/realfs'));
}

function streamstest() {
  console.log(b1 = vfs.fs.readFileSync('/dir/Some File.txt'));
  console.log(b1.toString());
  var f = vfs.fs.createReadStream('/dir/Some File.txt');
  console.log(b2 = f.read(65536));
  console.log(b2.toString());
  f.destroy();
  console.log(vfs.fs.readdirSync('/'));
  var f = vfs.fs.createWriteStream('/test.txt');
  f.write('Test file contents.  ');
  f.write('That can be written to multiple times.');
  f.end();
  console.log(vfs.fs.readdirSync('/'));
  console.log(vfs.fs.readFileSync('/test.txt'));
  console.log(vfs.fs.readFileSync('/test.txt').toString());
}

function devzeropipe() {
  var fs = require('fs');
  console.log('START');
  vfs.fs.fs.maxsize = 2 ** 25;
  var s1 = fs.createReadStream('/dev/zero', {highWaterMark:262144/4});
  vfs.fs.writeFileSync('/devzero', Buffer.alloc(33000000));
  var s2 = vfs.fs.createWriteStream(null, {fd:vfs.fs.openSync('/devzero', 'r+'),highWaterMark:262144,autoClose:true});
  var t1 = Date.now();
  s2.on('close', () => {
    var t = (Date.now() - t1) / 1000;
    console.log(t + ' seconds');
    console.log(vfs.fs.statSync('/devzero').size / t + ' bytes/second');
  });
  s1.pipe(s2);
}

function pathsplittest() {
  t = (v) => {
    console.log('string: ' + v);
    console.log(vfs.helperf.pathSplit(v));
    console.log('buffer: ' + util.inspect(Buffer.from(v)));
    console.log(vfs.helperf.pathSplit(Buffer.from(v)));
    console.log(vfs.helperf.pathSplit(Buffer.from(v)).map(x => x.toString()));
  };
  t('/');
  t('/test');
  t('<3>/test');
  t('/dev/zero');
}

function buffilnamtest() {
  console.log('reading buffer filenames');
  console.log(vfs.fs.readdirSync('/'));
  console.log(vfs.fs.readdirSync('/dir'));
  console.log(vfs.fs.readdirSync(Buffer.from('/')));
  console.log(vfs.fs.readdirSync(Buffer.from('/dir')));
}

function bufxfffilnamtest() {
  vfs.fs.writeFileSync(Buffer.from('/dir/test\xff', 'latin1'), 'xff file dudes!');
  console.log(vfs.fs.readdirSync('/dir', {encoding:'buffer'}));
  console.log(vfs.fs.readFileSync('/dir'));
  console.log(vfs.fs.readFileSync('/dir').toString('latin1'));
  console.log(vfs.fs.readFileSync(Buffer.from('/dir/test\xff', 'latin1')));
  console.log(vfs.fs.readFileSync(Buffer.from('/dir/test\xff', 'latin1')).toString());
}

module.exports = { makeTestFS, pprinterrors, importexportequalcheck, testfnbuf, complexrmdir, strangefilenames, basicnormalize, realfsmount, streamstest, devzeropipe, pathsplittest, buffilnamtest, bufxfffilnamtest };