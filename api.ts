import type { Announcement, ContactInfo, ReviewStatus, PresentationStatus } from './types';

const API_BASE_URL = '/api';

// Helper function for fetch requests
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'API request failed');
  }

  if (response.status === 204 || response.status === 200 && response.headers.get('content-length') === '0') {
    return;
  }

  return response.json();
};

// Helper function for file uploads (multipart/form-data)
const fetchAPIWithFile = async (endpoint: string, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'File upload failed');
  }

  return response.json();
};

// --- AUTH & USERS ---
export const login = (username: string, password: string) => {
  return fetchAPI('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const getUsers = () => {
  return fetchAPI('/users');
};

// --- REGISTRATIONS ---
export const getRegistrations = () => {
  return fetchAPI('/registrations');
};

export const addRegistration = (formData: {
  name: string;
  organization: string;
  email: string;
  phone: string;
  withPaper: string;
}) => {
  return fetchAPI('/registrations', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

// --- ANNOUNCEMENTS ---
export const getAnnouncements = (): Promise<Announcement[]> => {
  return fetchAPI('/announcements');
};

export const addAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
  return fetchAPI('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAnnouncement = (id: number, data: Partial<Announcement>) => {
  return fetchAPI(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAnnouncement = (id: number) => {
  return fetchAPI(`/announcements/${id}`, {
    method: 'DELETE',
  });
};

// --- PAPERS ---
export const getPapers = () => {
  return fetchAPI('/papers');
};

export const getPaper = (id: number) => {
  return fetchAPI(`/papers/${id}`);
};

export const addPaper = (data: {
  authorName: string;
  organization: string;
  paperTitle: string;
  topic: string | number;
  abstractStatus?: ReviewStatus;
  fullTextStatus?: ReviewStatus;
  reviewStatus?: ReviewStatus;
  presentationStatus?: PresentationStatus;
}) => {
  return fetchAPI('/papers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePaper = (id: number, data: Record<string, any>) => {
  return fetchAPI(`/papers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deletePaper = (id: number) => {
  return fetchAPI(`/papers/${id}`, {
    method: 'DELETE',
  });
};

export const uploadFullTextFile = (paperId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetchAPIWithFile(`/papers/${paperId}/upload-fulltext`, formData);
};

export const deleteFullTextFile = (paperId: number) => {
  return fetchAPI(`/papers/${paperId}/delete-fulltext`, {
    method: 'DELETE',
  });
};

// --- PUBLIC SUBMISSIONS (Google Sheets + Drive) ---

const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB — must be a multiple of 256 KiB for Drive

type UploadProgressCb = (percent: number) => void;

// Upload a file directly to Google Drive using a resumable session URL obtained from our API.
// Returns the Drive fileId so the server can attach it to a sheet row.
export const uploadToDrive = async (
  file: File,
  onProgress?: UploadProgressCb
): Promise<{ fileId: string; fileName: string }> => {
  const init = await fetchAPI('/drive/init-upload', {
    method: 'POST',
    body: JSON.stringify({ fileName: file.name, mimeType: file.type || 'application/octet-stream' }),
  });
  const sessionUrl: string = init.sessionUrl;

  const total = file.size;
  let offset = 0;
  let fileId: string | null = null;

  while (offset < total) {
    const end = Math.min(offset + CHUNK_SIZE, total);
    const chunk = file.slice(offset, end);
    const res = await fetch(sessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes ${offset}-${end - 1}/${total}`,
      },
      body: chunk,
    });
    if (res.status === 200 || res.status === 201) {
      const data = await res.json();
      fileId = data.id;
      offset = total;
    } else if (res.status === 308) {
      const range = res.headers.get('range'); // "bytes=0-N"
      if (range) {
        const m = range.match(/bytes=\d+-(\d+)/);
        if (m) offset = parseInt(m[1], 10) + 1;
        else offset = end;
      } else {
        offset = end;
      }
      if (onProgress) onProgress(Math.round((offset / total) * 100));
    } else {
      const text = await res.text().catch(() => '');
      throw new Error(`Drive upload failed (${res.status}): ${text}`);
    }
  }

  if (!fileId) throw new Error('Drive upload finished but fileId is missing');
  if (onProgress) onProgress(100);
  return { fileId, fileName: file.name };
};

export const submitPublicPaper = (data: {
  authorName: string;
  organization: string;
  email: string;
  phone: string;
  paperTitle: string;
  topic: string;
  fileId: string;
  fileName: string;
}) => fetchAPI('/public/papers', { method: 'POST', body: JSON.stringify(data) });

export const submitPublicRegistration = (data: {
  tab: 'abstract' | 'full' | 'attend';
  name: string;
  organization: string;
  email: string;
  phone: string;
  paperTitle?: string;
  topic?: string;
  delegateType?: string;
  activities?: string[];
  bankAccount?: string;
  taxCode?: string;
  fileId?: string;
  fileName?: string;
}) => fetchAPI('/public/registrations', { method: 'POST', body: JSON.stringify(data) });

export const submitPublicContact = (data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => fetchAPI('/public/contacts', { method: 'POST', body: JSON.stringify(data) });

// --- SITE CONTENT ---
export const getSiteContent = () => {
  return fetchAPI('/site-content');
};

export const updateSiteContent = (data: Record<string, any>) => {
  return fetchAPI('/site-content', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
