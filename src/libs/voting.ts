import { Award, Vote, Nominee } from './types';
import { AuthSystem } from './auth';

export class VotingSystem {
  private static readonly AWARDS_KEY = 'ogawards_awards';
  private static readonly VOTES_KEY = 'ogawards_votes';

  static initializeAwards(): void {
    const existingAwards = this.getAwards();
    if (existingAwards.length === 0) {
      const defaultAwards: Award[] = [
        {
          id: 'award-1',
          title: 'Mejor Juego del Año',
          category: 'Juegos',
          description: 'El juego más destacado y completo del año',
          nominees: [
            { id: 'nom-1-1', name: 'The Legend of Zelda: Tears of the Kingdom', description: 'Aventura épica en Hyrule' },
            { id: 'nom-1-2', name: 'Baldur\'s Gate 3', description: 'RPG de fantasía revolucionario' },
            { id: 'nom-1-3', name: 'Marvel\'s Spider-Man 2', description: 'Aventura de superhéroes' },
            { id: 'nom-1-4', name: 'Starfield', description: 'Exploración espacial de Bethesda' }
          ]
        },
        {
          id: 'award-2',
          title: 'Mejor Desarrollo Independiente',
          category: 'Indie',
          description: 'El mejor juego desarrollado por un estudio independiente',
          nominees: [
            { id: 'nom-2-1', name: 'Hades II', description: 'Roguelike mitológico' },
            { id: 'nom-2-2', name: 'Pizza Tower', description: 'Plataformas 2D caótico' },
            { id: 'nom-2-3', name: 'Dredge', description: 'Aventura de pesca misteriosa' },
            { id: 'nom-2-4', name: 'Sea of Stars', description: 'RPG retro inspirado en clásicos' }
          ]
        },
        {
          id: 'award-3',
          title: 'Mejor Artista Visual',
          category: 'Arte',
          description: 'Reconocimiento al mejor trabajo artístico y visual',
          nominees: [
            { id: 'nom-3-1', name: 'Alan Wake 2', description: 'Fotorealismo y terror psicológico' },
            { id: 'nom-3-2', name: 'Hi-Fi Rush', description: 'Estilo visual único y colorido' },
            { id: 'nom-3-3', name: 'Diablo IV', description: 'Dark fantasy detallado' },
            { id: 'nom-3-4', name: 'Final Fantasy XVI', description: 'Fantasy épico con gráficos impresionantes' }
          ]
        }
      ];
      this.saveAwards(defaultAwards);
    }
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
