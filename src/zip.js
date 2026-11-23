'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Precomputed CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function getFilesRecursively(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getFilesRecursively(full, baseDir));
    } else {
      results.push({
        name: path.relative(baseDir, full).replace(/\\/g, '/'),
        data: fs.readFileSync(full),
      });
    }
  }
  return results;
}

function createZipBuffer(files) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const f of files) {
    const nameBuf = Buffer.from(f.name, 'utf8');
    const dataBuf = f.data;
    const compressed = zlib.deflateRawSync(dataBuf);
    const crc = crc32(dataBuf);

    // Local file header (30 bytes + name + compressed data)
    const local = Buffer.alloc(30 + nameBuf.length + compressed.length);
    local.writeUInt32LE(0x04034b50, 0); // Signature
    local.writeUInt16LE(20, 4);         // Version 2.0
    local.writeUInt16LE(0, 6);          // Flags
    local.writeUInt16LE(8, 8);          // Compression: Deflate
    local.writeUInt16LE(0, 10);         // Mod time
    local.writeUInt16LE(0, 12);         // Mod date
    local.writeUInt32LE(crc, 14);       // CRC-32
    local.writeUInt32LE(compressed.length, 18); // Compressed size
    local.writeUInt32LE(dataBuf.length, 22);    // Uncompressed size
    local.writeUInt16LE(nameBuf.length, 26);    // Name len
    local.writeUInt16LE(0, 28);                 // Extra len
    nameBuf.copy(local, 30);
    compressed.copy(local, 30 + nameBuf.length);

    // Central directory header (46 bytes + name)
    const central = Buffer.alloc(46 + nameBuf.length);
    central.writeUInt32LE(0x02014b50, 0); // Signature
    central.writeUInt16LE(20, 4);         // Version made by
    central.writeUInt16LE(20, 6);         // Version needed
    central.writeUInt16LE(0, 8);          // Flags
    central.writeUInt16LE(8, 10);         // Compression: Deflate
    central.writeUInt16LE(0, 12);         // Mod time
    central.writeUInt16LE(0, 14);         // Mod date
    central.writeUInt32LE(crc, 16);       // CRC-32
    central.writeUInt32LE(compressed.length, 20); // Compressed size
    central.writeUInt32LE(dataBuf.length, 24);    // Uncompressed size
    central.writeUInt16LE(nameBuf.length, 28);    // Name len
    central.writeUInt16LE(0, 30);                 // Extra len
    central.writeUInt16LE(0, 32);                 // Comment len
    central.writeUInt16LE(0, 34);                 // Disk start
    central.writeUInt16LE(0, 36);                 // Internal attr
    central.writeUInt32LE(0, 38);                 // External attr
    central.writeUInt32LE(offset, 42);            // Offset of local header
    nameBuf.copy(central, 46);

    localHeaders.push(local);
    centralHeaders.push(central);
    offset += local.length;
  }

  const centralOffset = offset;
  const centralSize = centralHeaders.reduce((sum, h) => sum + h.length, 0);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // Signature
  eocd.writeUInt16LE(0, 4);          // Disk num
  eocd.writeUInt16LE(0, 6);          // Start disk
  eocd.writeUInt16LE(files.length, 8); // Entries on disk
  eocd.writeUInt16LE(files.length, 10); // Total entries
  eocd.writeUInt32LE(centralSize, 12);  // Central dir size
  eocd.writeUInt32LE(centralOffset, 16);// Offset of start
  eocd.writeUInt16LE(0, 20);           // Comment len

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

function zipDirectory(sourceDir, targetZipPath) {
  const files = getFilesRecursively(sourceDir);
  const buf = createZipBuffer(files);
  const parent = path.dirname(targetZipPath);
  if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
  fs.writeFileSync(targetZipPath, buf);
  return { ok: true, path: targetZipPath, size: buf.length };
}

module.exports = {
  crc32,
  createZipBuffer,
  getFilesRecursively,
  zipDirectory,
};
