export async function projectStore(mode, action) {
  const database = await new Promise((resolve, reject) => {
    const request = indexedDB.open('miglik-creative-tools', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('projects', {keyPath: 'id'});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction('projects', mode);
      const request = action(transaction.objectStore('projects'));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}
