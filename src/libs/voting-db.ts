import { Award, Vote, Nominee } from './types';
import { AuthDB } from './auth-db';
import { DatabaseService } from './database';
import { VotingSystem } from './voting';

export class VotingDB {
  static async initializeAwards(): Promise<void> {
    try {
      await DatabaseService.initializeAwards();
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        VotingSystem.initializeAwards();
      }
    }
  }

  static async getAwards(): Promise<Award[]> {
    try {
      return await DatabaseService.getAwards();
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        return VotingSystem.getAwards();
      }
      return [];
    }
  }

  static async submitVote(awardId: string, rankings: string[]): Promise<{ success: boolean; error?: string }> {
    const currentUser = AuthDB.getCurrentUser();
    
    if (!currentUser) {
      return { success: false, error: 'Debes iniciar sesión para votar' };
    }

    if (currentUser.hasVoted) {
      return { success: false, error: 'Ya has votado anteriormente' };
    }

    try {
      const result = await DatabaseService.submitVote(currentUser.id, awardId, rankings);
      
      // Si el voto fue exitoso, verificar si es el último voto
      if (result.success) {
        const awards = await this.getAwards();
        const votes = await this.getVotes(awardId);
        
        // Verificar si el usuario ha votado en todas las categorías
        let userVotesForAllAwards = true;
        for (const award of awards) {
          const awardVotes = await this.getVotes(award.id);
          const hasVotedForAward = awardVotes.some((vote: any) => vote.userId === currentUser.id);
          if (!hasVotedForAward) {
            userVotesForAllAwards = false;
            break;
          }
        }
        
        // Si ha votado en todas las categorías, actualizar el estado
        if (userVotesForAllAwards) {
          await AuthDB.updateUserHasVoted(currentUser.id);
        }
      }
      
      return result;
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        return VotingSystem.submitVote(awardId, rankings);
      }
      return { success: false, error: error.message };
    }
  }

  static async getVotes(awardId: string): Promise<any[]> {
    try {
      return await DatabaseService.getVotes(awardId);
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        return VotingSystem.getVotes();
      }
      return [];
    }
  }

  static async getResults(awardId: string): Promise<{ nominee: Nominee; points: number }[]> {
    try {
      return await DatabaseService.getResults(awardId);
    } catch (error: any) {
      // Si Supabase no está configurado, usar localStorage
      if (error.message.includes('Supabase no está configurado')) {
        return VotingSystem.getResults(awardId);
      }
      return [];
    }
  }
}
