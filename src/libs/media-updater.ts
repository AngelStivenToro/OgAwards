import { Nominee } from './types';

// Función para agregar campos multimedia a nominaciones existentes
export function addMediaToNominee(
  nominee: Nominee, 
  media: {
    type: "image" | "video" | "audio" | "text";
    url?: string;
    content?: string;
    title?: string;
  }
): Nominee {
  return {
    ...nominee,
    media: {
      type: media.type,
      ...(media.url && { url: media.url }),
      ...(media.content && { content: media.content }),
      ...(media.title && { title: media.title })
    }
  };
}

// Ejemplo de cómo actualizar nominaciones específicas
export function updateNomineesWithMedia(): void {
  // Esto se ejecutaría una vez para actualizar la base de datos
  // Solo si la nominación no tiene media previamente
  
  const updates = [
    {
      nomineeId: 'nom-1-1',
      media: {
        type: 'video' as const,
        url: '/media/videos/zelda-trailer.mp4',
        title: 'Trailer Oficial'
      }
    },
    {
      nomineeId: 'nom-1-2', 
      media: {
        type: 'image' as const,
        url: '/media/images/bg3-screenshot.jpg',
        title: 'Gameplay Principal'
      }
    },
    {
      nomineeId: 'nom-1-3',
      media: {
        type: 'audio' as const,
        url: '/media/audio/spiderman-theme.mp3',
        title: 'Banda Sonora Principal'
      }
    },
    {
      nomineeId: 'nom-1-4',
      media: {
        type: 'text' as const,
        content: 'Starfield es el primer nuevo universo de Bethesda en 25 años. Como miembro de Constellation, explorarás el vasto espacio y descubrirás más de 1000 planetas...',
        title: 'Descripción Extendida'
      }
    }
  ];

  // Aquí iría la lógica para actualizar la base de datos
  // Por ejemplo, si usas Supabase:
  /*
  updates.forEach(async ({ nomineeId, media }) => {
    const { error } = await supabase
      .from('nominees')
      .update({
        media_type: media.type,
        media_url: media.url,
        media_content: media.content,
        media_title: media.title
      })
      .eq('id', nomineeId);
    
    if (error) console.error('Error updating nominee:', error);
  });
  */
}

// SQL para actualizar la tabla existente (ejecutar una vez)
export const SQL_MIGRATION = `
-- Agregar columnas multimedia a la tabla nominees si no existen
ALTER TABLE nominees 
ADD COLUMN IF NOT EXISTS media_type TEXT,
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_content TEXT,
ADD COLUMN IF NOT EXISTS media_title TEXT;

-- Ejemplos de actualización (opcional)
UPDATE nominees 
SET 
  media_type = 'video',
  media_url = '/media/videos/zelda-trailer.mp4',
  media_title = 'Trailer Oficial'
WHERE id = 'nom-1-1';

UPDATE nominees 
SET 
  media_type = 'image',
  media_url = '/media/images/bg3-screenshot.jpg',
  media_title = 'Gameplay Principal'
WHERE id = 'nom-1-2';
`;
