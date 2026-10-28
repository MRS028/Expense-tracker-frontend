import type {
  AuthResponse,
  FilterParams,
  Transaction,
  TransactionInput,
} from "../types";

const BASE_URL = "http://localhost:8000";
const TOKEN_KEY = "expense_tracker_token";
const USER_KEY = "expense_tracker_user";

// ============ TOKEN HELPERS ============

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ============ REQUEST WRAPPER ============

/**
 * Custom options type — allows passing plain objects as body.
 * Non-string / non-FormData bodies are automatically JSON-stringified.
 */
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | object | null;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Normalize body: object → JSON string (unless it's FormData / URLSearchParams / etc.)
  let body: BodyInit | null | undefined = options.body as
    | BodyInit
    | null
    | undefined;

  if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer)
  ) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  // 401 → clear session and force re-login
  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }

  // Safe JSON parse — empty bodies (e.g., 204) won't throw
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = (data as { detail?: unknown }).detail;
    let msg = `Request failed (${res.status})`;

    if (typeof detail === "string") {
      msg = detail;
    } else if (Array.isArray(detail)) {
      msg = detail
        .map((d: { msg?: string }) => d.msg || "")
        .filter(Boolean)
        .join(", ");
    }

    throw new Error(msg);
  }

  return data as T;
}

// ============ AUTH ============

export async function register(data: {
  username: string;
  email: string;
  password: string;
}): Promise<{ username: string }> {
  return request("/auth/register", { method: "POST", body: data });
}

export async function login(data: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const body = new URLSearchParams({
    username: data.username,
    password: data.password,
  });

  return request<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

// ============ TRANSACTIONS ============

export function listTransactions(): Promise<Transaction[]> {
  return request("/transactions/");
}

export function createTransaction(
  data: TransactionInput,
): Promise<Transaction> {
  return request("/transactions/", { method: "POST", body: data });
}

export function updateTransaction(
  id: number,
  data: Partial<TransactionInput>,
): Promise<Transaction> {
  return request(`/transactions/${id}`, { method: "PUT", body: data });
}

export function deleteTransaction(id: number): Promise<{ message: string }> {
  return request(`/transactions/${id}`, { method: "DELETE" });
}

export function filterTransactions(
  filters: FilterParams,
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters.type) params.append("type", filters.type);
  if (filters.category) params.append("category", filters.category);
  if (filters.minimum_amount)
    params.append("minimum_amount", filters.minimum_amount);
  if (filters.maximum_amount)
    params.append("maximum_amount", filters.maximum_amount);

  const qs = params.toString();
  return request(`/transactions/filter${qs ? "?" + qs : ""}`);
}