# VFS
 VFS is a module for creating virtual fs objects that reside in memory.

## Getting Started
### Installing
 To install VFS, download the zip of this repository, and extract to desired location.
 After that, `cd` to the parent folder of the desired location, and run `node` to enter an interactive prompt.

 Example:
 ```
 test@test:~$ cd ~/vfsdownload
 test@test:~$ ls
 vfs
 test@test:~$ node
 > vfs = require('./vfs')                 // location of extracted repository
 > fsr = new vfs.FileSystem()             // actual file system in memory
 > fsc = new vfs.FileSystemContext(fsr)   // creates an fs-like object for filesystem
 > fsc.readdirSync('/')
 []
 > fsc.writeFileSync('/test.txt', 'Test file inside an in-memory filesystem.')
 > fsc.readdirSync('/')
 [ 'test.txt' ]
 > fsc.readFileSync('/test.txt')
 <Buffer 54 65 73 74 20 66 69 6c 65 20 69 6e 73 69 64 65 20 61 6e 20 69 6e 2d 6d 65 6d 6f 72 79 20 66 69 6c 65 73 79 73 74 65 6d 2e>
 > fsc.readFileSync('/test.txt').toString()
 'Test file inside an in-memory filesystem.'
 ```

## Docs
- [Refrence](./REFRENCE.md)