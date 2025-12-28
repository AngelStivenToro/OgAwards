import { User } from './types';
import { DatabaseService } from './database';
import { AuthSystem } from './auth';

export class AuthDB {
  private static readonly CURRENT_USER_KEY = 'ogawards_current_user';

  static async register(username: string, email: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await DatabaseService.getUserByUsername(username);
      if (existingUser) {
        return { success: false, error: 'El nombre de usuario ya está en uso' };
      }

      const result = await DatabaseService.createUser(username, email);
      return result;
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        return AuthSystem.register(username, email);
      }
      return { success: false, error: error.message };
    }
  }

  static async login(username: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = await DatabaseService.getUserByUsername(username);
      
      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      this.setCurrentUser(user);
      return { success: true, user };
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        return AuthSystem.login(username);
      }
      return { success: false, error: error.message };
    }
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

  static async updateUserHasVoted(userId: string): Promise<void> {
    try {
      await DatabaseService.updateUserHasVoted(userId);
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        AuthSystem.updateUserHasVoted(userId);
        return;
      }
    }
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.hasVoted = true;
      this.setCurrentUser(currentUser);
    }
  }
}
