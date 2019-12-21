# FileSystem
  The `FileSystem` object is the object where all the files are stored.

### new FileSystem(options)
* `options` <boolean>
  - Boolean for whether filesystem is writable or not.
* `options` <Buffer>
  - Exported filesystem buffer to import.
* `options` <Object>
  - `writable` <boolean>  **Default**: true
    - Specifies whether filesystem is writable or not.
  - `blocksize` <integer>  **Default**: 4096
    - Specifies filesystem block size, used only to fill in the stats `blocksize` and `blocks` for a file.
  - `maxsize` <integer>  **Default**: 2 ** 32
    - Maximum filesystem size in bytes, including filesystem metadata.
  - `maxinodes` <integer>  **Default**: 2 ** 24
    - Maximum number of inodes allowed.
  - `wipeonfi` <boolean>  **Default**: false
    - Specifies whether a file inode should be completely erased upon deletion.
  - `allowinoacc` <boolean>  **Default**: false
    - Specifies whether filepaths such as `'<1>'` or `'<2>'`, referencing an inode number, should be permitted.
  - `archive` <boolean>  **Default**: false
    - Filesystem-wide archive bit.

Creates a new `FileSystem` object.