const AUTH_API = 'https://functions.poehali.dev/7e2125b0-9663-47fe-a1cf-3c4b5afe7853';
const PAYMENT_API = 'https://functions.poehali.dev/7c696557-488d-42e0-a193-282914f9990e';

export interface User {
  id: number;
  email: string;
  telegram_id?: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface Order {
  id: number;
  type: 'star' | 'premium';
  amount?: number;
  months?: number;
  price: number;
  status: string;
  payment_method?: string;
  date: string;
  completed_at?: string;
}

export const api = {
  async register(email: string, password: string, telegram_id?: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, telegram_id })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка регистрации');
    }
    
    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка входа');
    }
    
    return response.json();
  },

  async verifyToken(token: string): Promise<{ user: User }> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'verify' })
    });
    
    if (!response.ok) {
      throw new Error('Токен недействителен');
    }
    
    return response.json();
  },

  async createPayment(
    token: string,
    order_type: 'star' | 'premium',
    price: number,
    amount?: number,
    months?: number,
    telegram_user_id?: string
  ): Promise<{ order_id: number; payment_url: string; payment_id: string }> {
    const response = await fetch(PAYMENT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'create',
        order_type,
        amount,
        months,
        price,
        telegram_user_id
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка создания платежа');
    }
    
    return response.json();
  },

  async getOrders(token: string): Promise<{ orders: Order[] }> {
    const response = await fetch(PAYMENT_API, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка получения заказов');
    }
    
    return response.json();
  }
};

export const auth = {
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  removeToken() {
    localStorage.removeItem('auth_token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem('user');
  },

  logout() {
    this.removeToken();
    this.removeUser();
  }
};
