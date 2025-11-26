import { useState, useCallback } from "react";

/**
 * Shared request helper factory
 * - returns a hook that exposes request + loading + error
 */
function createUseBase(basePath) {
  return function useBase() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
      async (url, options = {}) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            ...options,
          });

          // handle 204 No Content
          if (res.status === 204) {
            setLoading(false);
            return true;
          }

          const text = await res.text();
          let data = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch (e) {
            data = text;
          }

          setLoading(false);

          if (!res.ok) {
            const msg = (data && (data.error || data.message)) || res.statusText || `HTTP ${res.status}`;
            throw new Error(msg);
          }

          return data;
        } catch (err) {
          setError(err.message || String(err));
          setLoading(false);
          return null;
        }
      },
      [setLoading, setError]
    );

    return { request, loading, error };
  };
}

const API_BASE = "http://localhost:3000";

/* ---------- Generic resource hooks for CRUD ---------- */
function createUseResource(basePath) {
  const useBase = createUseBase(basePath);
  return function useResource() {
    const { request, loading, error } = useBase();

    const getAll = useCallback(() => request(`${basePath}`), [request, basePath]);
    const getOne = useCallback((id) => request(`${basePath}/${id}`), [request, basePath]);
    const create = useCallback((body) => request(`${basePath}`, { method: "POST", body: JSON.stringify(body) }), [
      request,
      basePath,
    ]);
    const update = useCallback((id, body) => request(`${basePath}/${id}`, { method: "PUT", body: JSON.stringify(body) }), [
      request,
      basePath,
    ]);
    const patch = useCallback((id, body) => request(`${basePath}/${id}`, { method: "PATCH", body: JSON.stringify(body) }), [
      request,
      basePath,
    ]);
    const remove = useCallback((id) => request(`${basePath}/${id}`, { method: "DELETE" }), [request, basePath]);

    return { loading, error, getAll, getOne, create, update, patch, remove };
  };
}

/* ---------- GET-only resource hooks ---------- */
function createUseReadOnlyResource(basePath) {
  const useBase = createUseBase(basePath);
  return function useReadOnly() {
    const { request, loading, error } = useBase();

    const getAll = useCallback(() => request(`${basePath}`), [request, basePath]);
    const getOne = useCallback((id) => request(`${basePath}/${id}`), [request, basePath]);

    return { loading, error, getAll, getOne };
  };
}

/* ---------- Export the hooks matching your endpoints ---------- */
export const useUsersApi = createUseResource(`${API_BASE}/users`);
export const useEmployeesApi = createUseResource(`${API_BASE}/employees`);
export const useSubTasksApi = createUseResource(`${API_BASE}/subTasks`);
export const useProjectsApi = createUseResource(`${API_BASE}/projects`);

export const useAdminSidebar = createUseReadOnlyResource(`${API_BASE}/adminSidebar`);
export const useUserSidebar = createUseReadOnlyResource(`${API_BASE}/userSidebar`);
