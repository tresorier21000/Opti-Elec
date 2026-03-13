# Calculateur d'Électricité Unifié ⚡ (v1.0)

Une application web simple et moderne permettant de calculer la rentabilité de votre contrat d'électricité en comparant l'option de **Base** et l'option **Heures Pleines / Heures Creuses (HP/HC)**.

## 🎯 Fonctionnalités

*   **100% Client-Side** : L'application fonctionne entièrement dans votre navigateur (HTML/CSS/JS). Aucune donnée n'est envoyée à un serveur externe.
*   **Deux modes de calcul** :
    *   *J'ai ma conso Totale* : Calcule la part d'Heures Creuses nécessaire pour rentabiliser le contrat HP/HC.
    *   *J'ai ma conso Heures Pleines* : Calcule la consommation d'Heures Creuses minimum requise.
*   **Gestionnaire de Profils Tarifaires** : Configurez les tarifs de différents opérateurs (EDF, Alpiq, TotalEnergies, etc.) à des dates spécifiques.
*   **Import / Export** : Sauvegardez vos profils tarifaires sous forme de fichier `.json` sur votre ordinateur pour les conserver ou les partager.
*   **Design Sombre (Dark Mode)** : Une interface moderne, pensée pour le confort visuel.

## 🚀 Utilisation

1.  Téléchargez ou clonez ce dépôt sur votre machine.
2.  Double-cliquez sur le fichier `index.html` pour l'ouvrir dans n'importe quel navigateur web moderne (Chrome, Firefox, Safari, Edge).
3.  Sélectionnez votre puissance de compteur (ex: 6 kVA ou 9 kVA).
4.  Entrez votre consommation annuelle.
5.  Cliquez sur **Calculer** !

## 📁 Architecture du projet

Le code est divisé selon les bonnes pratiques du développement web :

*   `index.html` : Structure de la page et contenu.
*   `style.css` : Mise en forme, couleurs sombres et animations.
*   `app.js` : Logique de l'application (calculs mathématiques et gestion de la base de données locale `localStorage`).
*   `favicon.svg` : L'icône du site.

## 🛠️ Configuration des Tarifs

Par défaut, l'application intègre les tarifs d'**Alpiq** (01/02/2026).
Vous pouvez cliquer sur le petit crayon ✏️ pour modifier ces tarifs, ou sur le bouton **+** pour ajouter votre propre opérateur avec ses grilles tarifaires spécifiques (Prix de l'abonnement et prix du kWh).

---
*Ce calculateur est fourni à titre indicatif pour vous aider à optimiser vos factures d'énergie.*
