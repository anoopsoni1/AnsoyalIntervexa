const API_BASE_URL =
  "https://ansoyalintervexa-1.onrender.com/api"

export class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem("ansoyal_recruiter_token");
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("ansoyal_recruiter_token");
      localStorage.removeItem("ansoyal_recruiter_user");
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        window.location.href = "/login";
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      (err as any).code = data?.code;
      (err as any).status = response.status;
      throw err;
    }

    return data?.data !== undefined ? data.data : data;
  }

  public get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          searchParams.append(k, String(v));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>(url, { method: "GET" });
  }

  public post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  public getCandidateById(id: string) {
    return this.get(`/candidates/${id}`);
  }

  public getCandidateEvidence(id: string) {
    return this.get(`/candidates/${id}/evidence`);
  }

  public getCandidateNotes(id: string) {
    return this.get(`/candidates/${id}/notes`);
  }

  public addCandidateNote(id: string, note: string) {
    return this.post(`/candidates/${id}/notes`, { note });
  }

  public deleteCandidateNote(candidateId: string, noteId: string) {
    return this.delete(`/candidates/${candidateId}/notes/${noteId}`);
  }
}

export const api = new ApiClient();
