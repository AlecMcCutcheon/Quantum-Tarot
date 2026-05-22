const DB_NAME = "quantum-tarot-v1";
const STORE = "library-thumbs";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

export async function loadAllThumbUrlsFromIdb(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (typeof indexedDB === "undefined") return map;

  try {
    const db = await openDb();
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    await new Promise<void>((resolve, reject) => {
      const req = store.openCursor();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) {
          resolve();
          return;
        }
        map.set(String(cursor.key), cursor.value as string);
        cursor.continue();
      };
    });
    db.close();
  } catch {
    /* private mode / blocked idb */
  }
  return map;
}

export async function saveThumbUrlToIdb(
  cardId: string,
  dataUrl: string,
): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(dataUrl, cardId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* ignore */
  }
}
