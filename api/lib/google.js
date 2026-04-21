const { google } = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

let cachedAuth = null;

function getAuth() {
  if (cachedAuth) return cachedAuth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set');
  let creds;
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf8');
    creds = JSON.parse(decoded);
  } catch (e) {
    try { creds = JSON.parse(raw); } catch (e2) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON must be base64-encoded JSON or raw JSON');
    }
  }
  cachedAuth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });
  return cachedAuth;
}

async function getAccessToken() {
  const auth = getAuth();
  const { token } = await auth.getAccessToken();
  return token;
}

async function appendRow(sheetName, values) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID is not set');
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [values] },
  });
}

async function createResumableUpload({ fileName, mimeType }) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) throw new Error('GOOGLE_DRIVE_FOLDER_ID is not set');
  const token = await getAccessToken();
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType,
  };
  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': mimeType,
      },
      body: JSON.stringify(metadata),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Drive resumable init failed: ${res.status} ${text}`);
  }
  const sessionUrl = res.headers.get('location');
  if (!sessionUrl) throw new Error('Drive did not return resumable session URL');
  return { sessionUrl };
}

async function makeFilePublic(fileId) {
  const drive = google.drive({ version: 'v3', auth: getAuth() });
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
    supportsAllDrives: true,
  });
  const { data } = await drive.files.get({
    fileId,
    fields: 'webViewLink,webContentLink',
    supportsAllDrives: true,
  });
  return data;
}

module.exports = {
  getAuth,
  appendRow,
  createResumableUpload,
  makeFilePublic,
};
