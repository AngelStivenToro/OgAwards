import { User } from './types';

export class AuthSystem {
  private static readonly STORAGE_KEY = 'ogawards_users';
  private static readonly CURRENT_USER_KEY = 'ogawards_current_user';

  static register(username: string, email: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    
    // Verificar si el usuario ya existe
    if (users.some(u => u.username === username)) {
      return { success: false, error: 'El nombre de usuario ya está en uso' };
    }
    
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const newUser: User = {
      id: this.generateId(),
      username,
      email,
      createdAt: new Date().toISOString(),
      hasVoted: false
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return { success: true, user: newUser };
  }

  static login(username: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static updateUserHasVoted(userId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].hasVoted = true;
      this.saveUsers(users);
      
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.hasVoted = true;
        this.setCurrentUser(currentUser);
      }
    }
  }

  static getUsers(): User[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
