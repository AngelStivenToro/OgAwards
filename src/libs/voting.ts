import { Award, Vote, Nominee } from './types';
import { AuthSystem } from './auth';

export class VotingSystem {
  private static readonly AWARDS_KEY = 'ogawards_awards';
  private static readonly VOTES_KEY = 'ogawards_votes';

  static initializeAwards(): void {
    // Los datos vienen de la base de datos, no se inicializan estáticamente
    return;
  }

  static getAwards(): Award[] {
    const data = localStorage.getItem(this.AWARDS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAwards(awards: Award[]): void {
    localStorage.setItem(this.AWARDS_KEY, JSON.stringify(awards));
  }

  static getVotes(): Vote[] {
    const data = localStorage.getItem(this.VOTES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveVotes(votes: Vote[]): void {
    localStorage.setItem(this.VOTES_KEY, JSON.stringify(votes));
  }

  static submitVote(awardId: string, rankings: string[]): { success: boolean; error?: string } {
    const currentUser = AuthSystem.getCurrentUser();
    
    if (!currentUser) {
      return { success: false, error: 'Debes iniciar sesión para votar' };
    }

    if (currentUser.hasVoted) {
      return { success: false, error: 'Ya has votado anteriormente' };
    }

    const votes = this.getVotes();
    
    // Verificar si el usuario ya votó para este premio
    if (votes.some(v => v.userId === currentUser.id && v.awardId === awardId)) {
      return { success: false, error: 'Ya has votado para esta categoría' };
    }

    const newVote: Vote = {
      id: this.generateId(),
      userId: currentUser.id,
      awardId,
      rankings,
      timestamp: new Date().toISOString()
    };

    votes.push(newVote);
    this.saveVotes(votes);

    // Verificar si el usuario ya votó en todas las categorías
    const awards = this.getAwards();
    const userVotesForAllAwards = awards.every(award => 
      votes.some(v => v.userId === currentUser.id && v.awardId === award.id)
    );

    if (userVotesForAllAwards) {
      AuthSystem.updateUserHasVoted(currentUser.id);
    }

    return { success: true };
  }

  static getResults(awardId: string): { nominee: Nominee; points: number }[] {
    const votes = this.getVotes().filter(v => v.awardId === awardId);
    const award = this.getAwards().find(a => a.id === awardId);
    
    if (!award) return [];

    const results: { [key: string]: number } = {};

    // Sistema de puntos: 1er lugar = 3 puntos, 2do = 2 puntos, 3ro = 1 punto
    votes.forEach(vote => {
      vote.rankings.forEach((nomineeId, index) => {
        if (index < 3) { // Solo contar los primeros 3 lugares
          const points = 3 - index; // 3, 2, 1 puntos respectivamente
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

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
