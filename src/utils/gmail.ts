export async function checkGmailFilter(accessToken: string): Promise<boolean> {
  try {
    console.log('Vérification des filtres...');
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/settings/filters', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Erreur HTTP lors de la vérification:', response.status);
      if (response.status === 401 || response.status === 403) {
        throw new Error("Erreur d'autorisation. Veuillez vous reconnecter.");
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    // Log the raw response for debugging
    const text = await response.text();
    console.log('Réponse brute:', text);

    if (!text) {
      console.log('Réponse vide reçue');
      return false;
    }

    // Try to parse the response
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Erreur de parsing JSON:', e);
      console.log('Contenu de la réponse qui a causé l\'erreur:', text);
      return false;
    }

    console.log('Données des filtres:', data);

    // Vérifier si la réponse contient des filtres
    if (!data || !data.filter || !Array.isArray(data.filter)) {
      console.log('Aucun filtre trouvé dans la réponse');
      return false;
    }

    // Chercher notre filtre spécifique
    const filterExists = data.filter.some((filter: any) => {
      // Vérifie si c'est un filtre qui correspond à nos critères :
      // - from: "*" (tous les expéditeurs)
      // - action qui ajoute le label TRASH
      const isOurFilter = filter?.criteria?.from === '*' && 
                         filter?.action?.addLabelIds?.includes('TRASH');
      
      if (isOurFilter) {
        console.log('Filtre trouvé:', filter);
      }
      
      return isOurFilter;
    });

    console.log('État du filtre:', filterExists);
    return filterExists;

  } catch (error) {
    console.error('Erreur lors de la vérification du filtre:', error);
    return false;
  }
}

export async function createGmailFilter(accessToken: string): Promise<void> {
  try {
    // Vérifier d'abord si le filtre existe déjà
    const exists = await checkGmailFilter(accessToken);
    if (exists) {
      console.log('Le filtre existe déjà');
      return;
    }

    // Créer le filtre
    console.log('Création du filtre...');
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/settings/filters', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        criteria: {
          from: '*'
        },
        action: {
          addLabelIds: ['TRASH'],
          removeLabelIds: ['INBOX']
        }
      })
    });

    if (!response.ok) {
      throw new Error('Impossible de créer le filtre');
    }

  } catch (error) {
    console.error('Erreur lors de la création du filtre:', error);
    throw error;
  }
}

export async function removeGmailFilter(accessToken: string): Promise<void> {
  try {
    console.log('Récupération des filtres...');
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/settings/filters', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur HTTP lors de la récupération des filtres:', response.status, errorText);
      throw new Error(`Erreur lors de la récupération des filtres: ${response.status}`);
    }

    const text = await response.text();
    console.log('Réponse brute de la liste des filtres:', text);

    if (!text) {
      console.log('Aucun filtre trouvé (réponse vide)');
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Erreur lors du parsing de la réponse:', e);
      console.log('Contenu qui a causé l\'erreur:', text);
      throw new Error('Impossible de lire la liste des filtres');
    }

    console.log('Données des filtres récupérées:', data);

    if (!data?.filter || !Array.isArray(data.filter)) {
      console.log('Aucun filtre trouvé dans la réponse');
      return;
    }

    // Trouver notre filtre spécifique
    const filtersToDelete = data.filter.filter((filter: any) => {
      // Simplifie la vérification pour correspondre à la fonction checkGmailFilter
      const isOurFilter = filter?.criteria?.from === '*' && 
                         filter?.action?.addLabelIds?.includes('TRASH');

      if (isOurFilter) {
        console.log('Filtre à supprimer trouvé:', filter);
      }

      return isOurFilter;
    });

    console.log(`Nombre de filtres à supprimer: ${filtersToDelete.length}`);

    if (filtersToDelete.length === 0) {
      console.log('Aucun filtre correspondant trouvé');
      return;
    }

    // Supprimer chaque filtre trouvé
    for (const filter of filtersToDelete) {
      console.log(`Tentative de suppression du filtre ${filter.id}...`);
      
      try {
        const deleteResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/settings/filters/${filter.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!deleteResponse.ok) {
          const deleteText = await deleteResponse.text();
          console.error(`Erreur lors de la suppression du filtre ${filter.id}:`, deleteResponse.status, deleteText);
          throw new Error(`Échec de la suppression du filtre ${filter.id}: ${deleteResponse.status}`);
        }

        console.log(`Filtre ${filter.id} supprimé avec succès`);
      } catch (error) {
        console.error(`Erreur lors de la suppression du filtre ${filter.id}:`, error);
        throw error;
      }
    }

    console.log('Suppression des filtres terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression des filtres:', error);
    throw error instanceof Error ? error : new Error('Erreur inconnue lors de la suppression des filtres');
  }
}