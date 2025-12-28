import { supabase } from './supabase';
import { User, Award, Vote } from './types';

export class DatabaseService {
  private static checkSupabase() {
    if (!supabase) {
      throw new Error('Supabase no está configurado. Por favor, crea un archivo .env.local con las credenciales de Supabase.');
    }
  }
  // Usuarios
  static async createUser(username: string, email: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      this.checkSupabase();
      const client = supabase!;
      const { data, error } = await client
        .from('users')
        .insert([{ username, email, has_voted: false }])
        .select()
        .single();

      if (error) throw error;

      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        createdAt: data.created_at,
        hasVoted: data.has_voted
      };

      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      this.checkSupabase();
      const client = supabase!;
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        username: data.username,
        email: data.email,
        createdAt: data.created_at,
        hasVoted: data.has_voted
      };
    } catch {
      return null;
    }
  }

  static async updateUserHasVoted(userId: string): Promise<void> {
    this.checkSupabase();
    const client = supabase!;
    await client
      .from('users')
      .update({ has_voted: true })
      .eq('id', userId);
  }

  // Premios
  static async getAwards(): Promise<Award[]> {
    try {
      this.checkSupabase();
      const client = supabase!;
      const { data, error } = await client
        .from('awards')
        .select(`
          *,
          nominees (*)
        `);

      if (error) throw error;

      return data.map(award => ({
        id: award.id,
        title: award.title,
        description: award.description,
        category: award.category,
        nominees: award.nominees.map((nominee: any) => ({
          id: nominee.id,
          name: nominee.name,
          description: nominee.description,
          image: nominee.image,
          media: nominee.media_type ? {
            type: nominee.media_type,
            ...(nominee.media_url && { url: nominee.media_url }),
            ...(nominee.media_content && { content: nominee.media_content }),
            ...(nominee.media_title && { title: nominee.media_title })
          } : undefined
        }))
      }));
    } catch {
      return [];
    }
  }

  static async initializeAwards(): Promise<void> {
    // Ya no inicializa datos estáticos, usa los datos existentes en la DB
    return;
  }

  // Votos
  static async submitVote(userId: string, awardId: string, rankings: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      this.checkSupabase();
      const client = supabase!;
      const { error } = await client
        .from('votes')
        .insert([{
          user_id: userId,
          award_id: awardId,
          rankings
        }]);

      if (error) throw error;

      // Verificar si el usuario ya votó en todas las categorías
      const awards = await this.getAwards();
      const { data: userVotes } = await client
        .from('votes')
        .select('award_id')
        .eq('user_id', userId);

      const hasVotedAllAwards = awards.every(award => 
        userVotes?.some(vote => vote.award_id === award.id)
      );

      if (hasVotedAllAwards) {
        await this.updateUserHasVoted(userId);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getVotes(awardId: string): Promise<Vote[]> {
    try {
      this.checkSupabase();
      const client = supabase!;
      const { data, error } = await client
        .from('votes')
        .select('*')
        .eq('award_id', awardId);

      if (error) throw error;

      return data.map(vote => ({
        id: vote.id,
        userId: vote.user_id,
        awardId: vote.award_id,
        rankings: vote.rankings,
        timestamp: vote.created_at
      }));
    } catch {
      return [];
    }
  }

  static async getResults(awardId: string) {
    const votes = await this.getVotes(awardId);
    const awards = await this.getAwards();
    const award = awards.find(a => a.id === awardId);
    
    if (!award) return [];

    const results: { [key: string]: number } = {};

    votes.forEach(vote => {
      vote.rankings.forEach((nomineeId: string, index: number) => {
        if (index < 3) {
          const points = 3 - index;
          results[nomineeId] = (results[nomineeId] || 0) + points;
        }
      });
    });

    return award.nominees
      .map(nominee => ({
        nominee,
        points: results[nominee.id] || 0
      }))
      .sort((a, b) => b.points - a.points);
  }
}
