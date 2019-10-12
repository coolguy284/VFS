# FileSystem
  The `FileSystem` object is the object where all the files are stored.

### new FileSystem(options)
* `options` <boolean>
  - Boolean for whether filesystem is writable or not.
* `options` <Buffer>
  - Exported filesystem buffer to import
* `options` <Object>
  - `writable` <boolean>  **Default**: true
  - `blocksize` <integer>  **Default**: 4096
  - `maxsize` <integer>  **Default**: 2 ** 32
  - `maxinodes` <integer>  **Default**: 2 ** 24
  - `wipeonfi` <boolean>  **Default**: false
  - `allowinoacc` <boolean>  **Default**: false
  - `archive` <boolean>  **Default**: false

Creates a new `FileSystem` object.
If `options` is a boolean, it specifies whether the filesystem is writable or not.
If `options` is a Buffer, it is an exported filesystem buffer to import.
If `options` is an object, then it configures various filesystem options.  The `writable` property specifies whether the filesystem is writable or not.  The `blocksize` property specifies the filesystem block size, used only to fill in the stats `blocksize` and `blocks` fields.  The `maxsize` property specifies the maximum size of the filesystem in bytes, including filesystem metadata.  The `wipeonfi` property specifies whether a file inode should be completely erased upon deletion.  The `allowinoacc` property specifies whether filepaths such as `'<1>'` or `'<2>'`, refrencing an inode number, should be allowed.  The `archive` property is a filesystem-wide archive bit, set when any change to the filesystem is made.